import oss2
from django.conf import settings


class Client:
    ACCESS_ID = None
    ACCESS_SECRET = None
    END_POINT = None
    service = None
    bucket = None

    def __init__(self, access_id=None, access_secret=None, end_point=None, name=None):
        if access_id and access_secret and end_point:
            self.ACCESS_ID = access_id
            self.ACCESS_SECRET = access_secret
            self.END_POINT = end_point
        else:
            self.ACCESS_ID = settings.ALIYUN_ACCESSKEYID
            self.ACCESS_SECRET = settings.ALIYUN_ACCESSKEYSECRET
            self.END_POINT = settings.ALIYUN_OSS_ENV_INTERNAL_POINT

        auth = oss2.Auth(self.ACCESS_ID, self.ACCESS_SECRET)
        self.service = oss2.Service(auth, self.END_POINT)
        self.bucket = oss2.Bucket(auth, self.END_POINT, name)
