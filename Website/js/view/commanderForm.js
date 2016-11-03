Ext.define('Basinists.CP.view.CommanderForm', {
    extend: 'Ext.panel.Panel',
    xtype: 'commander-form-view',
  
    scrollable:true,
    bodyPadding: 10,
    layout: { type: 'hbox', pack: 'center' },

    items: [{
        xtype: 'form',
        itemId: 'bcp-form',
    
        fieldDefaults: {
            labelWidth: 150,
            width: 440,
            msgTarget: 'side'
        },
  
        items: [{
            xtype: 'fieldset',
            title: 'Octovine Time',
    
            items: [
              { fieldLabel: 'Server Date', xtype: 'datefield', itemId: 'bcp-form-server-date', format: 'd F Y', showToday: false, allowBlank: false },
              { fieldLabel: 'Server Time', xtype: 'timefield', itemId: 'bcp-form-server-time', format: 'h:i A', allowBlank: false }
            ]
        }, {
            xtype: 'fieldset',
            title: 'No. of Online Member(s)',

            items: [
              { fieldLabel: 'Auric Basinists [AB]', xtype: 'numberfield', itemId: 'bcp-form-ab-online', minValue: 0, maxValue: 500, value: 0 },
              { fieldLabel: 'Exalted Basinists [EB]', xtype: 'numberfield', itemId: 'bcp-form-eb-online', minValue: 0, maxValue: 500, value: 0 },
            ]
        }, {
            xtype: 'fieldset',
            title: 'Squad Info',
          
            items: [
              { fieldLabel: 'Commander', xtype: 'textfield', itemId: 'bcp-form-commander',allowBlank: false  },
              { fieldLabel: 'Status of Invitation', xtype: 'radiogroup', columns: 1, itemId: 'bcp-form-invite-status', items: [] },
              { fieldLabel: 'Number of Participant', xtype: 'radiogroup', columns: 1, itemId: 'bcp-form-participation-status', items: [] },
              { fieldLabel: 'Comment', xtype: 'textareafield', itemId: 'bcp-form-comment' }
            ]
        }]
    }],
  
    initComponent: function() {
        this.callParent();
        this.createBottombar();
    
        this.initTimeFieldStore();
        this.initEnumRadioGroup('bcp-form-invite-status', 'inviteStatusStore', 'rdgrpInvite', 1);
        this.initEnumRadioGroup('bcp-form-participation-status', 'participationStatusStore', 'rdgrpParticipate', 2);
    
        var dateToday = new Date();
        this.queryById('bcp-form-server-date').setValue(new Date(dateToday.getUTCFullYear(), dateToday.getUTCMonth(), dateToday.getUTCDate(), 0, 0, 0, 0));
        this.queryById('bcp-form-commander').setValue(Basinists.CP.SignedInUser.name);
    },
  
    createBottombar: function() {
        this.queryById('bcp-form').addDocked({
            xtype: 'toolbar',
            dock: 'bottom',
            
            items: ['->', {
                xtype: 'button',
                text: 'Save',
                scale: 'medium',
                scope: this,
          
                handler: function() {
                    this.submitForm();
                }
            }]
        });
    },
  
    initTimeFieldStore: function() {
        this.queryById('bcp-form-server-time').setStore(Ext.create('Ext.data.Store', { model: Ext.picker.Time.prototype.modelType, data: getOctovineTimes() }));
        this.selectNearestOctovineServerTime();
    },
  
    initEnumRadioGroup: function(rbgrpId, storeId, rbgrpName, checkedRatioValue) {
        var store = Ext.getStore(storeId);
        store.each(function(record, id, len) {
            this.add({ boxLabel: record.data.name, name: rbgrpName, inputValue: record.data.value });
        }, this.queryById(rbgrpId));
    
        var ratioValueObj = { };
        ratioValueObj[rbgrpName] = checkedRatioValue;
        this.queryById(rbgrpId).setValue(ratioValueObj);
    },
  
    selectNearestOctovineServerTime: function() {
        var momentNowUtc = moment().utc();
    
        var isEvenHour = momentNowUtc.hour() % 2 == 0;
        if(isEvenHour) {
            if(momentNowUtc.minute() > 30) {
                momentNowUtc.add(1, 'h');
            }
            else {
                momentNowUtc.subtract(1, 'h');
            }
        }
    
        this.queryById('bcp-form-server-time').setValue(momentNowUtc.hour());
    },
  
    submitForm: function() {
        this.mask('Saving...');
    
        var dateServer = this.queryById('bcp-form-server-date').getValue();
        var timeServer = this.queryById('bcp-form-server-time').getValue();
        var octovineUtc = moment.utc({ year: dateServer.getFullYear(), month: dateServer.getMonth(), date: dateServer.getDate(), hours: timeServer.getHours() });
        
        var params = {};
        params[Basinists.CP.CONST.UrlParam.Timestamp] = octovineUtc.valueOf();
        params[Basinists.CP.CONST.UrlParam.Commander] = this.queryById('bcp-form-commander').getValue();
        params[Basinists.CP.CONST.UrlParam.InvitationStatus] = this.queryById('bcp-form-invite-status').getValue().rdgrpInvite;
        params[Basinists.CP.CONST.UrlParam.ParticipationStatus] = this.queryById('bcp-form-participation-status').getValue().rdgrpParticipate;
        params[Basinists.CP.CONST.UrlParam.Comment] = this.queryById('bcp-form-comment').getValue();

        params[Basinists.CP.CONST.UrlParam.ABOnline] = this.queryById('bcp-form-ab-online').getValue();
        params[Basinists.CP.CONST.UrlParam.EBOnline] = this.queryById('bcp-form-eb-online').getValue();

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.SaveOctovineSquadAndMemberOnlineInfo),
            params: params,
            success: function (jsonData) {
                if (jsonData.success) {
                    showInfoMsgbox('Squad info is saved successfully.');
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
});