# -*- coding: utf-8 -*-
# PROJECT : picopico
# TIME    : 17-3-28 上午9:43
# AUTHOR  : youngershen <younger.x.shen@gmail.com>
import logging
import requests
from django.conf import settings
from scholar.utils.aliyun.base import BaseClient

logger = logging.getLogger(__name__)


class Client(BaseClient):
    ENDPOINT = None
    ACCOUNT_NAME = None
    FROM_ALIAS = None
    ACTION = None
    VERSION = None

    def __init__(self):
        super().__init__()
        self.ENDPOINT = settings.ALIYUN_DM_ENDPOINT
        self.ACCOUNT_NAME = settings.ALIYUN_DM_ACCOUNT
        self.FROM_ALIAS = 'PICOPICO酱'
        self.ACTION = 'SingleSendMail'
        self.VERSION = '2015-11-23'

    def send_single_mail(self,
                         to_address=None,
                         subject=None,
                         html_body=None,
                         text_body=None,
                         ssl=True,
                         silent=True,
                         method='POST',
                         reply_to_address='true',
                         address_type='1',
                         **kwargs):

        if settings.TEST:
            return True

        url = 'https://' + self.ENDPOINT if ssl else 'http://' + self.ENDPOINT
        payload = self.get_payload(Method=method,
                                   ReplyToAddress=reply_to_address,
                                   AddressType=address_type,
                                   ToAddress=to_address,
                                   Subject=subject,
                                   TextBody=text_body,
                                   HtmlBody=html_body,
                                   Action=self.ACTION,
                                   AccountName=self.ACCOUNT_NAME,
                                   FromAlias=self.FROM_ALIAS,
                                   Version=self.VERSION)
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
            logger.debug('sending email')
            logger.debug(response.json())

        return True
