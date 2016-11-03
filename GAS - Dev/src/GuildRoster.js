function getGuildRosterMembers_() {
    var guildMembers = selectGuildMember_();
    var abGuildRanks = getGuildRankByGuildGuid_(_GW2_AB_GUILD_GUID);
    var ebGuildRanks = getGuildRankByGuildGuid_(_GW2_EB_GUILD_GUID);

    var _ = underscore.load();
    var rosterMembers = [];

    _.each(guildMembers, function (member) {
        rosterMembers.push(formatGuildRosterRecord_(member, abGuildRanks, ebGuildRanks));
    }, this);

    return rosterMembers;
}

function saveGuildRosterMemberInfo_(request) {
    var id = checkUrlParameter_(request.parameter.id, request.parameter.action, 'id', false);
    var updateCount = Number(checkUrlParameter_(request.parameter.update_count, request.parameter.action, 'update_count', false));
    var alias = checkUrlParameter_(request.parameter.alias, request.parameter.action, 'alias', true);
    var note = checkUrlParameter_(request.parameter.note, request.parameter.action, 'note', true);

    memberInfo = {};
    memberInfo[_COLUMN_GUILD_MEMBER_ALIAS] = alias;
    memberInfo[_COLUMN_GUILD_MEMBER_NOTE] = note;
    updateGuildMember_(id, updateCount, memberInfo);

    var member = getGuildMemberById_(id);

    var abGuildRanks = getGuildRankByGuildGuid_(_GW2_AB_GUILD_GUID);
    var ebGuildRanks = getGuildRankByGuildGuid_(_GW2_EB_GUILD_GUID);
    return formatGuildRosterRecord_(member, abGuildRanks, ebGuildRanks);
}

function formatGuildRosterRecord_(rec, abGuildRanks, ebGuildRanks) {
    var rosterMember = {};
    rosterMember[_COLUMN_ID] = rec[_COLUMN_ID];
    rosterMember[_COLUMN_UPDATE_COUNT] = rec[_COLUMN_UPDATE_COUNT];
    rosterMember[_COLUMN_GUILD_MEMBER_NAME] = rec[_COLUMN_GUILD_MEMBER_NAME];
    rosterMember[_COLUMN_GUILD_MEMBER_ALIAS] = rec[_COLUMN_GUILD_MEMBER_ALIAS] ? rec[_COLUMN_GUILD_MEMBER_ALIAS] : '';
    rosterMember[_COLUMN_GUILD_MEMBER_AB_RANK] = rec[_COLUMN_GUILD_MEMBER_AB_RANK] ? rec[_COLUMN_GUILD_MEMBER_AB_RANK] : '';
    rosterMember[_COLUMN_GUILD_MEMBER_EB_RANK] = rec[_COLUMN_GUILD_MEMBER_EB_RANK] ? rec[_COLUMN_GUILD_MEMBER_EB_RANK] : '';
    rosterMember[_COLUMN_GUILD_MEMBER_AB_JOIN_TIMESTAMP] = rec[_COLUMN_GUILD_MEMBER_AB_JOIN_TIMESTAMP] ? rec[_COLUMN_GUILD_MEMBER_AB_JOIN_TIMESTAMP] : '';
    rosterMember[_COLUMN_GUILD_MEMBER_EB_JOIN_TIMESTAMP] = rec[_COLUMN_GUILD_MEMBER_EB_JOIN_TIMESTAMP] ? rec[_COLUMN_GUILD_MEMBER_EB_JOIN_TIMESTAMP] : '';
    rosterMember[_COLUMN_GUILD_MEMBER_NOTE] = rec[_COLUMN_GUILD_MEMBER_NOTE] ? rec[_COLUMN_GUILD_MEMBER_NOTE] : '';

    rosterMember.ab_rank_order = getRankOrder_(rec[_COLUMN_GUILD_MEMBER_AB_RANK], abGuildRanks);
    rosterMember.eb_rank_order = getRankOrder_(rec[_COLUMN_GUILD_MEMBER_EB_RANK], ebGuildRanks);

    var rankInfo = mergeMemberRank_(rec, abGuildRanks, ebGuildRanks);
    rosterMember.merge_rank_name = rankInfo.rankName;
    rosterMember.merge_rank_order = rankInfo.rankOrder;

    return rosterMember;
}

function mergeMemberRank_(member, abGuildRanks, ebGuildRanks) {
    var _ = underscore.load();
    var abRankOrder = getRankOrder_(member[_COLUMN_GUILD_MEMBER_AB_RANK], abGuildRanks);
    var ebRankOrder = getRankOrder_(member[_COLUMN_GUILD_MEMBER_EB_RANK], ebGuildRanks);
    
    if (ebRankOrder < abRankOrder) {
        return { rankName: member[_COLUMN_GUILD_MEMBER_EB_RANK], rankOrder: ebRankOrder };
    }
    else {
        return { rankName: member[_COLUMN_GUILD_MEMBER_AB_RANK], rankOrder: abRankOrder };
    }
}

function getRankOrder_(rankName, ranks) {
    var _ = underscore.load();
    return rankName ? _.find(ranks, function (rank) { return rank[_COLUMN_GUILD_RANK_NAME].toLowerCase() === rankName.toLowerCase() })[_COLUMN_GUILD_RANK_ORDER] : Number.MAX_VALUE;
}
