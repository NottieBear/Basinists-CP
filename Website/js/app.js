Ext.ariaWarn = Ext.emptyFn;
Ext.tip.QuickTipManager.init();

Ext.application({
    name: 'Basinists.CP',
    mainView: 'Basinists.CP.view.Main',

    init: function () {
        this.createEnumStore('inviteStatusStore');
        this.createEnumStore('participationStatusStore');
    },

    launch: function () {
        Ext.getBody().mask('Setting up Basinists Command Post...');

        var promiseInviteStatus = this.internalLoadEnum('inviteStatusStore', 'InviteStatus', 'Fail to load invite status info');
        var promiseParticipationStatus = this.internalLoadEnum('participationStatusStore', 'ParticipationStatus', 'Fail to participation status info');

        Ext.Deferred.all([promiseInviteStatus, promiseParticipationStatus])
            .then(function (statusObj) {
                firebase.initializeApp(Basinists.CP.Firebase.authConfig);
                Basinists.CP.Firebase.authUi = new firebaseui.auth.AuthUI(firebase.auth());
                firebase.auth().onAuthStateChanged(firebaseAuthStateChanged);
            })
            .otherwise(function (statusObj) {
                showErrorMsgbox(statusObj.msg);
            })
            .always(function () {
                Ext.getBody().unmask();
            });
    },

    createEnumStore: function (storeId) {
        Ext.create('Ext.data.ArrayStore', {
            storeId: storeId,
            model: 'Basinists.CP.model.Pair',
            sorters: [{ property: 'value', direction: 'ASC' }],
            data: []
        });
    },

    internalLoadEnum: function (storeId, enumType, failMsg) {
        var deferred = new Ext.Deferred();

        var params={};
        params[Basinists.CP.CONST.UrlParam.EnumType] = enumType;

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.GetEnums),
            params: params,
            success: function (jsonData) {
                if (jsonData.success) {
                    Ext.getStore(storeId).loadData(jsonData.returnValue);
                    deferred.resolve({ success: true, msg: '' })
                }
                else {
                    deferred.reject({ success: false, msg: jsonData.msg + '.  ' + jsonData.exception.message });
                }
            },
            failure: function (errorType) {
                deferred.reject({ success: false, msg: errorType });
            },
            scope: this
        });

        return deferred.promise;
    }
});

function firebaseAuthStateChanged(user) {
    if (user && user.uid == Basinists.CP.SignedInUser.firebaseUserId) {
        return;
    }

    var mainView = Basinists.CP.app.getApplication().getMainView();
    if (user) {
        Basinists.CP.SignedInUser.handleSignedIn(user);
        mainView.handleSignedIn();
    }
    else {
        Basinists.CP.SignedInUser.handleSignedOut();
        mainView.handleSignedOut();
    }
}