# # -*- coding: utf-8 -*-
# # PROJECT : picopico
# # TIME    : 17-3-16 下午4:30
# # AUTHOR  : youngershen <younger.x.shen@gmail.com>
# import re
# import logging
# from secrets import randbelow
# from scholar.utils.message import send_register_email, send_register_sms, send_resetpass_email, send_resetpass_sms
#
# logger = logging.getLogger(__name__)
#
#
# def get_captcha_code():
#     captcha = [str(randbelow(10)) for x in range(4)]
#     return ''.join(captcha)
#
#
# def send_captcha(captcha_code, account, action='register'):
#     response = False
#
#     if re.match(r'^1[0-9]{10}$', account):
#         if 'register' == action:
#             response = send_register_sms(account, captcha_code)
#
#         if 'resetpass' == action:
#             response = send_resetpass_sms(account, captcha_code)
#
#     if re.match(r'[^@]+@[^@]+\.[^@]+', account):
#         if 'register' == action:
#             response = send_register_email(account, captcha_code)
#
#         if 'resetpass' == action:
#             response = send_resetpass_email(account, captcha_code)
#
#     return response
