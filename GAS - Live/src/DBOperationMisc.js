function updateServerTaskStatus_(name, detail) {
    var taskStatus = {};

    var lastRunDate = new Date();
    taskStatus[_COLUMN_SERVER_TASK_LAST_RUN_UTC] = lastRunDate.toISOString();
    taskStatus[_COLUMN_SERVER_TASK_DETAIL] = detail;

    var condObj = {};
    condObj[_COLUMN_SERVER_TASK_NAME] = name;

    var db = objDB.open(_DB_MAIN_FILE_ID);
    objDB.replaceRow(db, _TABLE_SERVER_TASK_STATUS, taskStatus, condObj);
}

function isMatchUpdateCount_(dbFileId, table, id, updateCount) {
    var cond = {};
    cond[_COLUMN_ID] = id;
    cond[_COLUMN_UPDATE_COUNT] = updateCount;

    var db = objDB.open(dbFileId);
    var res = objDB.getRows(db, table, [_COLUMN_ID], cond);
    return res.length === 1;
}

function isBetweenTimeStamp_(rec, from, to) {
    return (rec[_COLUMN_TIMESTAMP] >= from) && (rec[_COLUMN_TIMESTAMP] <= to);
}

