Ext.define('Basinists.CP.view.DataRangeOctovineSquadLeaderboard', {
    extend: 'Ext.grid.Panel',
    xtype: 'date-range-octovine-squad-leaderboard-view',
  
    firstLoadCalled: false,
    cls: 'content-leaderboard-panel',
  
    stateId: 'Basinists.CP.view.DataRangeSquadLeaderboard.State',
    stateful: true,
  
    viewConfig: { cls: 'content-grid-view', enableTextSelection: true },
  
    store: Ext.create('Ext.data.ArrayStore', {
        fields: ['player', 'squad_count'],
        sorters: [{ property: 'squad_count', direction: 'DESC' }],
        data:[]
    }),
  
    bbar: ['->', {
        xtype: 'label',
        text: 'Total Squad: '
    }, {
        xtype: 'label',
        itemId: 'bcp-total-squad',
        text: '0'
    }],
  
    initComponent: function() {
        this.createColumns();
        this.callParent();
        this.createToolbar();
    
        var momentUtcNow = moment.utc();
        var momentUtcStartOfWeek = momentUtcNow.clone().startOf('week');
        var momentUtcEndOfWeek = momentUtcNow.clone().endOf('week');
    
        this.queryById('bcp-from-date').setValue(new Date(momentUtcStartOfWeek.year(), momentUtcStartOfWeek.month(), momentUtcStartOfWeek.date(),
          momentUtcStartOfWeek.hour(), momentUtcStartOfWeek.minute(), momentUtcStartOfWeek.second(), momentUtcStartOfWeek.millisecond()));
    
        this.queryById('bcp-to-date').setValue(new Date(momentUtcEndOfWeek.year(), momentUtcEndOfWeek.month(), momentUtcEndOfWeek.date(),
          momentUtcEndOfWeek.hour(), momentUtcEndOfWeek.minute(), momentUtcEndOfWeek.second(), momentUtcEndOfWeek.millisecond()));
    },
  
    createColumns: function() {
        this.columns = [
          { xtype: 'rownumberer', width: 50 },
          { text: 'Player', dataIndex:'player', flex: 0.5, cls: 'content-grid-header-bold', cellWrap: true },
          { text: 'No. of Leads', dataIndex:'squad_count', flex: 0.5, align: 'center', cls: 'content-grid-header-bold' }];
    },
    
    createToolbar: function() {
        this.addDocked({
            xtype: 'toolbar',
            dock: 'top',

            items: [ ' ', {
                xtype: 'tbtext',
                cls: 'content-title',
                text: 'From'
            }, {
                xtype: 'datefield',
                itemId: 'bcp-from-date',
                format: 'd F Y'
            }, {
                xtype: 'tbtext',
                cls: 'content-title',
                text: 'To'
            }, {
                xtype: 'datefield',
                itemId: 'bcp-to-date',
                format: 'd F Y'
            }, '->', {
                glyph: Basinists.CP.ICON.REFRESH,
                scope: this,
          
                handler: function() { this.loadDateRangeSquadLeaderboard(); }
            }, ' ']
        });
    },
  
    firstLoad: function() {
        if(!this.firstLoadCalled) {
            this.loadDateRangeSquadLeaderboard();
      
            this.firstLoadCalled = true;
        }
    },
  
    loadDateRangeSquadLeaderboard: function() {
        this.mask('Loading...');

        var from = this.queryById('bcp-from-date').getValue();
        var to = this.queryById('bcp-to-date').getValue();

        var params = {};
        params[Basinists.CP.CONST.UrlParam.FromTimestamp] = moment.utc({ year: from.getFullYear(), month: from.getMonth(), date: from.getDate() }).startOf('day').valueOf();
        params[Basinists.CP.CONST.UrlParam.ToTimestamp] = moment.utc({ year: to.getFullYear(), month: to.getMonth(), date: to.getDate() }).endOf('day').valueOf();

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.GetDateRangeOctovineSquadLeaderboard),
            params: params,
            success: function (jsonData) {
                if (jsonData.success) {
                    this.queryById('bcp-total-squad').setText(jsonData.returnValue.total);
                    this.getStore().loadData(jsonData.returnValue.rank);
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