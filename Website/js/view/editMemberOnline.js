Ext.define('Basinists.CP.view.EditMemberOnline', {
    extend: 'Ext.grid.Panel',
    xtype: 'edit-member-online-view',

    firstLoadCalled: false,

    stateId: 'Basinists.CP.view.EditMemberOnline.State',
    stateful: true,
    emptyText: 'No member online record(s).',

    viewConfig: { cls: 'content-grid-view', enableTextSelection: true },

    store: Ext.create('Ext.data.ArrayStore', {
        fields: ['id', 'update_count', 'timestamp', 'ab_online', 'eb_online'],
        sorters: [{ property: 'timestamp', direction: 'DESC' }],
        data: []
    }),

    rowEditingPlugin: Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 2,

        listeners: [{
            edit: function (editor, context, eOpts) {
                context.grid.saveMemberOnline(context.record);
            }
        }]
    }),

    initComponent: function () {
        this.createColumns();
        this.callParent();
        this.createToolbar();

        this.plugins = [this.rowEditingPlugin];
    },

    createColumns: function () {
        this.columns = [
          { flex: 1, menuDisabled: true },
          { xtype: 'actioncolumn', width: 40, align: 'center', resizable: false, menuDisabled: true, editRenderer: blankEditRenderer, items: [{ iconCls: 'remove-icon', tooltip: 'Remove member online record', scope: this, handler: this.onRemoveMemberOnlineClick }] },
          { xtype: 'rownumberer', width: 50 },
          { text: 'Time', dataIndex: 'timestamp', width: 180, cls: 'content-grid-header-bold', align: 'center', renderer: timestampCellRenderer, editRenderer: timestampCellRenderer },
          {
              text: 'No. of Online Member', cls: 'content-grid-header-bold', columns: [
                { text: 'Auric Basinists [AB]', dataIndex: 'ab_online', width: 200, cls: 'content-grid-header-bold', align: 'center', editor: { xtype: 'numberfield', minValue: 0, maxValue: 500 } },
                { text: 'Exalted Basinists [EB]', dataIndex: 'eb_online', width: 200, cls: 'content-grid-header-bold', align: 'center', editor: { xtype: 'numberfield', minValue: 0, maxValue: 500 } }]
          },
          { flex: 1, menuDisabled: true }
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
                scope: this,

                handler: function () {
                    this.searchMemberOnline();
                }
            }, '->']
        });
    },

    firstLoad: function () {
        if (!this.firstLoadCalled) {
            this.searchMemberOnline();

            this.firstLoadCalled = true;
        }
    },

    searchMemberOnline: function () {
        this.mask('Loading...');

        var params = {};

        var selMoment = this.queryById('bcp-edit-squad-monthpicker').getMomentObject();
        params[Basinists.CP.CONST.UrlParam.FromTimestamp] = selMoment.clone().startOf('month').valueOf();
        params[Basinists.CP.CONST.UrlParam.ToTimestamp] = selMoment.clone().endOf('month').valueOf();

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.GetMemberOnlines),
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

    saveMemberOnline: function (record) {
        this.mask('Saving...');

        var params = {};
        params[Basinists.CP.CONST.UrlParam.Id] = record.data['id'];
        params[Basinists.CP.CONST.UrlParam.UpdateCount] = record.data['update_count'];
        params[Basinists.CP.CONST.UrlParam.Timestamp] = record.data['timestamp'];
        params[Basinists.CP.CONST.UrlParam.ABOnline] = record.data['ab_online'];
        params[Basinists.CP.CONST.UrlParam.EBOnline] = record.data['eb_online'];

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.SaveMemberOnline),
            params: params,
            success: function (jsonData) {
                if (jsonData.success) {
                    record.set('update_count', jsonData.returnValue.update_count);
                    record.set('timestamp', jsonData.returnValue.timestamp);
                    record.set('ab_online', jsonData.returnValue.ab_online);
                    record.set('eb_online', jsonData.returnValue.eb_online);

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

    removeMemberOnline: function (record) {
        this.mask('Removing...');

        var params = {};
        params[Basinists.CP.CONST.UrlParam.Id] = record.data['id'];

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.RemoveMemberOnline),
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

    onRemoveMemberOnlineClick: function (grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        Ext.Msg.confirm('Confirmation', 'Are you sure you want to remove this member online record ?', function (btn) {
            if (btn === 'yes') {
                this.removeMemberOnline(rec);
            }
        }, this);
    }
});