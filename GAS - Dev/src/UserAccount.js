function getSignedInUserInfo_(request) {
    var firebaseUserId = checkUrlParameter_(request.parameter.firebase_user_id, request.parameter.action, 'firebase_user_id', false);
    return internalGetSignedInUserInfo_(firebaseUserId);
}

function saveGW2ApiKey_(request) {
    var firebaseUserId = checkUrlParameter_(request.parameter.firebase_user_id, request.parameter.action, 'firebase_user_id', false);
    var gw2ApiKey = checkUrlParameter_(request.parameter.gw2_api_key, request.parameter.action, 'gw2_api_key', false);

    var gw2Account = fetchAccount_(gw2ApiKey);
    if (isBelongABorEB_(gw2Account)) {
        var member = getGuildMemberByMemberName_(gw2Account.name);
        if (member) {
            var memberValue = {};
            memberValue[_COLUMN_GUILD_MEMBER_FIREBASE_USER_ID] = firebaseUserId;
            memberValue[_COLUMN_GUILD_MEMBER_GW2_API_KEY] = gw2ApiKey;

            var db = objDB.open(_DB_MAIN_FILE_ID);
            internalUpdateGuildMember_(db, member[_COLUMN_ID], memberValue);

            return internalGetSignedInUserInfo_(firebaseUserId);
        }
    }

    throw new Error('The API key\'s account isn\'t an Auric Basinists[AB] or Exalted Basinists[EB] member.');
}

function isBelongABorEB_(gw2Account) {
    var _ = underscore.load();
    var found = _.find(gw2Account.guilds, function (guildGuid) { return guildGuid.toLowerCase() === _GW2_AB_GUILD_GUID.toLowerCase() || guildGuid.toLowerCase() === _GW2_EB_GUILD_GUID.toLowerCase() });

    return found ? true : false;
}

function internalGetSignedInUserInfo_(firebaseUserId) {
    var signedInUserInfo = { name: 'Guest', gw2ApiKeyExist: false, rankName: '', rankOrder: Number.MAX_VALUE };

    var member = getGuildMemberByFirebaseUserId_(firebaseUserId);
    if (member) {
        signedInUserInfo.name = member[_COLUMN_GUILD_MEMBER_NAME];
        signedInUserInfo.gw2ApiKeyExist = member[_COLUMN_GUILD_MEMBER_GW2_API_KEY] ? true : false;

        var abGuildRanks = getGuildRankByGuildGuid_(_GW2_AB_GUILD_GUID);
        var ebGuildRanks = getGuildRankByGuildGuid_(_GW2_EB_GUILD_GUID);
        var rankInfo = mergeMemberRank_(member, abGuildRanks, ebGuildRanks);

        signedInUserInfo.rankName = rankInfo.rankName;
        signedInUserInfo.rankOrder = rankInfo.rankOrder;
    }

    return signedInUserInfo;
}