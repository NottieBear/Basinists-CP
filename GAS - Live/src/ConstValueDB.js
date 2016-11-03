_DB_MAIN_FILE_ID = '1U5PX6WfGcpwEyrNvsRnf-gvDtVqhGC9lCyHwRDTzVBc';
_DB_GUILD_FUND_FILE_ID = '1KG_QZ8BVJzlul1wKrHu6RyWXMOp8XGMr9FCfb_vmJuA';
_DB_GUILD_LOG_FILE_ID = '1KTkzYP7xBAESt-zDosUefqSLh0CBaEt2XhxH2kyRHa8';
_DB_OCTOVINE_SQUAD_FILE_ID = '1VX-4NcWoFTxNjHI8BocoO3tOewR6YP-1_HRUl8PbpeI';
_DB_MEMBER_ONLINE_FILE_ID = '1fYZLCuLbcP3VwcKR2QSYnGZRjC8Jo0xZDVZNvKNyrNE';

/* ---- Generic Column ----------------------------------------------------------- */
_COLUMN_ID = 'id';
_COLUMN_UPDATE_COUNT = 'update_count';
_COLUMN_UTC = 'utc';
_COLUMN_TIMESTAMP = 'timestamp';
_COLUMN_CREATE_UTC = 'create_utc';
_COLUMN_CREATE_TIMESTAMP = 'create_timestamp';
_COLUMN_GUILD_ID = 'guild_id';

/* ----- Enum --------------------------------------------------------------------------------------- */
_TABLE_ENUM = 'Enum';

_COLUMN_ENUM_TYPE = 'type';
_COLUMN_ENUM_NAME = 'name';
_COLUMN_ENUM_VALUE = 'value';

/* ----- Server Task Status ------------------------------------------------------ */
_TABLE_SERVER_TASK_STATUS = 'Server_Task_Status';

_COLUMN_SERVER_TASK_NAME = 'name';
_COLUMN_SERVER_TASK_LAST_RUN_UTC = 'last_run_utc';
_COLUMN_SERVER_TASK_DETAIL = 'detail';

/* ----- Guild Rank -------------------------------------------------------------- */
_TABLE_GUILD_RANK = 'Guild_Rank';

_COLUMN_GUILD_RANK_NAME = 'name';
_COLUMN_GUILD_RANK_ORDER = 'order';
_COLUMN_GUILD_RANK_ICON = 'icon';

/* ----- Guild Member ------------------------------------------------------------ */
_TABLE_GUILD_MEMBER = 'Guild_Member';

_COLUMN_GUILD_MEMBER_NAME = 'name';
_COLUMN_GUILD_MEMBER_ALIAS = 'alias';
_COLUMN_GUILD_MEMBER_FIREBASE_USER_ID = 'firebase_user_id';
_COLUMN_GUILD_MEMBER_GW2_API_KEY = 'gw2_api_key';
_COLUMN_GUILD_MEMBER_AB_RANK = 'ab_rank';
_COLUMN_GUILD_MEMBER_EB_RANK = 'eb_rank';
_COLUMN_GUILD_MEMBER_AB_JOIN_UTC = 'ab_join_utc';
_COLUMN_GUILD_MEMBER_AB_JOIN_TIMESTAMP = 'ab_join_timestamp';
_COLUMN_GUILD_MEMBER_EB_JOIN_UTC = 'eb_join_utc';
_COLUMN_GUILD_MEMBER_EB_JOIN_TIMESTAMP = 'eb_join_timestamp';
_COLUMN_GUILD_MEMBER_NOTE = 'note';

/* ----- Guild Fund -------------------------------------------------------------- */
_TABLE_GUILD_FUND = 'Guild_Fund';

_COLUMN_GUILDFUND_GUILD_STASH = 'guild_stash';
_COLUMN_GUILDFUND_TREASURE_TROVE = 'treasure_trove';
_COLUMN_GUILDFUND_DEEP_CAVE = 'deep_cave';

/* ----- Guild Log ---------------------------------------------------------------- */
_TABLE_GUILD_PENDING_LOG = 'pending_log';
_TABLE_GUILD_CONFIG = 'main_config';
_TABLE_GUILD_STASH = 'stash';
_TABLE_GUILD_TREASURY = 'treasury';

_COLUMN_GUILD_CONFIG_LAST_LOG_ID = 'last_log_id';

_COLUMN_GUILD_LOG_ID = 'log_id';
_COLUMN_GUILD_LOG_TYPE = 'type';
_COLUMN_GUILD_LOG_TIME = 'time';
_COLUMN_GUILD_LOG_USER = 'user';
_COLUMN_GUILD_LOG_ITEM_ID = 'item_id';
_COLUMN_GUILD_LOG_ITEM_COUNT = 'count';

_COLUMN_GUILD_STASH_OPERATION = 'operation';
_COLUMN_GUILD_STASH_COINS = 'coins';

_COLUMN_GUILD_PENDING_LOG_JSON_STRING = 'log_json_string';
_COLUMN_GUILD_PENDING_LOG_ERROR = 'error';

/* ----- Octovine Squad --------------------------------------------------------------- */
_TABLE_OCTOVINE_SQUAD = 'Octovine_Squad';

_COLUMN_OCTOVINESQUAD_COMMANDER = 'commander';
_COLUMN_OCTOVINESQUAD_INVITATION_STATUS = 'invitation_status';
_COLUMN_OCTOVINESQUAD_PARTICIPATION_STATUS = 'participation_status';
_COLUMN_OCTOVINESQUAD_COMMENT = 'comment';

/* ----- Member Online ---------------------------------------------------------------- */
_TABLE_MEMBER_ONLINE = 'Member_Online';

_COLUMN_MEMBERONLINE_AB = 'ab_online';
_COLUMN_MEMBERONLINE_EB = 'eb_online';
