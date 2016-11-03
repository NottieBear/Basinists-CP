Ext.define('Basinists.CP.view.Login', {
    extend: 'Ext.panel.Panel',
    xtype: 'login-view',

    bodyCls: 'main-background',
    layout: { type: 'vbox', align: 'center', pack: 'start' },
    bodyPadding: '120 0 0 0',

    items: [{
        xtype: 'image',
        src: 'images/login/welcome.png',
        width: 489,
        height: 213
    }, {
        xtype: 'image',
        src: 'images/login/app_name.png',
        width: 828,
        height: 144
    }, {
        xtype: 'component',
        html: '<div id="firebaseui-login-container"></div>',
        width: 236,
    }],

    initComponent: function () {
        this.callParent();

        this.on({
            render: function (pnl, eOpts) {
                Basinists.CP.Firebase.authUi.start('#firebaseui-login-container', Basinists.CP.Firebase.uiConfig);
            }
        });
    }
})