Ext.define('Basinists.CP.view.MemberOnlineStat', {
    extend: 'Ext.panel.Panel',
    xtype: 'member-online-stat-view',

    firstLoadCalled: false,

    layout: 'fit',
    items: [{
        xtype: 'cartesian',
        itemId: 'bcp-bar-chart',

        legend: { docked: 'bottom' },
        insetPadding: { top: 20, left: 20, right: 20, bottom: 0 },
        innerPadding: { top: 40 },

        store: Ext.create('Ext.data.ArrayStore', {
            fields: ['timestamp', 'total', 'ab_online', 'eb_online'],
            sorters: [{ property: 'timestamp', direction: 'ASC' }],
            data: []
        }),

        series: [{
            type: 'bar',
            title: ['Auric Basinists [AB]', 'Exalted Basinists [EB]'],
            xField: 'timestamp',
            yField: ['ab_online', 'eb_online'],
            stacked: true,
            highlightCfg: { scaling: 1.1 },

            label: {
                display: 'insideStart',
                color: 'white',
                field: ['ab_online', 'eb_online']
            },

            tooltip: {
                trackMouse: true,
                renderer: function (tooltip, record, item) {
                    if (record.get(item.field)) {
                        var fieldIndex = Ext.Array.indexOf(item.series.getYField(), item.field);
                        var guild = item.series.getTitle()[fieldIndex];

                        tooltip.setHtml(guild + ' : ' + record.get(item.field) + ' online members');
                    }
                    else {
                        tooltip.setHtml('No info available');
                    }
                }
            }
        }, {
            type: 'line',
            title: 'Total',
            xField: 'timestamp',
            yField: ['total', 'ab_online', 'eb_online'],
            marker: { type: 'square', fx: { duration: 200, easing: 'backOut' } },
            highlightCfg: { scaling: 2 },

            label: {
                display: 'over',
                field: 'total'
            },

            tooltip: {
                trackMouse: true,
                renderer: function (tooltip, record, item) {
                    tooltip.setHtml('Total : ' + record.get(item.series.getYField()));
                }
            }
        }],

        axes: [{
            type: 'numeric',
            title: 'Total',
            position: 'left',
            fields: ['ab_online'],
            grid: true
        }, {
            type: 'category',
            title: 'Server Time',
            position: 'bottom',
            fields: ['timestamp'],
            grid: true,
            renderer: function (axis, label, layoutContext) {
                return moment.utc(label).format('h A');
            }
        }]
    }],

    initComponent: function () {
        this.callParent();
        this.createToolbar();
    },

    createToolbar: function () {
        this.addDocked({
            xtype: 'toolbar',
            dock: 'top',

            items: [' ', {
                xtype: 'tbtext',
                cls: 'content-title',
                html: 'No. of Online Members: Daily'
            }, '->', {
                xtype: 'segmentedbutton',
                items: [{ text: 'Stack', pressed: true }, { text: 'Group' }],
                listeners: { toggle: this.toggleStackGroup, scope: this }
            }, ' ', '-', ' ', {
                xtype: 'ux.navigator.date',
                itemId: 'bcp-date-navigator'
            }, ' ', '-', ' ', {
                glyph: Basinists.CP.ICON.REFRESH,
                scope: this,

                handler: function () { this.loadMemberOnlineHistory(); }
            }, ' ']
        });

        this.queryById('bcp-date-navigator').on('dateChange', this.loadMemberOnlineHistory, this);
    },

    toggleStackGroup: function (segmentedButton, button, pressed) {
        var chart = this.queryById('bcp-bar-chart');
        chart.getSeries()[0].setStacked(segmentedButton.getValue() === 0);
        chart.redraw();
    },

    renderBarTip: function (tooltip, record, item) {
        var fieldIndex = Ext.Array.indexOf(item.series.getYField(), item.field);
        var guild = item.series.getTitle()[fieldIndex];

        tooltip.setHtml(guild + ': ' + record.get(item.field) + ' online members');
    },

    firstLoad: function () {
        if (!this.firstLoadCalled) {
            this.loadMemberOnlineHistory();

            this.firstLoadCalled = true;
        }
    },

    loadMemberOnlineHistory: function () {
        this.mask('Loading...');

        var params = {};

        var selMoment = this.queryById('bcp-date-navigator').getMomentObject();
        params[Basinists.CP.CONST.UrlParam.FromTimestamp] = selMoment.clone().startOf('day').valueOf();
        params[Basinists.CP.CONST.UrlParam.ToTimestamp] = selMoment.clone().endOf('day').valueOf();

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.GetMemberOnlines),
            params: params,
            success: function (jsonData) {
                if (jsonData.success) {
                    this.setChartData(jsonData.returnValue);
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

    setChartData: function (memberOnlineRecords) {
        var normalizeRecords = this.normalizeMemberOnlineRecords(memberOnlineRecords);
        this.queryById('bcp-bar-chart').getStore().loadData(normalizeRecords);
    },

    normalizeMemberOnlineRecords: function (memberOnlineRecords) {
        var groupByTimestamp = _.groupBy(memberOnlineRecords, 'timestamp');

        var normalizeRecords = [];
        _.each(groupByTimestamp, function (value, key) {
            var abOnline = _.max(value, 'ab_online').ab_online;
            var ebOnline = _.max(value, 'eb_online').eb_online
            var rec = { timestamp: value[0].timestamp, total: abOnline + ebOnline, ab_online: abOnline, eb_online: ebOnline };
            normalizeRecords.push(rec);
        });

        var octovienTimes = getOctovineTimes();
        _.each(octovienTimes, function (octovineTime) {
            var octovineMoment = null;
            var found = _.find(normalizeRecords, function (normalizeRec) {
                var recMoment = moment.utc(normalizeRec.timestamp);
                octovineMoment = recMoment.clone().hour(octovineTime.date);
                return recMoment.isSame(octovineMoment, 'hour');
            });

            if (!found) {
                var octovineMoment = this.queryById('bcp-date-navigator').getMomentObject().clone().startOf('day').hour(octovineTime.date);
                var rec = { timestamp: octovineMoment.valueOf(), ab_online: undefined, eb_online: undefined };
                normalizeRecords.push(rec);
            }
        }, this);

        return normalizeRecords;
    }
});