function getGuildFunds_(request) {
    var fromTimestamp = Number(checkUrlParameter_(request.parameter.from_timestamp, request.parameter.action, 'from_timestamp', false));
    var toTimestamp = Number(checkUrlParameter_(request.parameter.to_timestamp, request.parameter.action, 'to_timestamp', false));

    var guildFunds = selectGuildFund_();

    var _ = underscore.load();

    var filteredGuildFunds = [];
    _.each(guildFunds, function (fund) {
        if (isBetweenTimeStamp_(fund, fromTimestamp, toTimestamp)) {
            filteredGuildFunds.push(fund);
        }
    });

    return filteredGuildFunds;
}