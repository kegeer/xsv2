# -*- coding: utf-8 -*-
# PROJECT : picopico
# TIME    : 17-3-20 上午9:44
# AUTHOR  : youngershen <younger.x.shen@gmail.com>
import logging
from django.conf import settings
from scholar.utils.aliyun.dm import Client as DMClient
from scholar.utils.aliyun.sms import Client as SMSClient

logger = logging.getLogger(__name__)


def send_email(address, subject, text_body, html_body):
    if settings.DEBUG or settings.TEST:
        logger.debug('sending ' + subject + ' ' + text_body + ' to email ' + address)
        return True

    client = DMClient()
    return client.send_single_mail(to_address=address, subject=subject, text_body=text_body, html_body=html_body)


def send_register_email(address, code):
    if settings.DEBUG or settings.TEST:
        logger.debug('sending ' + code + ' to email ' + address)
        return True

    client = DMClient()
    return client.send_single_mail(to_address=address,
                                   subject=settings.EMAIL_REGISTER_CAPTCHA_SUBJECT,
                                   text_body=settings.EMAIL_REGISTER_CAPTCHA_MESSAGE.format(CODE=code))


def send_resetpass_email(address, code):
    if settings.DEBUG or settings.TEST:
        logger.debug('sending resetpass ' + code + ' to email ' + address)
        return True
    client = DMClient()
    return client.send_single_mail(to_address=address,
                                   subject=settings.EMAIL_RESETPASS_CAPTCHA_SUBJECT,
                                   text_body=settings.EMAIL_RESETPASS_CPATCHA_MESSAGE.format(CODE=code))


def send_register_sms(rec_num, code):
    if settings.DEBUG or settings.TEST:
        logger.debug('sending ' + code + ' to cellphone ' + rec_num)
        return True

    client = SMSClient()
    param_string = '{"code":" ' + code + ' ", "product":" 皮可皮可社区 "}'
    return client.send_text(template_code='SMS_58350026',
                            rec_num=rec_num,
                            param_string=param_string)


def send_resetpass_sms(rec_num, code):
    if settings.DEBUG or settings.TEST:
        logger.debug('sending resetpass ' + code + ' to cellphone ' + rec_num)
        return True

    client = SMSClient()
    param_string = '{"code":" ' + code + ' ", "product":" 皮可皮可社区 "}'
    return client.send_text(template_code='SMS_58350023',
                            rec_num=rec_num,
                            param_string=param_string)
