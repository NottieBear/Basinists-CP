function triggerUpdateGuildLog() {
    var abGuildLogs = fetchGuildLog_(_GW2_AB_GUILD_GUID);
    var ebGuildLogs = fetchGuildLog_(_GW2_EB_GUILD_GUID);

    processGuildLog_(_GW2_AB_GUILD_GUID, abGuildLogs);
    processGuildLog_(_GW2_EB_GUILD_GUID, ebGuildLogs);

    updateServerTaskStatus_('triggerUpdateGuildLog', '');
}

function processGuildLog_(guildGuid, logs) {
    var lastLogId = getLastLogId_(guildGuid);
    var biggestLogId = lastLogId;
    var logsToBeInserted = {};

    var _ = underscore.load();

    for (var i = 0; i < logs.length; ++i) {
        if (logs[i].id > lastLogId) {
            if (!isLogTableExist_(logs[i])) {
                insertPendingLog_(guildGuid, logs[i], 'Missing Table: ' + logs[i][_COLUMN_GUILD_LOG_TYPE]);
            }
            else {
                if (!logsToBeInserted[logs[i][_COLUMN_GUILD_LOG_TYPE]]) {
                    logsToBeInserted[logs[i][_COLUMN_GUILD_LOG_TYPE]] = [];
                }

                var valueObj = {};
                _.each(_.keys(logs[i]), function (key) { valueObj[key] = logs[i][key]; });

                valueObj[_COLUMN_GUILD_LOG_ID] = valueObj[_COLUMN_ID];
                valueObj[_COLUMN_ID] = Utilities.getUuid();
                valueObj[_COLUMN_UPDATE_COUNT] = 0;
                valueObj[_COLUMN_GUILD_ID] = guildGuid;

                var utcDate = new Date(valueObj[_COLUMN_GUILD_LOG_TIME]);
                valueObj[_COLUMN_TIMESTAMP] = utcDate.getTime();
                valueObj[_COLUMN_UTC] = utcDate.toISOString();

                logsToBeInserted[logs[i][_COLUMN_GUILD_LOG_TYPE]].push(valueObj);
            }

            if (biggestLogId < logs[i].id) {
                biggestLogId = logs[i].id;
            }
        }
    }

    _.each(_.keys(logsToBeInserted), function (key) { batchInsertGuildLog_(key, logsToBeInserted[key]); });
    saveLastLogId_(guildGuid, biggestLogId);
}
