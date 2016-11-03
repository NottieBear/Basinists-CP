Ext.define('Basinists.CP.view.Content', {
    extend: 'Ext.container.Container',
    xtype: 'content-view',

    firstLoadCalled: false,
    viewDict: {},

    cls: 'main-background',
    padding: 20,
    layout: { type: 'hbox', pack: 'start', align: 'stretch' },
    
    items: [{
        xtype: 'container',
        cls: 'content-navbar-container',
        width: 300,
        margin: '0 20 0 0',
        scrollable: 'y',
        layout: { type: 'vbox', align: 'stretch' },

        items: [{
            xtype: 'navbar-view',
            itemId: 'bcp-navbar'
        }]
    }, {
        xtype: 'container',
        itemId: 'bcp-content-center',
        cls: 'content-center-container',
        layout: 'fit',
        scrollable: true,
        flex: 1
    }],

    initComponent: function () {
        this.callParent();

        this.queryById('bcp-navbar').on('selectionchange', this.changeCenterView, this);
    },

    firstLoad: function () {
        if (!this.firstLoadCalled) {
            this.queryById('bcp-navbar').firstLoad();

            this.firstLoadCalled = true;
        }
    },

    changeCenterView: function (treelist, treeItem) {
        var viewXType = treeItem.get('viewXType');
        if (!this.viewDict[viewXType]) {
            this.viewDict[viewXType] = Ext.create({ xtype: viewXType });
        }

        var centerPanel = this.queryById('bcp-content-center');
        centerPanel.removeAll(false);
        centerPanel.add(this.viewDict[viewXType]);

        if (this.viewDict[viewXType].firstLoad) {
            this.viewDict[viewXType].firstLoad();
        }
    }
})