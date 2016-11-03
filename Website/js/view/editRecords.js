Ext.define('Basinists.CP.view.EditRecords', {
    extend: 'Ext.tab.Panel',
    xtype: 'edit-records-view',
  
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
        xtype: 'edit-octovine-squad-view',
        title: 'Squad',
        itemId: 'bcp-edit-squad'
    }, {
        xtype: 'edit-member-online-view',
        title: 'Member Online'
    }],
  
    firstLoad: function() {
        var editSquadTab = this.queryById('bcp-edit-squad');
        if(!this.firstLoadCalled && editSquadTab.firstLoad) {
            editSquadTab.firstLoad();
      
            this.firstLoadCalled = true;
        }
    }
});