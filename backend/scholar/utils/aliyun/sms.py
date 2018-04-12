# -*- coding: utf-8 -*-
# PROJECT : picopico
# TIME    : 17-3-29 下午3:39
# AUTHOR  : youngershen <younger.x.shen@gmail.com>
import logging
import requests
from django.conf import settings
from scholar.utils.aliyun.base import BaseClient

logger = logging.getLogger(__name__)


class Client(BaseClient):
    ENDPOINT = None
    SIGN_NAME = None
    ACTION = None
    VERSION = None

    def __init__(self):
        super().__init__()
        self.ENDPOINT = settings.ALIYUN_SMS_ENDPOINT
        self.SIGN_NAME = settings.ALIYUN_SMS_SIGNNAME
        self.ACTION = 'SingleSendSms'
        self.VERSION = '2016-09-27'

    def send_text(self,
                  template_code=None,
                  rec_num=None,
                  param_string=None,
                  ssl=True,
                  silent=True,
                  method='POST',
                  **kwargs):

        if settings.TEST:
            return True

        url = 'https://' + self.ENDPOINT if ssl else 'http://' + self.ENDPOINT
        payload = self.get_payload(TemplateCode=template_code,
                                   RecNum=rec_num,
                                   Action=self.ACTION,
                                   SignName=self.SIGN_NAME,
                                   ParamString=param_string,
                                   Version=self.VERSION,
                                   Method=method)
        if silent:
            try:
                if 'POST' == method.upper():
                    response = requests.post(url, data=payload)
                if 'GET' == method.upper():
                    response = requests.get(url, params=payload)
            except Exception:
                return False
        else:
            if 'POST' == method.upper():
                response = requests.post(url, data=payload)
            if 'GET' == method.upper():
                response = requests.get(url, params=payload)

        if settings.DEBUG:
            logger.debug('sending sms')
            logger.debug(response.json())

        return True
