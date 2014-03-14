# DB Settings
# -----------

# KACE K1000 connection parameters.
# It's just mysql. See below for more details.
# http://www.kace.com/support/resources/kb/solutiondetail?sol=SOL114992

DB_SERVER = 'k1000.mydomain.local'
DB_USER = 'R1'
DB_PASS = 'box747'
DB_SCHEMA = 'ORG1'

# This is the SQL query to run. You can customize this but you might
# have to change up the processing on the python side a little bit if you do.

DB_QUERY = """select HD_TICKET.ID,
    HD_TICKET.TITLE ,
    HD_TICKET.DUE_DATE,
    CONCAT(IF(TIME_TO_SEC(NOW()) >= TIME_TO_SEC(HD_TICKET.TIME_OPENED),
          TO_DAYS(NOW()) - TO_DAYS(HD_TICKET.TIME_OPENED),
          TO_DAYS(NOW()) - TO_DAYS(HD_TICKET.TIME_OPENED) - 1), 'd ',
          DATE_FORMAT(ADDTIME("2000-01-01 00:00:00",
          SEC_TO_TIME(TIME_TO_SEC(NOW())-TIME_TO_SEC(HD_TICKET.TIME_OPENED))),
          '%kh %im')) AS TIME_OPEN,
    HD_PRIORITY.NAME as PRIORITY,
    HD_CATEGORY.NAME as CATEGORY,
    HD_STATUS.NAME as STATUS,
    HD_IMPACT.NAME as IMPACT,
    MACHINE.NAME as MACHINE_NAME,
    lower(ifnull((select USER_NAME from USER where HD_TICKET.OWNER_ID = USER.ID),' Unassigned')) as OWNER_NAME,
    lower((select USER_NAME from USER where HD_TICKET.SUBMITTER_ID = USER.ID)) as SUBMITTER_NAME
from HD_TICKET
left join HD_CATEGORY on HD_CATEGORY_ID = HD_CATEGORY.ID
left join HD_STATUS on HD_STATUS_ID = HD_STATUS.ID
left join HD_PRIORITY on HD_PRIORITY_ID = HD_PRIORITY.ID
left join HD_IMPACT on HD_IMPACT_ID = HD_IMPACT.ID
left join MACHINE on HD_TICKET.MACHINE_ID = MACHINE.ID
where HD_STATUS.STATE = 'stalled' OR HD_STATUS.STATE = 'opened'
order by OWNER_NAME, HD_PRIORITY.ORDINAL, HD_CATEGORY.ORDINAL, HD_STATUS.ORDINAL, HD_IMPACT.ORDINAL"""

# Dashboard Settings
# ------------------

# You can define teams based on KACE usernames here. The dashboard will group
# tickets into buckets that are listed here. Otherwise it will just display one
# bucket sorted by owner.

# If you don't want to use this feature, just leave teams as an empty list.
# E.g: TEAMS = []
# TEAM1 = {
#     'name': "Command Team",
#     'members': ["sisko", "kira", "odo"]
# }
# TEAM2 = {
#     'name': "Ops Team",
#     'members': ["worf", "obrien", "garak"]
# }
# TEAM3 = {
#     'name': "Science Team",
#     'members': ["bashir", "dax", "ezridax"]
# }
# TEAMS = [TEAM1, TEAM2, TEAM3]
TEAMS = []
