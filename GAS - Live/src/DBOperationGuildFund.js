function selectGuildFund_() {
    var db = objDB.open(_DB_GUILD_FUND_FILE_ID);
    return objDB.getRows(db, _TABLE_GUILD_FUND);
}

function internalInsertGuildFund_(db, fund) {
    objDB.insertRow(db, _TABLE_GUILD_FUND, fund);
}