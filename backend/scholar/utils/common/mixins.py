import time
import json
import hmac
import base64
import datetime
from hashlib import sha1 as sha
import logging

from django.conf import settings

logger = logging.getLogger(__name__)


def get_time_md5(cipher_str='xueshuio'):
    cipher = datetime.now().__str__() + str(cipher_str)
    return hashlib.md5(cipher.encode()).hexdigest()

class OssMixin:
  access_id = None
  access_secret = None
  end_point = None
  bucket = None
  use_callback = None
  success_action_redirect = 'http://www.baidu.com'
  success_action_status = 201
  callback_url = 'http://www.linkick.com'
  upload_dir = 'papers'
  expire = 30

  def get_token(self, bucket='xueshu-papers', expire=30):
    self.access_id = settings.ALIYUN_ACCESSKEYID
    self.access_secret = settings.ALIYUN_ACCESSKEYSECRET
    self.bucket = bucket
    self.end_point = 'http://' + self.bucket + '.' + settings.ALIYUN_OSS_END_POINT
    self.expire = expire
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
    sign_result = base64.encodebytes(h.digest().strip())
    user = self.request.user
    file_part_name = self.upload_dir + \
        str(user.id) + '/' + get_time_md5(user.id) + '-'
    filename = file_part_name + '${filename}'

    callback = self._get_callback_body() if self.use_callback else None

    token = {
        'accessId': self.access_id,
        'action': self.end_point,
        'policy': policy,
        'signature': sign_result,
        'expire': expire_syncpoint,
        'key': filename,
        'success_action_redirect': self.success_action_redirect,
        'success_action_status': self.success_action_status,
        'file_part_name': file_part_name
    }

    token.update({'callback': callback}) is self.use_callback else None

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
        'callbackBody': 'filename=${object}&size=${size}&mimeType=${mimeType}'
        '&height=${imageInfo.height}&width=${imageInfo.width}',
        'callbackBodyType': 'application/x-www-form-urlencoded'
    }
    callback_json = json.dumps(callback)
    return base64.b64encode(callback_json.encode())
