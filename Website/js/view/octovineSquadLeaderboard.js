Ext.define('Basinists.CP.view.SquadLeaderboard', {
    extend: 'Ext.panel.Panel',
    xtype: 'octovine-squad-leaderboard-view',

    firstLoadCalled: false,

    layout: { type: 'hbox', pack: 'center', align: 'stretch' },

    items: [{
        xtype: 'overall-octovine-squad-leaderboard-view',
        itemId: 'bcp-overall-leaderboard',
        margin: '20 10 20 20',
        flex: 0.5
    }, {
        xtype: 'date-range-octovine-squad-leaderboard-view',
        itemId: 'bcp-date-range-leaderboard',
        margin: '20 20 20 10',
        flex: 0.5
    }],

    firstLoad: function () {
        var overallLeaderPanel = this.queryById('bcp-overall-leaderboard');
        var dateRangeLeaderPanel = this.queryById('bcp-date-range-leaderboard');

        if (!this.firstLoadCalled && overallLeaderPanel.firstLoad) {
            overallLeaderPanel.firstLoad();
            dateRangeLeaderPanel.firstLoad();

            this.firstLoadCalled = true;
        }
    }
});