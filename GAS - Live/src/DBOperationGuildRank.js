function getGuildRankByGuildGuid_(guildGuid) {
    var condition = {};
    condition[_COLUMN_GUILD_ID] = guildGuid;

    return selectGuildRankByCondition_(condition);
}

function selectGuildRankByCondition_(condition) {
    var db = objDB.open(_DB_MAIN_FILE_ID);
    var res = objDB.getRows(db, _TABLE_GUILD_RANK, [], condition);

    for (var i = 0; i < res.length; ++i) {
        res[i][_COLUMN_GUILD_RANK_ICON] = res[i][_COLUMN_GUILD_RANK_ICON] ? res[i][_COLUMN_GUILD_RANK_ICON] : '';
    }

    return res;
}

function internalInsertGuildRank_(db, rank) {
    objDB.insertRow(db, _TABLE_GUILD_RANK, rank);
}

function internalUpdateGuildRank_(db, id, rank) {
    var condObj = {};
    condObj[_COLUMN_ID] = id;

    objDB.updateRow(db, _TABLE_GUILD_RANK, rank, condObj);
}

function internalDeleteGuildRank_(db, id) {
    var condition = {};
    condition[_COLUMN_ID] = id;

    objDB.deleteRow(db, _TABLE_GUILD_RANK, condition);
}
