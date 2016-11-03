function getOctovineSquadById_(id) {
    var condition = {};
    condition[_COLUMN_ID] = id;

    var octovineSquads = selectOctovineSquadByCondition_(condition);
    return octovineSquads.length > 0 ? octovineSquads[0] : null;
}

function selectOctovineSquad_() {
    var db = objDB.open(_DB_OCTOVINE_SQUAD_FILE_ID);
    return objDB.getRows(db, _TABLE_OCTOVINE_SQUAD);
}

function selectOctovineSquadByCondition_(condition) {
    var db = objDB.open(_DB_OCTOVINE_SQUAD_FILE_ID);
    return objDB.getRows(db, _TABLE_OCTOVINE_SQUAD, [], condition);
}

function insertOctovineSquad_(octovineSquad) {
    octovineSquad[_COLUMN_ID] = Utilities.getUuid();
    octovineSquad[_COLUMN_UPDATE_COUNT] = 0;

    var createDateUtc = new Date();
    octovineSquad[_COLUMN_CREATE_TIMESTAMP] = createDateUtc.getTime();
    octovineSquad[_COLUMN_CREATE_UTC] = createDateUtc.toISOString();

    var db = objDB.open(_DB_OCTOVINE_SQUAD_FILE_ID);
    objDB.insertRow(db, _TABLE_OCTOVINE_SQUAD, octovineSquad);

    return octovineSquad[_COLUMN_ID];
}

function updateOctovineSquad_(id, updateCount, octovineSquad) {
    var lock = LockService.getScriptLock();

    try {
        lock.waitLock(30000);
    }
    catch (e) {
        throw new Error('Fail to update octovine squad info.  The record is locked and does not release lock after 30 seconds.');
    }

    if (isMatchUpdateCount_(_DB_OCTOVINE_SQUAD_FILE_ID, _TABLE_OCTOVINE_SQUAD, id, updateCount)) {
        octovineSquad[_COLUMN_UPDATE_COUNT] = updateCount + 1;

        var db = objDB.open(_DB_OCTOVINE_SQUAD_FILE_ID);
        internalUpdateOctovineSquad_(db, id, octovineSquad);
    }
    else {
        throw new Error('Fail to update octovine squad info.  The record is either outdated or deleted, please refresh and try again.');
    }

    lock.releaseLock();
}

function deleteOctovineSquad_(id) {
    var condition = {};
    condition[_COLUMN_ID] = id;

    var db = objDB.open(_DB_OCTOVINE_SQUAD_FILE_ID);
    objDB.deleteRow(db, _TABLE_OCTOVINE_SQUAD, condition);
}

function internalUpdateOctovineSquad_(db, id, octovineSquad) {
    var condition = {};
    condition[_COLUMN_ID] = id;

    objDB.updateRow(db, _TABLE_OCTOVINE_SQUAD, octovineSquad, condition);
}
