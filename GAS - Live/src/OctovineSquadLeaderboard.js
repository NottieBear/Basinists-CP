function getOverallOctovineSquadLeaderboard_() {
    var octovineSquads = selectOctovineSquad_();
    return calculateLeaderboard_(octovineSquads);
}

function getDateRangeOctovineSquadLeaderboard_(request) {
    var fromTimestamp = Number(checkUrlParameter_(request.parameter.from_timestamp, request.parameter.action, 'from_timestamp', false));
    var toTimestamp = Number(checkUrlParameter_(request.parameter.to_timestamp, request.parameter.action, 'to_timestamp', false));

    var octovineSquads = selectOctovineSquad_();

    var _ = underscore.load();

    var filteredOctovineSquads = [];
    _.each(octovineSquads, function (octovineSquad) {
        if (isBetweenTimeStamp_(octovineSquad, fromTimestamp, toTimestamp)) {
            filteredOctovineSquads.push(octovineSquad);
        }
    });

    return calculateLeaderboard_(filteredOctovineSquads);
}

function calculateLeaderboard_(list) {
    var _ = underscore.load();

    var groupByCmdrs = _.groupBy(list, function (squad) { return squad[_COLUMN_OCTOVINESQUAD_COMMANDER].toLowerCase(); });

    var totalSquad = 0;
    var cmdrSquadCount = [];
    _.each(groupByCmdrs, function (squads, cmdrName) {
        if (cmdrName && cmdrName != 'unknown') {
            totalSquad += squads.length;
            cmdrSquadCount.push({ player: cmdrName, squad_count: squads.length });
        }
    });

    _.sortBy(cmdrSquadCount, function (squadCount) { return -squadCount });

    return { total: totalSquad, rank: cmdrSquadCount };
}