from django.db import models
from scholar.apps.core.models import TimestampedModel
from uuid import uuid4


class Profile(TimestampedModel):
    id = models.UUIDField(primary_key=True, default=uuid4)
    user = models.OneToOneField('authentication.User', on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    image = models.URLField(blank=True)

    follows = models.ManyToManyField('self', related_name='followed_by', symmetrical=False, )

    def __str__(self):
        return self.user.username

    def follow(self, profile):
        return self.follows.add(profile)

    def unfollow(self, profile):
        return self.follows.remove(profile)

    def is_following(self, profile):
        return self.follows.filter(pk=profile.pk).exists()

    def is_followed_by(self, profile):
        return self.followed_by.filter(pk=profile.pk).exists()
