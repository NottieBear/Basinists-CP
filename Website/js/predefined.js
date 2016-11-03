Ext.ns('Basinists.CP.CONST');
//Basinists.CP.CONST.GAS_URL = 'https://script.google.com/macros/s/AKfycbzf8eGqADuAr01Jnlx-ds5KFGcv9_4AiecpYhxkIhMP4abmKYXW/exec';  // Dev Url
Basinists.CP.CONST.GAS_URL = 'https://script.google.com/macros/s/AKfycbxyDcX9bvwxFxr9QyQFQiwffGDavxhPLUqQQDi-0RNpUqDjp3c6/exec';  // Live Url
Basinists.CP.CONST.AB_GUILD_GUID = 'aae207d8-ddfe-e511-80d4-e4115beba648';
Basinists.CP.CONST.EB_GUILD_GUID = 'd39dc975-9571-e611-80d4-e4115beba648';

Ext.ns('Basinists.CP.CONST.UrlAction');
Basinists.CP.CONST.UrlAction.GetSignedInUserInfo = 'get_signed_in_user_info';
Basinists.CP.CONST.UrlAction.SaveGW2ApiKey = 'save_gw2_api_key';
Basinists.CP.CONST.UrlAction.GetGuildRosterMembers = 'get_guild_roster_members';
Basinists.CP.CONST.UrlAction.SaveGuildRosterMemberInfo = 'save_guild_roster_member_info';
Basinists.CP.CONST.UrlAction.GetGuildFunds = 'get_guild_funds';
Basinists.CP.CONST.UrlAction.GetMemberOnlines = 'get_member_onlines';
Basinists.CP.CONST.UrlAction.SaveMemberOnline = 'save_member_online';
Basinists.CP.CONST.UrlAction.RemoveMemberOnline = 'remove_member_online';
Basinists.CP.CONST.UrlAction.GetOctovineSquads = 'get_octovine_squads';
Basinists.CP.CONST.UrlAction.AddOctovineSquad = 'add_octovine_squad';
Basinists.CP.CONST.UrlAction.SaveOctovineSquad = 'save_octovine_squad';
Basinists.CP.CONST.UrlAction.RemoveOctovineSquad = 'remove_octovine_squad';
Basinists.CP.CONST.UrlAction.GetOverallOctovineSquadLeaderboard = 'get_overall_octovine_squad_leaderboard';
Basinists.CP.CONST.UrlAction.GetDateRangeOctovineSquadLeaderboard = 'get_date_range_octovine_squad_leaderboard';
Basinists.CP.CONST.UrlAction.GetEnums = 'get_enums';
Basinists.CP.CONST.UrlAction.SaveOctovineSquadAndMemberOnlineInfo = 'save_octovine_squad_and_member_online_info';

Ext.ns('Basinists.CP.CONST.UrlParam');
Basinists.CP.CONST.UrlParam.Id = 'id';
Basinists.CP.CONST.UrlParam.UpdateCount = 'update_count';
Basinists.CP.CONST.UrlParam.FirebaseUserId = 'firebase_user_id';
Basinists.CP.CONST.UrlParam.GW2ApiKey = 'gw2_api_key';
Basinists.CP.CONST.UrlParam.Alias = 'alias';
Basinists.CP.CONST.UrlParam.Note = 'note';
Basinists.CP.CONST.UrlParam.FromTimestamp = 'from_timestamp';
Basinists.CP.CONST.UrlParam.ToTimestamp = 'to_timestamp';
Basinists.CP.CONST.UrlParam.Timestamp = 'timestamp';
Basinists.CP.CONST.UrlParam.ABOnline = 'ab_online';
Basinists.CP.CONST.UrlParam.EBOnline = 'eb_online';
Basinists.CP.CONST.UrlParam.Commander = 'commander';
Basinists.CP.CONST.UrlParam.InvitationStatus = 'invitation_status';
Basinists.CP.CONST.UrlParam.ParticipationStatus = 'participation_status';
Basinists.CP.CONST.UrlParam.Comment = 'comment';
Basinists.CP.CONST.UrlParam.EnumType = 'enum_type';

Ext.ns('Basinists.CP.ICON');
Basinists.CP.ICON.DASHBOARD = 'xf0e4@FontAwesome';
Basinists.CP.ICON.REFRESH = 'xf079@FontAwesome';
Basinists.CP.ICON.ADD = 'xf0fe@FontAwesome';
Basinists.CP.ICON.EDIT = 'xf044@FontAwesome';
Basinists.CP.ICON.REMOVE = 'xf146@FontAwesome';
Basinists.CP.ICON.SEARCH = 'xf002@FontAwesome';
Basinists.CP.ICON.NAVLEFT = 'xf100@FontAwesome';
Basinists.CP.ICON.NAVRIGHT = 'xf101@FontAwesome';
Basinists.CP.ICON.DELETEACCOUNT = 'xf014@FontAwesome';

Ext.define('Basinists.CP.model.Pair', {
    extend: 'Ext.data.Model',

    fields: [
      { name: 'name', type: 'string' },
      { name: 'value', type: 'int' }
    ]
});

Ext.define('Basinists.CP.SignedInUser', {
    singleton: true,

    firebaseUserId: null,
    name: null,
    rankName: null,
    rankOrder: null,
    gw2ApiKeyExist: null,

    isSignedIn: function () {
        return this.firebaseUserId !== null;
    },

    handleSignedIn: function (user) {
        this.firebaseUserId = user.uid;
    },

    handleSignedOut: function () {
        this.firebaseUserId = null;
    },

    setUserInfo: function (userInfo) {
        this.name = userInfo.name;
        this.rankName = userInfo.rankName;
        this.rankOrder = userInfo.rankOrder;
        this.gw2ApiKeyExist = userInfo.gw2ApiKeyExist;
    }
});

Ext.define('Basinists.CP.UserPermission', {
    singleton: true,

    isAccessGranted: function (requiredRankOrder) {
        return !requiredRankOrder || Basinists.CP.SignedInUser.rankOrder <= requiredRankOrder;
    }
});

Ext.define('Basinists.CP.Firebase', {
    singleton: true,

    authConfig: {
        apiKey: "AIzaSyAULIuXs-MgK0pahR0rd0lxoF1MFv5Tk_o",
        authDomain: "auricbasinists-cp.firebaseapp.com",
        databaseURL: "https://auricbasinists-cp.firebaseio.com",
        storageBucket: "auricbasinists-cp.appspot.com",
        messagingSenderId: "118749934597"
    },

    uiConfig: {
        'signInFlow': 'popup',
        'signInOptions': [firebase.auth.GoogleAuthProvider.PROVIDER_ID],

        'callbacks': {
            'signInSuccess': function (user, credential, redirectUrl) {
                return false;
            }
        },
    },

    authUi: null
});