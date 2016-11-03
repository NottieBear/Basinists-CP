function triggerUpdateGuildFund() {
    var abGuildFund = fetchGuidFund_(_GW2_AB_GUILD_GUID);
    var ebGuildFund = fetchGuidFund_(_GW2_EB_GUILD_GUID);

    processGuidFund_(_GW2_AB_GUILD_GUID, abGuildFund);
    processGuidFund_(_GW2_EB_GUILD_GUID, ebGuildFund);

    updateServerTaskStatus_('triggerUpdateGuildFund', '');
}

function processGuidFund_(guildGuid, guildFund) {
    var fund = {};
    fund[_COLUMN_ID] = Utilities.getUuid();
    fund[_COLUMN_UPDATE_COUNT] = 0;
    fund[_COLUMN_GUILD_ID] = guildGuid;
    fund[_COLUMN_GUILDFUND_GUILD_STASH] = 0;
    fund[_COLUMN_GUILDFUND_TREASURE_TROVE] = 0;
    fund[_COLUMN_GUILDFUND_DEEP_CAVE] = 0;

    var d = new Date();
    fund[_COLUMN_UTC] = d.toISOString();
    fund[_COLUMN_TIMESTAMP] = d.getTime();

    for (var i = 0; i < guildFund.length; ++i) {
        if (guildFund[i].upgrade_id == _GW2_API_GUILD_STASH_UPGRADE_ID) {
            fund[_COLUMN_GUILDFUND_GUILD_STASH] = guildFund[i].coins;
        }
        else if (guildFund[i].upgrade_id == _GW2_API_TREASURE_TROVE_UPGRADE_ID) {
            fund[_COLUMN_GUILDFUND_TREASURE_TROVE] = guildFund[i].coins;
        }
        else if (guildFund[i].upgrade_id == _GW2_API_DEEP_CAVE_UPGRADE_ID) {
            fund[_COLUMN_GUILDFUND_DEEP_CAVE] = guildFund[i].coins;
        }
    }

    var db = objDB.open(_DB_GUILD_FUND_FILE_ID);
    internalInsertGuildFund_(db, fund);
}