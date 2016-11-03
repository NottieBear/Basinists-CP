Ext.define('Basinists.CP.view.SquadStat', {
    extend: 'Ext.tab.Panel',
    xtype: 'octovine-squad-stat-view',
  
    firstLoadCalled: false,
  
    ui: 'content',
    tabBar: {
        layout: { pack: 'center' }
    },
  
    listeners: [{
        tabchange: function(tabPanel, newTab, oldTab, eOpts)  {
            if(newTab.firstLoad) {
                newTab.firstLoad();
            }
        }
    }],
    
    items: [{
        xtype: 'octovine-squad-history-view',
        title: 'Squad History',
        itemId: 'bcp-squad-history'
    }, {
        xtype: 'octovine-squad-leaderboard-view',
        title: 'Leaderboard'
    }],
  
    firstLoad: function() {
        var squadHistoryTab = this.queryById('bcp-squad-history');
        if(!this.firstLoadCalled && squadHistoryTab.firstLoad) {
            squadHistoryTab.firstLoad();
      
            this.firstLoadCalled = true;
        }
    }
});