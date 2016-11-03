function getGuildMemberByFirebaseUserId_(firebaseUserId) {
    var condition = {};
    condition[_COLUMN_GUILD_MEMBER_FIREBASE_USER_ID] = firebaseUserId;

    var members = selectGuildMemberByCondition_(condition);
    return members.length > 0 ? members[0] : null;
}

function getGuildMemberByMemberName_(memberName) {
    var condition = {};
    condition[_COLUMN_GUILD_MEMBER_NAME] = memberName;

    var members = selectGuildMemberByCondition_(condition);
    return members.length > 0 ? members[0] : null;
}

function getGuildMemberById_(id) {
    var condition = {};
    condition[_COLUMN_ID] = id;

    var members = selectGuildMemberByCondition_(condition);
    return members.length > 0 ? members[0] : null;
}

function selectGuildMember_() {
    var db = objDB.open(_DB_MAIN_FILE_ID);
    return objDB.getRows(db, _TABLE_GUILD_MEMBER);
}

function selectGuildMemberByCondition_(condition) {
    var db = objDB.open(_DB_MAIN_FILE_ID);
    return objDB.getRows(db, _TABLE_GUILD_MEMBER, [], condition);
}

function updateGuildMember_(id, updateCount, member) {
    var lock = LockService.getScriptLock();

    try {
        lock.waitLock(30000);
    }
    catch (e) {
        throw new Error('Fail to update member info.  The record is locked and does not release lock after 30 seconds.');
    }

    if (isMatchUpdateCount_(_DB_MAIN_FILE_ID, _TABLE_GUILD_MEMBER, id, updateCount)) {
        member[_COLUMN_UPDATE_COUNT] = updateCount + 1;

        var db = objDB.open(_DB_MAIN_FILE_ID);
        internalUpdateGuildMember_(db, id, member);
    }
    else {
        throw new Error('Fail to update member info.  The record is either outdated or deleted, please refresh and try again.');
    }

    lock.releaseLock();
}

function internalInsertGuildMember_(db, member) {
    objDB.insertRow(db, _TABLE_GUILD_MEMBER, member);
}

function internalUpdateGuildMember_(db, id, member) {
    var condition = {};
    condition[_COLUMN_ID] = id;

    objDB.updateRow(db, _TABLE_GUILD_MEMBER, member, condition);
}

function internalDeleteGuildMember_(db, id) {
    var condition = {};
    condition[_COLUMN_ID] = id;

    objDB.deleteRow(db, _TABLE_GUILD_MEMBER, condition);
}
