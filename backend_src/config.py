import os
import sys

from appdirs import AppDirs

_APP_DIRS = AppDirs(appname='TaskDiary', appauthor='eriwang')


IS_PROD = hasattr(sys, '_MEIPASS') and getattr(sys, 'frozen')

if IS_PROD:
    pyinstall_bundle_dir = sys._MEIPASS # pylint: disable=no-member, protected-access
    class Config:  # pylint: disable=too-few-public-methods
        IS_PROD = IS_PROD
        TEMPLATE_FOLDER = os.path.join(pyinstall_bundle_dir, 'templates')
        STATIC_FOLDER = os.path.join(pyinstall_bundle_dir, 'static_gen')
        DB_PATH = os.path.join(_APP_DIRS.user_data_dir, 'task_diary.db')
        LOG_PATH = os.path.join(_APP_DIRS.user_log_dir, 'task_diary.log')
else:
    class Config:  # pylint: disable=too-few-public-methods
        IS_PROD = False
        TEMPLATE_FOLDER = 'templates'
        STATIC_FOLDER = 'static_gen'
        DB_PATH = './task_diary.db'
        LOG_PATH = './task_diary.log'
