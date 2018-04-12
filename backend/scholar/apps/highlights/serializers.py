from rest_framework.exceptions import NotFound
from rest_framework_json_api import serializers, relations

from scholar.apps.profiles.models import Profile
from scholar.apps.profiles.serializers import ProfileSerializer
from scholar.apps.projects.models import File
from .models import Highlight, Channel, Tag, Comment, Annotation
from .relations import TagRelatedField


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('tag',)


class CommentSerializer(serializers.ModelSerializer):

    author = ProfileSerializer(read_only=True)
    # included_serializers = {
    #     'author': 'scholar.apps.profiles.serializers.ProfileSerializer'
    # }
    createdAt = serializers.SerializerMethodField(method_name='get_created_at')
    updatedAt = serializers.SerializerMethodField(method_name='get_updated_at')

    class Meta:
        model = Comment
        fields = (
            'id',
            'author',
            'body',
            'createdAt',
            'updatedAt',
        )

    def get_created_at(self, instance):
        return instance.created_at.isoformat()

    def get_updated_at(self, instance):
        return instance.updated_at.isoformat()

    def create(self, validated_data):
        content_object = self.context['content_object']
        author = self.context['author']

        return Comment.objects.create(
            author=author,
            content_object=content_object,
            **validated_data
        )


class ChannelSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    description = serializers.CharField()
    owner = relations.ResourceRelatedField(queryset=Profile.objects.all())
    members = ProfileSerializer(many=True)

    createdAt = serializers.SerializerMethodField(method_name='get_created_at')
    updatedAt = serializers.SerializerMethodField(method_name='get_updated_at')

    include_serializers = {
        'owner': 'scholar.apps.profiles.serializers.ProfileSerializer',
        'memebers': 'scholar.apps.profiles.serializers.ProfileSerializer',
    }

    class Meta:
        model = Channel
        fields = ('id', 'name', 'description', 'owner', 'members')

    def get_created_at(self, instance):
        return instance.created_at.isoformat()

    def get_updated_at(self, instance):
        return instance.updated_at.isoformat()


class HighlightSerializer(serializers.HyperlinkedModelSerializer):

    file = relations.ResourceRelatedField(read_only=True)
    author = relations.ResourceRelatedField(read_only=True)
    selectors = serializers.JSONField()

    # 自定义方法来处理关系

    annotations = relations.ResourceRelatedField(
        many=True,
        read_only=True,
        related_link_view_name='highlight-annotations',
        related_link_url_kwarg='highlight_pk',
        # TODO 暂时未发现实用性
        # self_link_view_name='Highlight-relationships'
    )

    createdAt = serializers.SerializerMethodField(method_name='get_created_at')
    updatedAt = serializers.SerializerMethodField(method_name='get_updated_at')

    included_serializers = {
        'file': 'scholar.apps.projects.serializers.FileSerializer',
        'author': 'scholar.apps.profiles.serializers.ProfileSerializer',
        'annotations': 'scholar.apps.highlights.serializers.AnnotationSerializer',
    }

    def get_created_at(self, instance):
        return instance.created_at.isoformat()

    def get_updated_at(self, instance):
        return instance.updated_at.isoformat()

    def create(self, validated_data):
        profile = self.context['request'].user.profile
        file_pk = self.context['file_pk']
        annotation = self.context['annotation']
        if file_pk:
            try:
                file = File.objects.get(pk=file_pk)
            except File.DoesNotExist:
                raise NotFound('File Not Found')
        highlight = Highlight.objects.create(
            **validated_data,
            author=profile,
            file=file,
        )
        if annotation is not None:
            Annotation.objects.create(
                body=annotation,
                author=profile,
                highlight=highlight
            )

        return highlight

    class JSONAPIMeta:
        included_resources = ['author', 'annotations']

    class Meta:
        model = Highlight
        fields = (
            'id',
            'file',
            'selectors',
            'color',
            'author',
            'annotations',
            'createdAt',
            'updatedAt',
        )


class AnnotationSerializer(serializers.ModelSerializer):
    highlight = relations.ResourceRelatedField(read_only=True)
    author = relations.ResourceRelatedField(read_only=True)
    # 自定义方法来处理关系
    tags = TagRelatedField(many=True, required=False)

    comments = relations.ResourceRelatedField(
        many=True,
        read_only=True,
        related_link_view_name='annotation-comments',
        related_link_url_kwarg='annotation_pk',
        # TODO 暂时未发现实用性
        # self_link_view_name='annotation-relationships'
    )
    createdAt = serializers.SerializerMethodField(method_name='get_created_at')
    updatedAt = serializers.SerializerMethodField(method_name='get_updated_at')
    included_serializers = {
        'highlight': 'scholar.apps.highlights.serializers.HighlightSerializer',
        'author': 'scholar.apps.profiles.serializers.ProfileSerializer',
        'tags': 'scholar.apps.highlights.serializers.TagSerializer',
        'comments': 'scholar.apps.highlights.serializers.CommentSerializer',
    }

    def get_created_at(self, instance):
        return instance.created_at.isoformat()

    def get_updated_at(self, instance):
        return instance.updated_at.isoformat()

    def create(self, validated_data):
        profile = self.context['request'].user.profile
        highlight_pk = self.context['highlight_pk']
        try:
            highlight = Highlight.objects.get(pk=highlight_pk)
        except Highlight.DoesNotExist:
            raise NotFound('Highlight Not exsits')

        tags = validated_data.pop('tags', [])
        annotation = Annotation.objects.create(
            **validated_data,
            author=profile,
            highlight=highlight
        )
        if tags is not None:
            for tag in tags:
                annotation.tags.add(tag)
        return annotation

    class Meta:
        model = Annotation
        fields = (
            'body',
            'author',
            'highlight',
            'comments',
            'tags',
            'createdAt',
            'updatedAt',
        )

    class JSONAPIMeta:
        included_resources = ['author']
