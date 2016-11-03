function triggerUpdateGuildRankAndMember() {
    var abGuildRanks = fetchGuildRank_(_GW2_AB_GUILD_GUID);
    var ebGuildRanks = fetchGuildRank_(_GW2_EB_GUILD_GUID);

    processGuildRank_(_GW2_AB_GUILD_GUID, abGuildRanks);
    processGuildRank_(_GW2_EB_GUILD_GUID, ebGuildRanks);

    var abGuildMembers = fetchGuildMember_(_GW2_AB_GUILD_GUID);
    var ebGuildMembers = fetchGuildMember_(_GW2_EB_GUILD_GUID);
    var allMembers = mergeGuildMember_(abGuildMembers, ebGuildMembers);

    processGuildMember_(allMembers);

    updateServerTaskStatus_('triggerUpdateGuildRankAndMember', '');
}

function mergeGuildMember_(abMembers, ebMembers) {
    var _ = underscore.load();

    var allMembers = _.map(abMembers, function (abMember) {
        var mergeMember = {};
        mergeMember[_COLUMN_GUILD_MEMBER_NAME] = abMember.name;
        mergeMember[_COLUMN_GUILD_MEMBER_AB_RANK] = abMember.rank;

        var joinDate = new Date(abMember.joined);
        mergeMember[_COLUMN_GUILD_MEMBER_AB_JOIN_TIMESTAMP] = joinDate.getTime();
        mergeMember[_COLUMN_GUILD_MEMBER_AB_JOIN_UTC] = joinDate.toISOString();

        return mergeMember;
    });

    _.each(ebMembers, function (ebMember) {
        var matchMember = _.find(allMembers, function (allMember) {
            return allMember.name === ebMember.name;
        });

        var joinDate = new Date(ebMember.joined);
        if (matchMember) {
            matchMember[_COLUMN_GUILD_MEMBER_EB_RANK] = ebMember.rank;
            matchMember[_COLUMN_GUILD_MEMBER_EB_JOIN_TIMESTAMP] = joinDate.getTime();
            matchMember[_COLUMN_GUILD_MEMBER_EB_JOIN_UTC] = joinDate.toISOString();
        }
        else {
            var mergeMember = {};
            mergeMember[_COLUMN_GUILD_MEMBER_NAME] = ebMember.name;
            mergeMember[_COLUMN_GUILD_MEMBER_EB_RANK] = ebMember.rank;
            mergeMember[_COLUMN_GUILD_MEMBER_EB_JOIN_TIMESTAMP] = joinDate.getTime();
            mergeMember[_COLUMN_GUILD_MEMBER_EB_JOIN_UTC] = joinDate.toISOString();

            allMembers.push(mergeMember);
        }
    });

    return allMembers;
}

function processGuildRank_(guildGuid, ranks) {
    var guildRanks = getGuildRankByGuildGuid_(guildGuid);

    var rankToInsert = [];
    var rankToUpdate = [];
    var _ = underscore.load();

    _.each(ranks, function (rank) {
        var existing = _.find(guildRanks, function (guildRank) {
            return guildRank[_COLUMN_GUILD_RANK_NAME] === rank.id;
        });

        if (existing) {
            var change = false;
            if (existing[_COLUMN_GUILD_RANK_ORDER] !== rank.order) {
                existing[_COLUMN_GUILD_RANK_ORDER] = rank.order;
                change = true;
            }

            if (existing[_COLUMN_GUILD_RANK_ICON] !== rank.icon) {
                existing[_COLUMN_GUILD_RANK_ICON] = rank.icon;
                change = true;
            }

            if (change) {
                rankToUpdate.push(existing);
            }

            existing.markProcessed = true;
        }
        else {
            var newRank = {};
            newRank[_COLUMN_ID] = Utilities.getUuid();
            newRank[_COLUMN_UPDATE_COUNT] = 0;
            newRank[_COLUMN_GUILD_ID] = guildGuid;
            newRank[_COLUMN_GUILD_RANK_NAME] = rank.id;
            newRank[_COLUMN_GUILD_RANK_ORDER] = rank.order;
            newRank[_COLUMN_GUILD_RANK_ICON] = rank.icon;
            rankToInsert.push(newRank);
        }
    });

    var db = objDB.open(_DB_MAIN_FILE_ID);
    _.each(rankToInsert, function (insertRank) {
        internalInsertGuildRank_(db, insertRank);
    });

    _.each(rankToUpdate, function (updateRank) {
        var valueObj = {};
        valueObj[_COLUMN_GUILD_RANK_ORDER] = updateRank[_COLUMN_GUILD_RANK_ORDER];
        valueObj[_COLUMN_GUILD_RANK_ICON] = updateRank[_COLUMN_GUILD_RANK_ICON];

        internalUpdateGuildRank_(db, updateRank[_COLUMN_ID], valueObj);
    });

    _.each(guildRanks, function (processedRank) {
        if (!processedRank.markProcessed) {
            internalDeleteGuildRank_(db, processedRank[_COLUMN_ID]);
        }
    });
}

function processGuildMember_(allMembers) {
    var guildMembers = selectGuildMember_();

    var memberToInsert = [];
    var memberToUpdate = [];

    var _ = underscore.load();

    _.each(allMembers, function (allMember) {
        var existing = _.find(guildMembers, function (guildMember) {
            return guildMember[_COLUMN_GUILD_MEMBER_NAME] === allMember.name;
        });

        if (existing) {
            var change = false;

            if (existing[_COLUMN_GUILD_MEMBER_AB_RANK] !== allMember[_COLUMN_GUILD_MEMBER_AB_RANK]) {
                existing[_COLUMN_GUILD_MEMBER_AB_RANK] = allMember[_COLUMN_GUILD_MEMBER_AB_RANK];
                change = true;
            }

            if (existing[_COLUMN_GUILD_MEMBER_EB_RANK] !== allMember[_COLUMN_GUILD_MEMBER_EB_RANK]) {
                existing[_COLUMN_GUILD_MEMBER_EB_RANK] = allMember[_COLUMN_GUILD_MEMBER_EB_RANK];
                change = true;
            }

            if (change) {
                memberToUpdate.push(existing);
            }

            existing.markProcessed = true;
        }
        else {
            allMember[_COLUMN_ID] = Utilities.getUuid();
            allMember[_COLUMN_UPDATE_COUNT] = 0;
            
            memberToInsert.push(allMember);
        }
    });

    var db = objDB.open(_DB_MAIN_FILE_ID);
    _.each(memberToInsert, function (insertMember) {
        internalInsertGuildMember_(db, insertMember);
    });

    _.each(memberToUpdate, function (updateMember) {
        var valueObj = {};
        valueObj[_COLUMN_GUILD_MEMBER_AB_RANK] = updateMember[_COLUMN_GUILD_MEMBER_AB_RANK];
        valueObj[_COLUMN_GUILD_MEMBER_EB_RANK] = updateMember[_COLUMN_GUILD_MEMBER_EB_RANK];

        internalUpdateGuildMember_(db, updateMember[_COLUMN_ID], valueObj);
    });

    _.each(guildMembers, function (processedMember) {
        if (!processedMember.markProcessed) {
            internalDeleteGuildMember_(db, processedMember[_COLUMN_ID]);
        }
    });
}