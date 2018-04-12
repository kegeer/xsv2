from django.conf import settings
from rest_framework.exceptions import NotFound
from rest_framework_json_api import serializers, relations

from scholar.apps.profiles.serializers import ProfileSerializer
from .models import Project, Document, Paper, Author, File, Journal, Oss


class ProjectSerializer(serializers.ModelSerializer):
    creator = ProfileSerializer(read_only=True)
    documents = serializers.ResourceRelatedField(many=True, read_only=True)
    files = serializers.ResourceRelatedField(many=True, read_only=True)

    included_serializers = {
        'documents': 'scholar.apps.projects.serializers.DocumentSerializer',
        'files': 'scholar.apps.projects.serializers.FileSerializer'
    }

    class Meta:
        model = Project
        fields = (
            'id',
            'name',
            'summary',
            'publicStatus',
            'readme',
            'color',
            'creator',
            'documents',
            'files'
        )

    def create(self, validated_data):
        creator = self.context.get('creator', None)
        library = Project.objects.create(creator=creator, **validated_data)

        return library

    class JSONAPIMeta:
        included_resources = ['files', 'documents']


class DocumentSerializer(serializers.ModelSerializer):
    createdAt = serializers.SerializerMethodField(method_name='get_created_at')
    updatedAt = serializers.SerializerMethodField(method_name='get_updated_at')
    publishedAt = serializers.SerializerMethodField(
        method_name='get_published_at')

    created_by = ProfileSerializer(read_only=True)
    updated_by = ProfileSerializer(read_only=True)

    parent = serializers.ResourceRelatedField(read_only=True)
    stars = serializers.ResourceRelatedField(many=True, read_only=True)
    views = serializers.ResourceRelatedField(many=True, read_only=True)

    project = serializers.ResourceRelatedField(read_only=True)

    included_serializers = {
        'parent': 'scholar.apps.projects.serializers.DocumentSerializer',
        'project': ProjectSerializer,
        'stars': ProfileSerializer,
        'views': ProfileSerializer,
    }

    class Meta:
        model = Document
        fields = (
            'id',
            'slug',
            'title',
            'text',
            'emoji',
            'parent',
            'stars',
            'views',
            'createdAt',
            'updatedAt',
            'publishedAt',
            'project',

            'created_by',
            'updated_by',
        )

    class JSONAPIMeta:
        resource_name = 'documents'
        included_resources = ['project']

    def create(self, validated_data):
        profile = self.context['request'].user.profile
        project_pk = self.context['project_pk']
        parent_id = validated_data.pop('parent', None)

        if parent_id is not None:
            try:
                parent = Document.objects.get(pk=parent_id)
            except Document.DoesNotExist:
                parent = None
        else:
            parent = None

        if project_pk is not None:
            try:
                project = Project.objects.get(pk=project_pk)
            except Project.DoesNotExist:
                raise NotFound('Project Not Found')

            document = Document.objects.create(
                **validated_data,
                parent=parent,
                created_by=profile,
                updated_by=profile,
                project=project,
            )
            return document

    def get_created_at(self, instance):
        return instance.created_at.isoformat()

    def get_updated_at(self, instance):
        return instance.updated_at.isoformat()

    def get_published_at(self, instance):
        published_at = instance.published_at
        if published_at is not None:
            return published_at.isoformat()


class JournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ['name', ]


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = [
            'initials',
            'forename',
            'lastname'
        ]


class PaperSerializer(serializers.ModelSerializer):
    journal = JournalSerializer(read_only=True)
    authors = AuthorSerializer(many=True, read_only=True)

    class Meta:
        model = Paper

        fields = [
            'journal',
            'authors',
            'title',
            'abstract',
            'year',
            'month',
            'volume',
            'pages',
            'page_from',
            'page_to',
        ]


class OssSerializer(serializers.ModelSerializer):
    paper = relations.ResourceRelatedField(read_only=True)

    included_serializers = {
        'paper': PaperSerializer,
    }

    class Meta:
        model = Oss
        fields = (
            'id',
            'bucket',
            'object',
            'mimeType',
            'size',
            'etag',
            'paper',
        )

    def update(self, instance, validated_data):
        instance.mimeType = validated_data.get('mimeType', instance.mimeType)
        instance.bucket = validated_data.get('bucket', instance.bucket)
        instance.object = validated_data.get('object', instance.object)
        instance.size = validated_data.get('size', instance.size)
        instance.save()
        return instance

    class JSONAPIMeta:
        resource_name = 'osses'
        included_resources = ['paper']


class FileSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.SerializerMethodField(method_name='get_file_url', read_only=True)
    title = serializers.CharField(source='oss.paper.title', read_only=True)
    abstract = serializers.CharField(
        source='oss.paper.abstract', read_only=True)
    createdAt = serializers.SerializerMethodField(method_name='get_created_at')
    updatedAt = serializers.SerializerMethodField(method_name='get_updated_at')

    oss = relations.ResourceRelatedField(read_only=True)
    highlights = relations.ResourceRelatedField(
        many=True,
        read_only=True,
        related_link_view_name='file-highlights',
        related_link_url_kwarg='file_pk',
    )

    projects = relations.ResourceRelatedField(many=True, read_only=True)
    included_serializers = {
        'highlights': 'scholar.apps.highlights.serializers.HighlightSerializer',
        'projects': ProjectSerializer,
        'oss': OssSerializer,
    }

    def get_file_url(self, instance):
        if instance.oss.object:
            return settings.ALIYUN_OSS_DOMAIN + '/' + instance.oss.object
        else:
            return None

    def get_created_at(self, instance):
        return instance.created_at.isoformat()

    def get_updated_at(self, instance):
        return instance.updated_at.isoformat()

    class Meta:
        model = File
        fields = (
            'id',
            'url',
            'title',
            'abstract',
            'size',
            'name',
            'oss',
            'createdAt',
            'updatedAt',
            'highlights',
            'projects'
        )

    class JSONAPIMeta:
        resource_name = 'files'
        included_resources = ['oss', 'highlights']

    def create(self, validated_data):
        project_pk = self.context['project_pk']
        filehash = self.context['filehash']
        profile = self.context['profile']
        try:
            project = Project.objects.get(pk=project_pk)
        except Project.DoesNotExist:
            raise NotFound('Project Not Found')

        name = validated_data.get('name', None)
        try:
            oss = Oss.objects.get(etag=filehash)
        except Oss.DoesNotExist:
            oss = Oss.objects.create(etag=filehash)

        file = oss.files.filter(name=name).first()
        if file is not None:
            if not project.has_file(file):
                project.add_file(file)
            return file
        else:
            file = File.objects.create(**validated_data)
            oss.add_file(file)
            project.add_file(file)
            return file
