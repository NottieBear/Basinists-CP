Ext.define('Basinists.CP.view.GW2APIKey', {
    extend: 'Ext.panel.Panel',
    xtype: 'gw2-api-key-view',

    bodyCls: 'main-background',
    layout: { type: 'vbox', align: 'center', pack: 'start' },
    bodyPadding: '260 0 0 0',

    items: [{
        xtype: 'form',
        itemId: 'bcp-api-key-form',
        title: 'Manage API Key',
        frame: true,
        width: 600,
        bodyPadding: '0 20 10 20',

        items: [{
            xtype: 'component',
            html: '<p>You can add your API key by going to <a href="https://account.arena.net/applications" target="_blank">https://account.arena.net/applications</a>, generating a new key with \'account\' permissions and copy/pasting it into this form.</p>'
        }, {
            xtype: 'textfield',
            itemId: 'bcp-api-key',
            name: 'gw2ApiKey',
            msgTarget: 'under',
            width: '100%',
            allowBlank: false,
            emptyCls: 'api-key-empty-text',
            emptyText: 'Enter your API key'
        }, {
            xtype: 'container',
            layout: { type: 'hbox', pack: 'center' },
            margin: '10 0 0 0',

            items: [{
                xtype: 'button',
                itemId: 'bcp-key-save',
                text: 'Save',
                scale: 'medium'
            }]
        }]
    }],

    initComponent: function () {
        this.callParent();
        this.queryById('bcp-key-save').setHandler(this.saveApiKey, this);
    },

    saveApiKey: function () {
        if (this.queryById('bcp-api-key-form').getForm().isValid()) {
            this.mask('Saving API Key...');

            var params = {};
            params[Basinists.CP.CONST.UrlParam.FirebaseUserId] = Basinists.CP.SignedInUser.firebaseUserId;
            params[Basinists.CP.CONST.UrlParam.GW2ApiKey] = this.queryById('bcp-api-key').getValue();

            Ext.data.JsonP.request({
                url: createActionUrl(Basinists.CP.CONST.UrlAction.SaveGW2ApiKey),
                params: params,
                success: function (jsonData) {
                    if (jsonData.success) {
                        Basinists.CP.SignedInUser.setUserInfo(jsonData.returnValue);

                        Ext.getCmp('bcp-topbar').setContentMode();
                        Basinists.CP.app.getApplication().getMainView().changeView('content-view');
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
    }
})