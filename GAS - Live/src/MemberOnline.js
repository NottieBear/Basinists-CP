function getMemberOnlines_(request) {
    var fromTimestamp = Number(checkUrlParameter_(request.parameter.from_timestamp, request.parameter.action, 'from_timestamp', false));
    var toTimestamp = Number(checkUrlParameter_(request.parameter.to_timestamp, request.parameter.action, 'to_timestamp', false));

    var memberOnlines = selectMemberOnline_();

    var _ = underscore.load();

    var filteredMemberOnlines = [];
    _.each(memberOnlines, function (memberOnline) {
        if (isBetweenTimeStamp_(memberOnline, fromTimestamp, toTimestamp)) {
            filteredMemberOnlines.push(memberOnline);
        }
    });

    return filteredMemberOnlines;
}

function addMemberOnline_(request) {
    var abOnline = Number(checkUrlParameter_(request.parameter.ab_online, request.parameter.action, 'ab_online', false));
    var ebOnline = Number(checkUrlParameter_(request.parameter.eb_online, request.parameter.action, 'eb_online', false));
    var timestamp = Number(checkUrlParameter_(request.parameter.timestamp, request.parameter.action, 'timestamp', false));

    onlineInfo = {};
    onlineInfo[_COLUMN_MEMBERONLINE_AB] = abOnline;
    onlineInfo[_COLUMN_MEMBERONLINE_EB] = ebOnline;

    var dateUtc = new Date(timestamp);
    onlineInfo[_COLUMN_TIMESTAMP] = timestamp;
    onlineInfo[_COLUMN_UTC] = dateUtc.toISOString();

    var memberOnlineId = insertMemberOnline_(onlineInfo);

    return getMemberOnlineById_(memberOnlineId);
}

function saveMemberOnline_(request) {
    var id = checkUrlParameter_(request.parameter.id, request.parameter.action, 'id', false);
    var updateCount = Number(checkUrlParameter_(request.parameter.update_count, request.parameter.action, 'update_count', false));
    var abOnline = Number(checkUrlParameter_(request.parameter.ab_online, request.parameter.action, 'ab_online', false));
    var ebOnline = Number(checkUrlParameter_(request.parameter.eb_online, request.parameter.action, 'eb_online', false));
    var timestamp = Number(checkUrlParameter_(request.parameter.timestamp, request.parameter.action, 'timestamp', false));

    onlineInfo = {};
    onlineInfo[_COLUMN_MEMBERONLINE_AB] = abOnline;
    onlineInfo[_COLUMN_MEMBERONLINE_EB] = ebOnline;

    var dateUtc = new Date(timestamp);
    onlineInfo[_COLUMN_TIMESTAMP] = timestamp;
    onlineInfo[_COLUMN_UTC] = dateUtc.toISOString();

    updateMemberOnline_(id, updateCount, onlineInfo);

    return getMemberOnlineById_(id);
}

function removeMemberOnline_(request) {
    var id = checkUrlParameter_(request.parameter.id, request.parameter.action, 'id', false);

    deleteMemberOnline_(id);
}