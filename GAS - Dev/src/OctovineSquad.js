function getOctovineSquads_(request) {
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

    return filteredOctovineSquads;
}

function addOctovineSquad_(request) {
    var timestamp = Number(checkUrlParameter_(request.parameter.timestamp, request.parameter.action, 'timestamp', false));
    var commander = checkUrlParameter_(request.parameter.commander, request.parameter.action, 'commander', false);
    var invitationStatus = Number(checkUrlParameter_(request.parameter.invitation_status, request.parameter.action, 'invitation_status', false));
    var participationStatus = Number(checkUrlParameter_(request.parameter.participation_status, request.parameter.action, 'participation_status', false));
    var comment = checkUrlParameter_(request.parameter.comment, request.parameter.action, 'comment', false);
    
    octovineSquadInfo = {};
    octovineSquadInfo[_COLUMN_OCTOVINESQUAD_COMMANDER] = commander;
    octovineSquadInfo[_COLUMN_OCTOVINESQUAD_INVITATION_STATUS] = invitationStatus;
    octovineSquadInfo[_COLUMN_OCTOVINESQUAD_PARTICIPATION_STATUS] = participationStatus;
    octovineSquadInfo[_COLUMN_OCTOVINESQUAD_COMMENT] = comment;

    var dateUtc = new Date(timestamp);
    octovineSquadInfo[_COLUMN_TIMESTAMP] = timestamp;
    octovineSquadInfo[_COLUMN_UTC] = dateUtc.toISOString();

    var octovineSquadId = insertOctovineSquad_(octovineSquadInfo);

    return getOctovineSquadById_(octovineSquadId);
}

function saveOctovineSquad_(request) {
    var id = checkUrlParameter_(request.parameter.id, request.parameter.action, 'id', false);
    var updateCount = Number(checkUrlParameter_(request.parameter.update_count, request.parameter.action, 'update_count', false));
    var timestamp = Number(checkUrlParameter_(request.parameter.timestamp, request.parameter.action, 'timestamp', false));
    var commander = checkUrlParameter_(request.parameter.commander, request.parameter.action, 'commander', false);
    var invitationStatus = Number(checkUrlParameter_(request.parameter.invitation_status, request.parameter.action, 'invitation_status', false));
    var participationStatus = Number(checkUrlParameter_(request.parameter.participation_status, request.parameter.action, 'participation_status', false));
    var comment = checkUrlParameter_(request.parameter.comment, request.parameter.action, 'comment', true);

    octovineSquadInfo = {};
    octovineSquadInfo[_COLUMN_OCTOVINESQUAD_COMMANDER] = commander;
    octovineSquadInfo[_COLUMN_OCTOVINESQUAD_INVITATION_STATUS] = invitationStatus;
    octovineSquadInfo[_COLUMN_OCTOVINESQUAD_PARTICIPATION_STATUS] = participationStatus;
    octovineSquadInfo[_COLUMN_OCTOVINESQUAD_COMMENT] = comment;

    var dateUtc = new Date(timestamp);
    octovineSquadInfo[_COLUMN_TIMESTAMP] = timestamp;
    octovineSquadInfo[_COLUMN_UTC] = dateUtc.toISOString();

    updateOctovineSquad_(id, updateCount, octovineSquadInfo);

    return getOctovineSquadById_(id);
}

function removeOctovineSquad_(request) {
    var id = checkUrlParameter_(request.parameter.id, request.parameter.action, 'id', false);

    deleteOctovineSquad_(id);
}

