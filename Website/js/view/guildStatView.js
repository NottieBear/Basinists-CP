Ext.define('Basinists.CP.view.GuildStat', {
    extend: 'Ext.tab.Panel',
    xtype: 'guild-stat-view',
  
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
        xtype: 'member-online-stat-view',
        title: 'Member Online',
        itemId: 'bcp-member-online-stat'
    }, {
        xtype: 'guild-fund-stat-view',
        title: 'Guild Fund'
    }],
  
    firstLoad: function() {
        var memberOnlineTab = this.queryById('bcp-member-online-stat');
        if(!this.firstLoadCalled && memberOnlineTab.firstLoad) {
            memberOnlineTab.firstLoad();
      
            this.firstLoadCalled = true;
        }
    }
});