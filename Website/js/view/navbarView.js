Ext.define('Basinists.CP.view.Navbar', {
    extend: 'Ext.list.Tree',
    xtype: 'navbar-view',

    firstLoadCalled: false,

    ui: 'navbar',

    expanderOnly: false,
    expanderFirst: false,

    store: Ext.create('Ext.data.TreeStore', {
        fields: [{ name: 'text' }],

        root: {
            expanded: true,
            children: [{
                text: 'Personal Information', iconCls: 'navbar-personal-info-icon', leaf: true, viewXType: 'under-construction-view'
            }, {
                text: 'Octovine Squad', iconCls: 'navbar-octovine-squad-icon', expanded: true, selectable: false, requiredRankOrder: 10, children: [{
                    text: 'Commander Form', iconCls: 'navbar-commander-form-icon', leaf: true, viewXType: 'commander-form-view', requiredRankOrder: 10
                }, {
                    text: 'Edit Records', iconCls: 'navbar-edit-record-icon', leaf: true, viewXType: 'edit-records-view', requiredRankOrder: 4
                }]
            }, {
                text: 'Dashboard', iconCls: 'navbar-dashboard-icon', expanded: true, selectable: false, requiredRankOrder: 4, children: [{
                    text: 'Guild Stats', iconCls: 'navbar-guild-activity-icon', leaf: true, viewXType: 'guild-stat-view', requiredRankOrder: 4
                }, {
                    text: 'Squad Stats', iconCls: 'navbar-squad-activity-icon', leaf: true, viewXType: 'octovine-squad-stat-view', requiredRankOrder: 4
                }]
            }, {
                text: 'Guild Roster', iconCls: 'navbar-guild-roster-icon', leaf: true, viewXType: 'guild-roster-view', requiredRankOrder: 2
            }, {
                text: 'Donation', iconCls: 'navbar-guild-donation-icon', expanded: true, selectable: false, requiredRankOrder: 2, children: [{
                    text: 'Donor Profile', iconCls: 'navbar-guild-donor-icon', leaf: true, viewXType: 'under-construction-view', requiredRankOrder: 2
                }]
            }]
        }
    }),

    firstLoad: function () {
        if (!this.firstLoadCalled) {
            var rootNode = this.getStore().getRoot();
            this.initTreeNode(rootNode);
            this.setSelection(rootNode.firstChild);

            this.firstLoadCalled = true;
        }
    },

    initTreeNode: function (parentNode) {
        _.each(parentNode.childNodes, function (childNode) {
            if (childNode) {
                if (!Basinists.CP.UserPermission.isAccessGranted(childNode.data.requiredRankOrder)) {
                    childNode.remove();
                }
                else {
                    this.initTreeNode(childNode)
                }
            }
        }, this);
    },
});