import time
import json
import hmac
import base64
import datetime
from hashlib import sha1 as sha, md5
import logging

from django.conf import settings

logger = logging.getLogger(__name__)


def get_file_md5(cipher_str='xueshuio'):
    cipher = str(cipher_str)
    return md5(cipher.encode()).hexdigest()


def get_time_md5(cipher_str='xueshuio'):
    cipher = datetime.datetime.now().__str__() + str(cipher_str)
    return md5(cipher.encode()).hexdigest()

class OssMixin:
    access_id = None
    access_secret = None
    bucket = None
    use_callback = False
    success_action_redirect = 'http://www.linkick.com'
    success_action_status = 201
    callback_url = 'http://api.linkick.com/api/v1/files/oss'
    upload_dir = 'papers/'
    expire = 30

    def get_token(self, bucket='xueshu-papers', filehash=None, filename=None, expire=30):
        self.access_id = settings.ALIYUN_ACCESSKEYID
        self.access_secret = settings.ALIYUN_ACCESSKEYSECRET
        self.bucket = bucket
        self.end_point = 'http://' + self.bucket + '.' + settings.ALIYUN_OSS_END_POINT
        self.expire = expire
        self.filehash = filehash
        self.filename = filename
        # self.kind = kind
        return self._get_token()

    def _get_token(self):
        now = int(time.time())
        expire_syncpoint = now + self.expire
        expire = self._get_expire_time(expire_syncpoint)

        policy = {
            'expiration': expire
        }

        condition = []
        upload = ['starts-with', '$key', self.upload_dir]
        condition.append(upload)

        policy['conditions'] = condition
        policy = json.dumps(policy).strip()

        policy_encode = base64.b64encode(policy.encode())

        h = hmac.new(self.access_secret.encode(), policy_encode, sha)
        sign_result = base64.encodebytes(h.digest()).strip()
        if self.filehash is not None:
            file_part_name = self.upload_dir + get_file_md5(self.filehash)
        elif self.filename is not None:
            file_part_name = self.upload_dir + get_time_md5(self.filename)
        

        callback = self._get_callback_body() if self.use_callback else None
        # callback_var = self._get_callback_var() if self.use_callback else None

        token = {
            'accessId': self.access_id,
            'action': self.end_point,
            'policy': policy_encode,
            'Signature': sign_result,
            'expire': expire_syncpoint,
            'key': file_part_name,
            'success_action_redirect': self.success_action_redirect,
            'success_action_status': self.success_action_status,
            # 'file_part_name': file_part_name,
            # 'dir': self.upload_dir
        }

        token.update({'callback': callback}) if self.use_callback else None

        if settings.DEBUG:
            logger.debug(token)

        return token

    @staticmethod
    def get_header():
        return{
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Origin': '*'
        }

    @staticmethod
    def _get_expire_time(time_str):
        gmt = datetime.datetime.fromtimestamp(time_str).isoformat()
        gmt += 'Z'
        return gmt

    def _get_callback_body(self):
        callback = {
            'callbackUrl': self.callback_url,
            'callbackHost': '',
            'callbackBody': '{\"bucket\": ${bucket}, \"object\": ${object}, \"etag\": ${etag}, \"mimeType\": ${mimeType}, \"size\": ${size}}',
            # 'callbackBody': '{\"bucket\": ${bucket}, \"object\": ${object}, \"etag\": ${etag}, \"mimeType\": ${mimeType}, \"size\": ${size}, \"filehash\": ${x:filehash}}',
            'callbackBodyType': 'application/json'
        }
        callback_json = json.dumps(callback).strip()
        return base64.b64encode(callback_json.encode())
    
    # def _get_callback_var(self):
    #     callback_var = {
    #         'x:filehash': self.filehash
    #     }
    #     return json.dumps(callback_var).strip()
