Ext.define('Basinists.CP.view.Main', {
    extend: 'Ext.container.Container',

    layout: 'border',
    
    items: [{
        region: 'north',
        cls: 'main-north',

        items: [{
            xtype: 'topbar-view',
            id: 'bcp-topbar',
            itemId: 'bcp-topbar'
        }]
    }, {
        region: 'center',
        xtype: 'container',
        layout: 'fit',
        itemId: 'bcp-center-panel'
    }],

    handleSignedIn: function () {
        this.checkGW2APIKey();
    },

    handleSignedOut: function () {
        this.queryById('bcp-topbar').setSignedOutMode();
        this.changeView('login-view');
    },

    changeView: function (viewXType) {
        var centerView = Ext.create({ xtype: viewXType });

        var centerPanel = this.queryById('bcp-center-panel');
        centerPanel.removeAll(false);
        centerPanel.add(centerView);

        if (centerView.firstLoad) {
            centerView.firstLoad();
        }
    },

    checkGW2APIKey: function () {
        var params = {};
        params[Basinists.CP.CONST.UrlParam.FirebaseUserId] = Basinists.CP.SignedInUser.firebaseUserId;

        this.mask('Loading User Infornation...');
        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.GetSignedInUserInfo),
            params: params,
            success: function (jsonData) {
                if (jsonData.success) {
                    Basinists.CP.SignedInUser.setUserInfo(jsonData.returnValue);

                    if (Basinists.CP.SignedInUser.gw2ApiKeyExist) {
                        this.queryById('bcp-topbar').setContentMode();
                        this.changeView('content-view');
                    }
                    else {
                        this.queryById('bcp-topbar').setManageApiKeyMode();
                        this.changeView('gw2-api-key-view');
                    }
                }
                else {
                    showErrorMsgbox(jsonData.msg, jsonData.exception);
                }
            },
            failure: function (errorType) {
                showErrorMsgbox(errorType);
            },
            callback: function (success, jsonData, errorType) {
                this.unmask();
            },
            scope: this
        });
    }
})