Ext.define('Basinists.CP.view.OverallOctovineSquadLeaderboard', {
    extend: 'Ext.grid.Panel',
    xtype: 'overall-octovine-squad-leaderboard-view',
  
    firstLoadCalled: false,
    cls: 'content-leaderboard-panel',
  
    stateId: 'Basinists.CP.view.OverallSquadLeaderboard.State',
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
                text: 'Overall'
            }, '->', {
                glyph: Basinists.CP.ICON.REFRESH,
                scope: this,
          
                handler: function() { this.loadOverallSquadLeaderboard(); }
            }, ' ']
        });
    },
  
    firstLoad: function() {
        if(!this.firstLoadCalled) {
            this.loadOverallSquadLeaderboard();
      
            this.firstLoadCalled = true;
        }
    },
  
    loadOverallSquadLeaderboard: function () {
        this.mask('Loading...');

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.GetOverallOctovineSquadLeaderboard),
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