from uuid import uuid4

from django.db import models

from scholar.apps.core.models import TimestampedModel


class Author(models.Model):
    initials = models.CharField(max_length=10, null=True)
    forename = models.CharField(max_length=125, null=True)
    lastname = models.CharField(max_length=125, null=True)

    def __str__(self):
        return self.fullname

    @property
    def fullname(self):
        return self.forename + ' ' + self.lastname


class Journal(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Paper(models.Model):
    ''' Paper specific field '''
    id = models.UUIDField(primary_key=True, default=uuid4)
    journal = models.ForeignKey(
        Journal, on_delete=models.CASCADE, related_name='papers', null=True)
    authors = models.ManyToManyField(Author, related_name='papers')
    title = models.CharField(max_length=1000, null=True)
    abstract = models.TextField(null=True)
    year = models.PositiveIntegerField(null=True)
    month = models.PositiveIntegerField(null=True)
    volume = models.CharField(max_length=10, null=True)
    pages = models.CharField(max_length=20, null=True)
    page_from = models.CharField(max_length=10, null=True)
    page_to = models.CharField(max_length=10, null=True)

    def __str__(self):
        return self.title

class Oss(TimestampedModel):
    """ 改成存储file的bucket和object信息 """
    id = models.UUIDField(primary_key=True, default=uuid4)
    bucket = models.CharField(max_length=255, blank=True, null=True)
    object = models.CharField(max_length=255, blank=True,  null=True)
    mimeType = models.CharField(max_length=255, blank=True,  null=True)
    size = models.FloatField(null=True)
    etag = models.CharField(max_length=255, null=True)
    paper = models.ForeignKey(Paper, related_name='osses', null=True)

    def __str__(self):
        return self.link

    def add_file(self, file):
        return self.files.add(file)

class File(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    size = models.FloatField()
    name = models.CharField(max_length=255)
    oss = models.ForeignKey(Oss, related_name='files', null=True)

    def __str__(self):
        return self.name

    def add_to_paper(self, paper):
        self.paper = paper


class Project(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    name = models.CharField(max_length=255)
    summary = models.TextField(null=True)
    color = models.CharField(max_length=10, null=True)
    publicStatus = models.BooleanField(default=True)
    readme = models.TextField(null=True)
    creator = models.ForeignKey(
        'profiles.Profile', on_delete=models.CASCADE, related_name='libraries')
    files = models.ManyToManyField(File, related_name='projects')

    def __str__(self):
        return self.name

    def add_file(self, file):
        return self.files.add(file)

    def has_file(self, file):
        return self.files.filter(pk=file.pk).exists()


class Document(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    slug = models.SlugField(db_index=True, unique=True, null=True)
    title = models.CharField(max_length=255)
    text = models.TextField(null=True)
    emoji = models.CharField(max_length=255, null=True)
    parent = models.ForeignKey('self', related_name='children', null=True)
    created_by = models.ForeignKey('profiles.Profile', related_name='created')
    updated_by = models.ForeignKey('profiles.Profile', related_name='updated')
    published_at = models.DateTimeField(null=True)

    stars = models.ManyToManyField('profiles.Profile', related_name='starred')
    views = models.ManyToManyField('profiles.Profile', related_name='viewed')

    # 只有是协作者才能对文章进行编辑修改，并且修改记录到版本系统，目前还没有采用git版本管理
    collaborators = models.ManyToManyField(
      'profiles.Profile', related_name='documents')

    project = models.ForeignKey(Project, related_name='documents')

    def __str__(self):
        return self.slug

