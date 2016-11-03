Ext.define('Basinists.CP.view.EditOctovineSquad', {
    extend: 'Ext.grid.Panel',
    xtype: 'edit-octovine-squad-view',

    firstLoadCalled: false,

    stateId: 'Basinists.CP.view.EditOctovineSquad.State',
    stateful: true,
    emptyText: 'No squad record(s).',

    viewConfig: { cls: 'content-grid-view', enableTextSelection: true },

    store: Ext.create('Ext.data.ArrayStore', {
        fields: ['id', 'update_count', 'timestamp', 'commander', 'invitation_status', 'participation_status', 'comment'],
        sorters: [{ property: 'timestamp', direction: 'DESC' }],
        data: []
    }),

    rowEditingPlugin: Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 2,

        listeners: [{
            edit: function (editor, context, eOpts) {
                context.grid.saveSquad(context.record);
            }
        }]
    }),

    inviteStatusEditor: Ext.create('Ext.form.ComboBox', {
        queryMode: 'local',
        displayField: 'name',
        valueField: 'value',
        fieldStyle: 'text-align:center;',
        editable: false,
        allowBlank: false
    }),

    participateStatusEditor: Ext.create('Ext.form.ComboBox', {
        queryMode: 'local',
        displayField: 'name',
        valueField: 'value',
        fieldStyle: 'text-align:center;',
        matchFieldWidth: false,
        allowBlank: false,
        editable: false
    }),

    initComponent: function () {
        this.createColumns();
        this.callParent();
        this.createToolbar();

        this.plugins = [this.rowEditingPlugin];
        this.inviteStatusEditor.bindStore(Ext.getStore('inviteStatusStore'));
        this.participateStatusEditor.bindStore(Ext.getStore('participationStatusStore'));
    },

    createColumns: function () {
        this.columns = [
          { xtype: 'actioncolumn', width: 40, align: 'center', resizable: false, menuDisabled: true, editRenderer: blankEditRenderer, items: [{ iconCls: 'remove-icon', tooltip: 'Remove squad record', scope: this, handler: this.onRemoveSquadClick }] },
          { xtype: 'rownumberer', width: 50 },
          { text: 'Time', dataIndex: 'timestamp', width: 180, cls: 'content-grid-header-bold', align: 'center', renderer: timestampCellRenderer, editRenderer: timestampCellRenderer },
          { text: 'Commander', dataIndex: 'commander', width: 200, cls: 'content-grid-header-bold', cellWrap: true, editor: { xtype: 'textfield' } },
          { text: 'Status of Invitation', dataIndex: 'invitation_status', width: 180, cls: 'content-grid-header-bold', align: 'center', renderer: this.inviteStatusRenderer, editor: this.inviteStatusEditor },
          { text: 'Number of Participant', dataIndex: 'participation_status', width: 280, cls: 'content-grid-header-bold', align: 'center', renderer: this.participateRenderer, editor: this.participateStatusEditor },
          { text: 'Comment', dataIndex: 'comment', minWidth: 300, flex: 1, cls: 'content-grid-header-bold', cellWrap: true, renderer: multilineCellRenderer, editor: { xtype: 'textareafield' } }
        ];
    },

    createToolbar: function () {
        this.addDocked({
            xtype: 'toolbar',
            dock: 'top',

            items: ['->', {
                xtype: 'label',
                text: 'Search record(s) for month:',
                margin: '0 8 0 0'
            }, {
                xtype: 'ux.monthpicker',
                itemId: 'bcp-edit-squad-monthpicker'
            }, {
                glyph: Basinists.CP.ICON.SEARCH,
                scale: 'medium',
                scope: this,

                handler: function () {
                    this.searchSquad();
                }
            }, '->']
        });
    },

    firstLoad: function () {
        if (!this.firstLoadCalled) {
            this.searchSquad();

            this.firstLoadCalled = true;
        }
    },

    searchSquad: function () {
        this.mask('Loading...');

        var params = {};

        var selMoment = this.queryById('bcp-edit-squad-monthpicker').getMomentObject();
        params[Basinists.CP.CONST.UrlParam.FromTimestamp] = selMoment.clone().startOf('month').valueOf();
        params[Basinists.CP.CONST.UrlParam.ToTimestamp] = selMoment.clone().endOf('month').valueOf();

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.GetOctovineSquads),
            params: params,
            success: function (jsonData) {
                if (jsonData.success) {
                    this.getStore().loadData(jsonData.returnValue);
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
    },

    saveSquad: function (record) {
        this.mask('Saving...');

        var params = {};
        params[Basinists.CP.CONST.UrlParam.Id] = record.data['id'];
        params[Basinists.CP.CONST.UrlParam.UpdateCount] = record.data['update_count'];
        params[Basinists.CP.CONST.UrlParam.Timestamp] = record.data['timestamp'];
        params[Basinists.CP.CONST.UrlParam.Commander] = record.data['commander'];
        params[Basinists.CP.CONST.UrlParam.InvitationStatus] = record.data['invitation_status'];
        params[Basinists.CP.CONST.UrlParam.ParticipationStatus] = record.data['participation_status'];
        params[Basinists.CP.CONST.UrlParam.Comment] = record.data['comment'];

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.SaveOctovineSquad),
            params: params,
            success: function (jsonData) {
                if (jsonData.success) {
                    record.set('update_count', jsonData.returnValue.update_count);
                    record.set('timestamp', jsonData.returnValue.timestamp);
                    record.set('commander', jsonData.returnValue.commander);
                    record.set('invitation_status', jsonData.returnValue.invitation_status);
                    record.set('participation_status', jsonData.returnValue.participation_status);
                    record.set('comment', jsonData.returnValue.comment);

                    record.commit();
                }
                else {
                    record.reject();
                    showErrorMsgbox(jsonData.msg, jsonData.exception);
                }
            },
            failure: function (errorType) {
                record.reject();
                showErrorMsgbox(errorType);
            },
            callback: function (success, jsonData, errorType) {
                this.unmask();
            },
            scope: this
        });
    },

    removeSquad: function (record) {
        this.mask('Removing...');

        var params = {};
        params[Basinists.CP.CONST.UrlParam.Id] = record.data['id'];

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.RemoveOctovineSquad),
            params: params,
            success: function (jsonData) {
                if (jsonData.success) {
                    this.getStore().remove(record);
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
    },

    onRemoveSquadClick: function (grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        Ext.Msg.confirm('Confirmation', 'Are you sure you want to remove this squad record ?', function (btn) {
            if (btn === 'yes') {
                this.removeSquad(rec);
            }
        }, this);
    },

    inviteStatusRenderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
        var rec = Ext.getStore('inviteStatusStore').findRecord('value', value);
        return rec ? rec.data.name : '';
    },

    participateRenderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
        var rec = Ext.getStore('participationStatusStore').findRecord('value', value);
        return rec ? rec.data.name : '';
    }
});