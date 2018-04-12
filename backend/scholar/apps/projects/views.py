from rest_framework import status
from rest_framework.exceptions import NotFound, AuthenticationFailed, NotAuthenticated
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework_json_api.views import ModelViewSet

from .models import Paper, File, Project, Document, Oss
from .serializers import PaperSerializer, FileSerializer, ProjectSerializer, DocumentSerializer, OssSerializer
from scholar.apps.core.mixins import OssMixin
from rest_framework.decorators import list_route
from rest_framework.parsers import JSONParser
from .tasks import pdf_read


class ProjectViewSet(ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = ProjectSerializer
    resource_name = 'projects'
    prefetch_for_includes = {
        '__all__': [],
        'files': ['files'],
        'documents': ['documents']
    }

    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        if user.is_anonymous():
            raise AuthenticationFailed('You need authenticated')
        creator = user.profile
        queryset = Project.objects.filter(creator__pk=creator.pk)

        return queryset

    def create(self, request):
        context = {
            'creator': request.user.profile,
        }
        data = request.data
        serializer = self.serializer_class(data=data, context=context)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class PaperViewSet(ModelViewSet):
    serializer_class = PaperSerializer
    queryset = Paper.objects.all()


class OssViewset(ModelViewSet):
    queryset = Oss.objects.all()
    serializer_class = OssSerializer

    @list_route(methods=['POST'], parser_classes=(JSONParser,), permission_classes=(AllowAny,))
    def callback(self, request):
        data = request.data
        etag = data.get('etag', None)
        oss = self.queryset.get(etag=etag)
        serializer = self.serializer_class(oss, data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # 测试环境用外网访问，生产环境换成阿里云的内网, 测试时候暂时关闭
        # pdf_read.delay(etag)

        return Response(serializer.data, status=status.HTTP_200_OK)


class FileViewSet(ModelViewSet, OssMixin):
    serializer_class = FileSerializer
    permission_classes = (IsAuthenticated,)
    prefetch_for_inlcudes = {
        '__all__': [],
        'paper': ['paper']
    }
    upload_dir = 'papers/'
    use_callback = True
    callback_url = 'http://api.linkick.com/api/v1/osses/callback'

    def get_queryset(self, *args, **kwargs):
        queryset = File.objects.all()
        user = self.request.user
        if user.is_anonymous():
            raise AuthenticationFailed('You need login to see you files')
        # profile = user.profile
        # queryset = queryset.filter(owned__id=profile.id)
        if 'project_pk' in self.kwargs:
            project_pk = self.kwargs['project_pk']
            # TODO 这里可能会出现问题，需要调整
            queryset = queryset.filter(projects__pk=project_pk)
        return queryset

    def create(self, *args, **kwargs):
        user = self.request.user
        if user.is_anonymous():
            raise AuthenticationFailed('You need login to see you files')
        project_pk = kwargs.get('project_pk', None)
        if project_pk is None:
            raise NotFound('Library not found')
        data = self.request.data
        filehash = data.pop('hash', None)

        context = {
            'profile': user.profile,
            'project_pk': project_pk,
            'filehash': filehash.upper()
        }

        serializer = self.serializer_class(data=data, context=context)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        data = serializer.data

        # oss = data.get('oss', None)
        url = data.get('url', None)
        if url is None:
            token = self.get_token(filehash=filehash)
            return Response(token, status=status.HTTP_200_OK)
        return Response(data, status=status.HTTP_201_CREATED)


class DocumentViewSet(ModelViewSet, OssMixin):
    serializer_class = DocumentSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    prefetch_for_includes = {
        '__all__': [],
        'project': ['project']
    }
    upload_dir = 'doc-images/'

    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        params = self.request.query_params

        if user.is_anonymous():
            raise NotAuthenticated('You need authenticated')

        queryset = Document.objects.all()

        if 'project_pk' in self.kwargs:
            project_pk = self.kwargs['project_pk']
            queryset = queryset.filter(project__pk=project_pk)
        type = params.get('type', None)
        limit = params.get('limit', None)

        if type is not None:
            if type == 'viewed':
                queryset = queryset.order_by('updated_at')
            if type == 'edited':
                queryset = queryset.order_by('created_at')
        if limit is not None:
            queryset = queryset.slice(0, limit)
        return queryset

    def create(self, *args, **kwargs):
        data = self.request.data
        project_pk = kwargs.get('project_pk', None)
        if project_pk is None:
            raise NotFound('Project not found')
        context = {
            'request': self.request,
            'project_pk': project_pk
        }

        serializer = self.serializer_class(data=data, context=context)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @list_route(methods=['POST'], parser_classes=(JSONParser,), permission_classes=(AllowAny,))
    def oss(self, request):
        data = request.data
        filename = data.get('filename')
        kind = data.get('kind')
        token = self.get_token(filename=filename)
        url = token['action'] + '/' + token['key']
        token['url'] = url
        return Response(token, status=status.HTTP_200_OK)
