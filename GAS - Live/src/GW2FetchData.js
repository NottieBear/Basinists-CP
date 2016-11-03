function fetchGuildRank_(guildGuid) {
    var apiUrl = _GW2_GUILD_API_BASE_URL + guildGuid + _GW2_GUILD_API_RANKS;
    var params = { headers: { 'Authorization': 'Bearer ' + _GW2_GUILD_API_KEY } };

    var response = UrlFetchApp.fetch(apiUrl, params);

    var ranks = JSON.parse(response.getContentText());
    ranks.push({ id: 'Invited', order: 99, icon: '' });

    return ranks;
}

function fetchGuildMember_(guildGuid) {
    var apiUrl = _GW2_GUILD_API_BASE_URL + guildGuid + _GW2_GUILD_API_MEMBERS;
    var params = { headers: { 'Authorization': 'Bearer ' + _GW2_GUILD_API_KEY } };

    var response = UrlFetchApp.fetch(apiUrl, params);
    return JSON.parse(response.getContentText());
}

function fetchAccount_(ApiKey) {
    var apiUrl = _GW2_ACCOUNT_API_BASE_URL;
    var params = { headers: { 'Authorization': 'Bearer ' + ApiKey } };

    var response = UrlFetchApp.fetch(apiUrl, params);
    return JSON.parse(response.getContentText());
}

function fetchGuidFund_(guildGuid) {
    var apiUrl = _GW2_GUILD_API_BASE_URL + guildGuid + _GW2_GUILD_API_STASH;
    var params = { headers: { 'Authorization': 'Bearer ' + _GW2_GUILD_API_KEY } };

    var response = UrlFetchApp.fetch(apiUrl, params);
    return JSON.parse(response.getContentText());
}

function fetchGuildLog_(guildGuid) {
    var apiUrl = _GW2_GUILD_API_BASE_URL + guildGuid + _GW2_GUILD_API_LOG;
    var params = { headers: { 'Authorization': 'Bearer ' + _GW2_GUILD_API_KEY } };

    var response = UrlFetchApp.fetch(apiUrl, params);
    return JSON.parse(response.getContentText());
}