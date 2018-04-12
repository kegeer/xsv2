import hmac
import base64
import hashlib
import uuid
from urllib import parse
from datetime import datetime
from collections import OrderedDict
from functools import reduce
from django.conf import settings


class BaseClient:
    ACCESS_KEY = None
    ACCESS_SECRET = None

    def __init__(self):
        self.ACCESS_KEY = settings.ALIYUN_ACCESSKEYID.strip()
        self.ACCESS_SECRET = settings.ALIYUN_ACCESSKEYSECRET.strip()

    def get_payload(self, **params):
        payload = self.__get_sign_data__(**params)
        return payload

    def __get_sign_data__(self, **params):
        data = self.__reset_data__(**params)
        method = data.pop('Method')
        string_to_sign = self.__get_string_to_sign(data, method)
        data['Signature'] = self.__get_hmac_base64__(string_to_sign)
        return data

    def __get_hmac_base64__(self, string_to_sign):
        secret = self.ACCESS_SECRET + '&'
        hmac_string = hmac.new(secret.encode(), msg=string_to_sign.encode(), digestmod=hashlib.sha1)
        hmac_base64 = base64.encodebytes(hmac_string.digest()).strip()
        return hmac_base64

    @staticmethod
    def __get_string_to_sign(data, method):
        ordered_data = OrderedDict(sorted(data.items(), key=lambda t: t[0]))
        encoded_data = map(lambda t: parse.quote(str(t[0]), safe='~') + '=' + parse.quote(str(t[1]), safe='~'),
                           ordered_data.items())
        query_string = reduce(lambda a, b: a + '&' + b, encoded_data)
        string_to_sign = method + '&%2F&' + parse.quote(query_string, safe='~')
        return string_to_sign

    def __reset_data__(self, **params):

        data = \
            {
                'Format': 'JSON',
                'AccessKeyId': self.ACCESS_KEY,
                'SignatureMethod': 'HMAC-SHA1',
                'Timestamp': datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
                'SignatureVersion': '1.0',
                'SignatureNonce': str(uuid.uuid4())
            }

        for k, v in params.items():
            if v:
                data[k] = v
        return data
