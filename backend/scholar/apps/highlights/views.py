from django.db.models import Q
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
# from rest_framework.views import APIView
from rest_framework_json_api.views import ModelViewSet

from scholar.apps.profiles.models import Profile
from .models import Highlight, Channel, Annotation
from .serializers import HighlightSerializer, ChannelSerializer, AnnotationSerializer


class ChannelViewSet(ModelViewSet):
    serializer_class = ChannelSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self, *args, **kwargs):
        queryset = Channel.objects.filter(public=True)
        user = self.request.user
        if user.is_authenticated():
            profile = user.profile
            user_query = Channel.objects.filter(owner_id=profile.id)
            queryset = queryset.union(user_query)
        if 'file_pk' in self.kwargs:
            file_pk = self.kwargs['file_pk']
            queryset = queryset.filter(file__pk=file_pk)
        if 'username' in self.kwargs:
            username = self.kwargs['username']
            profile = Profile.objects.get(user__username=username)
            queryset = Channel.objects.filter(author__pk=profile.pk)
        return queryset


class ChannelJoinViewSet():
    pass


class HighlightViewSet(ModelViewSet):
    serializer_class = HighlightSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    prefetch_for_includes = {
        '__all__': [],
        'author': ['author']
    }

    def get_queryset(self):
        queryset = Highlight.objects.all()
        user = self.request.user
        # if user.is_authenticated():
        #     profile = user.profile
        #     querset = querset.filter(author_id=profile.id)
        #     # queryset = queryset.filter(
        #     #     Q(author_id=profile.id) | Q(channel__public=True))
        # else:
        #     queryset = queryset.filter(channel__public=True)
        if 'file_pk' in self.kwargs:
            file_pk = self.kwargs['file_pk']
            queryset = queryset.filter(file__pk=file_pk)
        if 'username' in self.kwargs:
            username = self.kwargs['username']
            profile = Profile.objects.get(user__username=username)
            queryset = Highlight.objects.filter(author__pk=profile.pk)
        return queryset

    def create(self, *args, **kwargs):
        data = self.request.data
        annotation = data.get('annotation', None)
        file_pk = kwargs.get('file_pk', None)
        if file_pk is None:
            raise NotFound('File Not found')
        context = {
            'request': self.request,
            'file_pk': file_pk,
            'annotation': annotation
        }
        serializer = self.serializer_class(data=data, context=context)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AnnotationViewSet(ModelViewSet):
    serializer_class = AnnotationSerializer

    def get_queryset(self, *args, **kwargs):
        queryset = Annotation.objects.all()
        if 'highlight_pk' in self.kwargs:
            highlight_pk = self.kwargs['highlight_pk']
            queryset = queryset.filter(highlight__pk=highlight_pk)
        return queryset

    def create(self, *args, **kwargs):
        data = self.request.data
        highlight_pk = kwargs.get('highlight_pk', None)
        if highlight_pk is None:
            raise NotFound('Highlight Not found')
        context = {
            'request': self.request,
            'highlight_pk': highlight_pk
        }
        serializer = self.serializer_class(data=data, context=context)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CommentViewSet(ModelViewSet):
    pass

# class HighlightFavoriteAPIView(APIView):
#     permission_classes = (IsAuthenticated,)
#     serializer_class = HighlightSerializer
#
#     def delete(self, request, Highlight_pk=None):
#         profile = request.user.profile
#
#         try:
#             highlight = Highlight.objects.get(pk=Highlight_pk)
#         except Highlight.DoesNotExist:
#             raise NotFound('Highlight was not found.')
#
#         profile.favorites.remove(highlight)
#
#         serializer = self.serializer_class(highlight, context={
#             'request': request
#         })
#
#         return Response(serializer.data, status=status.HTTP_200_OK)
#
#     def post(self, request, Highlight_pk=None):
#         profile = request.user.profile
#
#         try:
#             Highlight = Highlight.objects.get(pk=Highlight_pk)
#         except Highlight.DoesNotExist:
#             raise NotFound('Highlight was not found.')
#
#         profile.favorites.add(Highlight)
#
#         serializer = self.serializer_class(Highlight, context={
#             'request': request
#         })
#
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#
#
# class HighlightRelationshipsViewSet(ModelViewSet):
#     queryset = Highlight.objects.all()
