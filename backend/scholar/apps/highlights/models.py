from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation

from scholar.apps.core.models import TimestampedModel
from jsonfield import JSONField
from uuid import uuid4


class Tag(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    tag = models.CharField(max_length=255)
    slug = models.SlugField(db_index=True, unique=True, null=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True)
    object_id = models.UUIDField(null=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return self.tag


class Comment(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    body = models.TextField()
    author = models.ForeignKey('profiles.Profile', related_name='comments', on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return self.body


class Channel(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    name = models.CharField(max_length=128)
    summary = models.TextField()
    public = models.BooleanField(default=True)
    owner = models.ForeignKey('profiles.Profile', related_name='channles', on_delete=models.CASCADE)
    members = models.ManyToManyField('profiles.Profile', related_name='joined')

    def __str__(self):
        return self.name

    def join(self, profile):
        return self.members.add(profile)

    def unjoin(self, profile):
        return self.members.remove(profile)

    def is_joining(self, profile):
        return self.members.filter(pk=profile.pk).exists()

    def has_joined(self, profile):
        return self.joined.filter(pk=profile.pk).exists()

    def add_highlight(self, highlight):
        self.highlights.add(highlight)


# 将annotation改名为highlight是因为与前端命名有冲突
class Highlight(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    author = models.ForeignKey('profiles.Profile', related_name='highlights')
    file = models.ForeignKey('projects.File', related_name='highlights')
    selectors = JSONField(null=True)
    color = models.CharField(max_length=20, null=True)
    channel = models.ForeignKey(Channel, null=True, related_name='highlights', on_delete=models.SET_NULL)

    #  将所有相关的comment都转移到comment自身管理，annotation仅仅记录文章中高亮位置

    def __str__(self):
        return self.comment

    class Meta:
        ordering = None

    def add_to_channel(self, channel):
        self.channel = channel
    
    def add_annotation(self, annotation):
        self.annotations.add(annotation)


class Annotation(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    body = models.TextField(null=True)
    author = models.ForeignKey('profiles.Profile', related_name='annotations', null=True)
    highlight = models.ForeignKey(Highlight, related_name='annotations', null=True)
    comments = GenericRelation(Comment, related_query_name='highlights', null=True)
    tags = GenericRelation(Tag, null=True)

    def __str__(self):
        return self.id
