urlActionMappingGet = {};
urlActionMappingGet['test'] = urlActionTest_;
urlActionMappingGet['save_octovine_squad_and_member_online_info'] = saveOctovineSquadAndMemberOnlineInfo_;
urlActionMappingGet['get_enums'] = getEnums_;
urlActionMappingGet['get_signed_in_user_info'] = getSignedInUserInfo_;
urlActionMappingGet['save_gw2_api_key'] = saveGW2ApiKey_;
urlActionMappingGet['get_guild_roster_members'] = getGuildRosterMembers_;
urlActionMappingGet['save_guild_roster_member_info'] = saveGuildRosterMemberInfo_;
urlActionMappingGet['get_guild_funds'] = getGuildFunds_;
urlActionMappingGet['get_member_onlines'] = getMemberOnlines_;
urlActionMappingGet['add_member_online'] = addMemberOnline_;
urlActionMappingGet['save_member_online'] = saveMemberOnline_;
urlActionMappingGet['remove_member_online'] = removeMemberOnline_;
urlActionMappingGet['get_octovine_squads'] = getOctovineSquads_;
urlActionMappingGet['add_octovine_squad'] = addOctovineSquad_;
urlActionMappingGet['save_octovine_squad'] = saveOctovineSquad_;
urlActionMappingGet['remove_octovine_squad'] = removeOctovineSquad_;
urlActionMappingGet['get_overall_octovine_squad_leaderboard'] = getOverallOctovineSquadLeaderboard_;
urlActionMappingGet['get_date_range_octovine_squad_leaderboard'] = getDateRangeOctovineSquadLeaderboard_;

function urlActionTest_(request) {
    return request;
}

function checkUrlParameter_(param, actionName, paramName, ignoreBlankValue) {
    var _ = underscore.load();
    if (_.isUndefined(param) || _.isNull(param) || (!ignoreBlankValue && _.isEmpty(param))) {
        throw new Error('Missing parameter or value : Action [' + actionName + '] - ' + paramName + '.');
    }

    return param;
}