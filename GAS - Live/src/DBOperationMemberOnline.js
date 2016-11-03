function getMemberOnlineById_(id) {
    var condition = {};
    condition[_COLUMN_ID] = id;

    var memberOnlines = selectMemberOnlineByCondition_(condition);
    return memberOnlines.length > 0 ? memberOnlines[0] : null;
}

function selectMemberOnline_() {
    var db = objDB.open(_DB_MEMBER_ONLINE_FILE_ID);
    return objDB.getRows(db, _TABLE_MEMBER_ONLINE);
}

function selectMemberOnlineByCondition_(condition) {
    var db = objDB.open(_DB_MEMBER_ONLINE_FILE_ID);
    return objDB.getRows(db, _TABLE_MEMBER_ONLINE, [], condition);
}

function insertMemberOnline_(memberOnline) {
    memberOnline[_COLUMN_ID] = Utilities.getUuid();
    memberOnline[_COLUMN_UPDATE_COUNT] = 0;

    var db = objDB.open(_DB_MEMBER_ONLINE_FILE_ID);
    objDB.insertRow(db, _TABLE_MEMBER_ONLINE, memberOnline);

    return memberOnline[_COLUMN_ID];
}

function updateMemberOnline_(id, updateCount, memberOnline) {
    var lock = LockService.getScriptLock();

    try {
        lock.waitLock(30000);
    }
    catch (e) {
        throw new Error('Fail to update member online info.  The record is locked and does not release lock after 30 seconds.');
    }

    if (isMatchUpdateCount_(_DB_MEMBER_ONLINE_FILE_ID, _TABLE_MEMBER_ONLINE, id, updateCount)) {
        memberOnline[_COLUMN_UPDATE_COUNT] = updateCount + 1;

        var db = objDB.open(_DB_MEMBER_ONLINE_FILE_ID);
        internalUpdateMemberOnline_(db, id, memberOnline);
    }
    else {
        throw new Error('Fail to update member online info.  The record is either outdated or deleted, please refresh and try again.');
    }

    lock.releaseLock();
}

function deleteMemberOnline_(id) {
    var condition = {};
    condition[_COLUMN_ID] = id;

    var db = objDB.open(_DB_MEMBER_ONLINE_FILE_ID);
    objDB.deleteRow(db, _TABLE_MEMBER_ONLINE, condition);
}

function internalUpdateMemberOnline_(db, id, memberOnline) {
    var condition = {};
    condition[_COLUMN_ID] = id;

    objDB.updateRow(db, _TABLE_MEMBER_ONLINE, memberOnline, condition);
}