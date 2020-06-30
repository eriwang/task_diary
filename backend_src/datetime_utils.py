import datetime

import pytz


def date_to_seconds_since_epoch(date):
    return datetime.datetime.combine(date, datetime.time(0, 0, 0), tzinfo=pytz.utc).timestamp()
