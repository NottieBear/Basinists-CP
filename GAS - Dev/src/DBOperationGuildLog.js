function getLastLogId_(guildGuid) {
    var condition = {};
    condition[_COLUMN_GUILD_ID] = guildGuid;

    var db = objDB.open(_DB_GUILD_LOG_FILE_ID);
    var configRec = objDB.getRows(db, _TABLE_GUILD_CONFIG, [_COLUMN_GUILD_CONFIG_LAST_LOG_ID], condition);

    return configRec[0][_COLUMN_GUILD_CONFIG_LAST_LOG_ID];
}

function saveLastLogId_(guildGuid, id) {
    var condition = {};
    condition[_COLUMN_GUILD_ID] = guildGuid;

    var configRecord = {};
    configRecord[_COLUMN_GUILD_CONFIG_LAST_LOG_ID] = id;

    var db = objDB.open(_DB_GUILD_LOG_FILE_ID);
    objDB.updateRow(db, _TABLE_GUILD_CONFIG, configRecord, condition);
}

function isLogTableExist_(log) {
    return SpreadsheetApp.openById(_DB_GUILD_LOG_FILE_ID).getSheetByName(log.type) !== null;
}

function insertPendingLog_(guildGuid, log, errorMsg) {
    var pendingLog = {};
    pendingLog[_COLUMN_GUILD_ID] = guildGuid;
    pendingLog[_COLUMN_GUILD_PENDING_LOG_JSON_STRING] = JSON.stringify(log);
    pendingLog[_COLUMN_GUILD_PENDING_LOG_ERROR] = errorMsg;

    var db = objDB.open(_DB_GUILD_LOG_FILE_ID);
    objDB.insertRow(db, _TABLE_GUILD_PENDING_LOG, pendingLog);
}

function batchInsertGuildLog_(tableName, logs) {
    var db = objDB.open(_DB_GUILD_LOG_FILE_ID);

    for (var i = 0; i < logs.length; ++i) {
        objDB.insertRow(db, tableName, logs[i]);
    }
}