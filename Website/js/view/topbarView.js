Ext.define('Basinists.CP.view.Topbar', {
    extend: 'Ext.container.Container',
    xtype: 'topbar-view',

    cls: 'topbar',
    layout: 'column',

    items: [{
        xtype: 'container',
        columnWidth: 0.43,
        height: 64,
        layout: { type: 'hbox', align: 'middle', pack: 'start' },

        items: [{
            xtype: 'component',
            cls: 'topbar-header-logo',
            html: '<div class="topbar-logo">&nbsp</div>',
        }, {
            xtype: 'component',
            cls: 'topbar-header-title',
            html: '<div>Basinists Command Post</div>',
        }, {
            xtype: 'component',
            cls: 'topbar-header-version',
            html: '<div>Beta 2.0</div>',
        }]
    }, {
        xtype: 'container',
        columnWidth: 0.14,
        height: 64,
        layout: { type: 'vbox', align: 'middle', pack: 'center' },

        items: [
          { xtype: 'component', itemId: 'bcp-topbar-daydate', cls: 'topbar-time', autoEl: { tag: 'div' } },
          {
              xtype: 'container', style: 'display: inline-block;',
              layout: { type: 'hbox', align: 'middle', pack: 'center' },
              items: [{
                  xtype: 'component', itemId: 'bcp-topbar-time', cls: 'topbar-time', autoEl: { tag: 'div' }
              }, {
                  xtype: 'component', cls: 'topbar-timezone', autoEl: { tag: 'div', html: '&nbsp;&nbsp;UTC' }
              }]
          }
        ]
    }, {
        xtype: 'container',
        columnWidth: 0.43,
        height: 64,
        layout: { type: 'hbox', align: 'middle', pack: 'end' },

        items: [{
            xtype: 'label', cls: 'topbar-text', text: 'Welcome !'
        }, {
            xtype: 'label', itemId: 'bcp-topbar-username', style: { margin: '0px 16px 0px 8px' }, cls: 'topbar-text', text: 'Guest'
        }, {
            xtype: 'button', itemId: 'bcp-topbar-gw2-api-key', style: { marginRight: '8px' }, iconCls: 'key-icon', tooltip: 'Change GW2 API Key', scale: 'medium', disabled: true
        }, {
            xtype: 'button', itemId: 'bcp-topbar-delete-account', style: { marginRight: '8px' }, iconCls: 'delete-icon', tooltip: 'Delete account', scale: 'medium', disabled: true
        }, {
            xtype: 'button', itemId: 'bcp-topbar-sign-out', text: 'Sign Out', scale: 'medium', disabled: true
        }]
    }],

    initComponent: function () {
        this.callParent();

        this.queryById('bcp-topbar-gw2-api-key').setHandler(this.changeApiKey, this);
        this.queryById('bcp-topbar-delete-account').setHandler(this.deleteCurrentFirebaseUser, this);
        this.queryById('bcp-topbar-sign-out').setHandler(this.signOut, this);
        this.startUtcClock();
    },

    startUtcClock: function () {
        var runnerClock = new Ext.util.TaskRunner();
        runnerClock.start({
            run: function () {
                var momentUtc = moment().utc();
                this.queryById('bcp-topbar-time').update(momentUtc.format('h:mm:ss A'));
                this.queryById('bcp-topbar-daydate').update(momentUtc.format('dddd, DD MMMM YYYY'));
            },
            interval: 1000,
            scope: this
        });
    },

    signOut: function () {
        firebase.auth().signOut();
    },

    deleteCurrentFirebaseUser: function () {
        Ext.Msg.confirm('Confirmation', 'Are you sure you want to delete your account ?', function (btn) {
            if (btn === 'yes') {
                firebase.auth().currentUser.delete().then(function () {
                }, function (error) {
                    showExceptionMsgbox('', error);
                });
            }
        }, this);
    },

    changeApiKey: function(){
        this.setManageApiKeyMode();
        Basinists.CP.app.getApplication().getMainView().changeView('gw2-api-key-view');
    },

    setManageApiKeyMode: function () {
        this.queryById('bcp-topbar-delete-account').setDisabled(false);
        this.queryById('bcp-topbar-gw2-api-key').setDisabled(true);
        this.queryById('bcp-topbar-sign-out').setDisabled(false);
    },

    setContentMode: function () {
        this.queryById('bcp-topbar-delete-account').setDisabled(false);
        this.queryById('bcp-topbar-gw2-api-key').setDisabled(false);
        this.queryById('bcp-topbar-sign-out').setDisabled(false);
        this.queryById('bcp-topbar-username').update(Basinists.CP.SignedInUser.rankName + ' ' + Basinists.CP.SignedInUser.name);
    },

    setSignedOutMode: function () {
        this.queryById('bcp-topbar-sign-out').setDisabled(true);
        this.queryById('bcp-topbar-delete-account').setDisabled(true);
        this.queryById('bcp-topbar-gw2-api-key').setDisabled(true);
        this.queryById('bcp-topbar-username').update('Guest');
    }
});