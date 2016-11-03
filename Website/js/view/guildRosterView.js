Ext.define('Basinists.CP.view.GuildRoster', {
    extend: 'Ext.grid.Panel',
    xtype: 'guild-roster-view',

    firstLoadCalled: false,

    stateId: 'Basinists.CP.view.GuildRoster.State',
    stateful: true,
    emptyText: 'No member record(s).',

    viewConfig: { cls: 'content-grid-view', enableTextSelection: true },

    rowEditingPlugin: Ext.create('Ext.grid.plugin.RowEditing', {
        clicksToEdit: 2,

        listeners: [{
            edit: function (editor, context, eOpts) {
                context.grid.saveMemberInfo(context.record);
            }
        }]
    }),

    initComponent: function () {
        this.plugins = ['gridfilters', this.rowEditingPlugin];
        this.createStore();
        this.createColumns();
        this.callParent();
        this.createToolbar();
    },

    createStore: function () {
        this.store = Ext.create('Ext.data.ArrayStore', {
            fields: ['id', 'update_count', 'name', 'alias', 'merge_rank_name', 'merge_rank_order', 'ab_rank', 'eb_rank', 'ab_rank_order', 'eb_rank_order', 'ab_join_timestamp', 'eb_join_timestamp', 'note'],
            sorters: [{ property: 'merge_rank_order', direction: 'ASC' }],
            data: []
        });
    },

    createColumns: function () {
        this.columns = [
          { xtype: 'rownumberer', width: 50, align: 'center' },
          { text: 'Name', dataIndex: 'name', width: 180, cls: 'content-grid-header-bold', filter: { type: 'string', itemDefaults: { emptyText: 'Search name ...' } } },
          { text: 'Alias', dataIndex: 'alias', width: 180, cls: 'content-grid-header-bold', editor: { xtype: 'textfield' }, filter: { type: 'string', itemDefaults: { emptyText: 'Search alias ...' } } },
          { text: 'Rank', dataIndex: 'merge_rank_name', width: 150, cls: 'content-grid-header-bold', align: 'center', sorter: this.mergeRankSorter, filter: 'list', editRenderer: centerEditRenderer },
          { text: '[AB] Rank', dataIndex: 'ab_rank', width: 150, cls: 'content-grid-header-bold', align: 'center', sorter: this.abRankSorter, filter: 'list', editRenderer: centerEditRenderer },
          { text: '[EB] Rank', dataIndex: 'eb_rank', width: 150, cls: 'content-grid-header-bold', align: 'center', sorter: this.ebRankSorter, filter: 'list', editRenderer: centerEditRenderer },
          { text: 'Joined [AB] On', dataIndex: 'ab_join_timestamp', width: 180, cls: 'content-grid-header-bold', align: 'center', renderer: timestampCellRenderer, editRenderer: centerTimestampEditRenderer },
          { text: 'Joined [EB] On', dataIndex: 'eb_join_timestamp', width: 180, cls: 'content-grid-header-bold', align: 'center', renderer: timestampCellRenderer, editRenderer: centerTimestampEditRenderer },
          { text: 'Note', dataIndex: 'note', minWidth: 300, flex: 1, cls: 'content-grid-header-bold', cellWrap: true, renderer: multilineCellRenderer, editor: { xtype: 'textareafield' }, filter: { type: 'string', itemDefaults: { emptyText: 'Search note ...' } } }
        ];
    },

    createToolbar: function () {
        this.addDocked({
            xtype: 'toolbar',
            dock: 'top',

            items: ['->', {
                tooltip: 'Refresh guild roster',
                glyph: Basinists.CP.ICON.REFRESH,
                scope: this,

                handler: function () {
                    this.loadGuildRoster();
                }
            }]
        });
    },

    firstLoad: function () {
        if (!this.firstLoadCalled) {
            this.loadGuildRoster();

            this.firstLoadCalled = true;
        }
    },

    loadGuildRoster: function () {
        this.mask('Loading...');

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.GetGuildRosterMembers),
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

    mergeRankSorter: function (rankA, rankB) {
        return rankA.data.merge_rank_order - rankB.data.merge_rank_order;
    },

    abRankSorter: function (rankA, rankB) {
        return rankA.data.ab_rank_order - rankB.data.ab_rank_order;
    },

    ebRankSorter: function (rankA, rankB) {
        return rankA.data.eb_rank_order - rankB.data.eb_rank_order;
    },

    saveMemberInfo: function (record) {
        this.mask('Saving...');

        var params = {};
        params[Basinists.CP.CONST.UrlParam.Id] = record.data['id'];
        params[Basinists.CP.CONST.UrlParam.UpdateCount] = record.data['update_count'];
        params[Basinists.CP.CONST.UrlParam.Alias] = record.data['alias'];
        params[Basinists.CP.CONST.UrlParam.Note] = record.data['note'];

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.SaveGuildRosterMemberInfo),
            params: params,
            success: function (jsonData) {
                if (jsonData.success) {
                    record.set('update_count', jsonData.returnValue.update_count);
                    record.set('name', jsonData.returnValue.name);
                    record.set('alias', jsonData.returnValue.alias);
                    record.set('merge_rank_name', jsonData.returnValue.merge_rank_name);
                    record.set('merge_rank_order', jsonData.returnValue.merge_rank_order);
                    record.set('ab_rank', jsonData.returnValue.ab_rank);
                    record.set('eb_rank', jsonData.returnValue.eb_rank);
                    record.set('ab_rank_order', jsonData.returnValue.ab_rank_order);
                    record.set('eb_rank_order', jsonData.returnValue.eb_rank_order);
                    record.set('ab_join_timestamp', jsonData.returnValue.ab_join_timestamp);
                    record.set('eb_join_timestamp', jsonData.returnValue.eb_join_timestamp);
                    record.set('note', jsonData.returnValue.note);

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

        /*var member = { id: rec.data['id'], update_count: rec.data['update_count'], alias: rec.data['alias'], email: rec.data['email'], skype_council_group: rec.data['skype_council_group'], note: rec.data['note'] };
    
        google.script.run
          .withSuccessHandler( function(returnObj, userObj) {
              if(returnObj.status) {
                  userObj.record.set('update_count', returnObj.member.update_count);
                  userObj.record.commit();
                  userObj.guildRosterGrid.unmask();
              }
              else {
                  userObj.record.reject();
                  userObj.guildRosterGrid.unmask();
                  showErrorMsgbox(returnObj.msg);
              }
          })
          .withFailureHandler( function(msg, userObj) {
              userObj.record.reject();
              userObj.guildRosterGrid.unmask();
              showErrorMsgbox(msg);
          })
          .withUserObject({ guildRosterGrid: this, record: rec })
          .updateGuildMember(member);*/
    }
});