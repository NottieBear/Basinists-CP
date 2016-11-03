Ext.define('Basinists.CP.view.GuildFundStat', {
    extend: 'Ext.panel.Panel',
    xtype: 'guild-fund-stat-view',

    firstLoadCalled: false,

    layout: 'fit',
    items: [{
        xtype: 'cartesian',
        itemId: 'bcp-line-chart',

        legend: { docked: 'bottom' },
        insetPadding: { top: 20, left: 40, right: 40, bottom: 0 },
        innerPadding: { left: 56, right: 56 },

        store: Ext.create('Ext.data.ArrayStore', {
            fields: ['timestamp', 'total_fund', 'ab_fund', 'eb_fund'],
            sorters: [{ property: 'timestamp', direction: 'ASC' }],
            data: []
        }),

        axes: [{
            type: 'numeric',
            title: 'Gold',
            position: 'left',
            fields: ['total_fund', 'ab_fund', 'eb_fund'],
            grid: true,
            renderer: function (axis, label, layoutContext) {
                return goldOnlyRenderer(label);
            }
        }, {
            type: 'category',
            title: 'Server Time',
            position: 'bottom',
            fields: ['timestamp'],
            grid: true,
            label: { rotate: { degrees: -45 } },
            renderer: function (axis, label, layoutContext) {
                return moment.utc(label).format('MMM D, h A');
            }
        }]
    }],

    initComponent: function () {
        this.callParent();
        this.queryById('bcp-line-chart').setSeries([
          this.createLineSeries('Total', 'total_fund', 'under'),
          this.createLineSeries('Auric Basinists [AB]', 'ab_fund', 'over'),
          this.createLineSeries('Exalted Basinists [EB]', 'eb_fund', 'over')]);

        this.createToolbar();
    },

    createLineSeries: function (title, yField, labelDisplay) {
        return {
            type: 'line',
            title: title,
            xField: 'timestamp',
            yField: yField,
            marker: { type: 'square', fx: { duration: 200, easing: 'backOut' } },
            highlightCfg: { scaling: 2 },

            label: {
                display: labelDisplay,
                field: yField,
                renderer: function (coins, sprite, config, rendererData, index) {
                    if (index % 6 == 0) {
                        return coinsRenderer(coins);
                    } else {
                        return '';
                    }
                }
            },

            tooltip: {
                trackMouse: true,
                renderer: function (tooltip, record, item) {
                    tooltip.setHtml(item.series.getTitle() + ' : ' + coinsRenderer(record.get(item.series.getYField())));
                }
            }
        };
    },

    createToolbar: function () {
        this.addDocked({
            xtype: 'toolbar',
            dock: 'top',

            items: [' ', {
                xtype: 'tbtext',
                cls: 'content-title',
                html: 'Guild Funds: Daily'
            }, '->', ' ', '-', ' ', {
                xtype: 'ux.navigator.date',
                itemId: 'bcp-date-navigator'
            }, ' ', '-', ' ', {
                glyph: Basinists.CP.ICON.REFRESH,
                scope: this,

                handler: function () { this.loadGuildFundHistory(); }
            }, ' ']
        });

        this.queryById('bcp-date-navigator').on('dateChange', this.loadGuildFundHistory, this);
    },

    firstLoad: function () {
        if (!this.firstLoadCalled) {
            this.loadGuildFundHistory();

            this.firstLoadCalled = true;
        }
    },

    loadGuildFundHistory: function () {
        this.mask('Loading...');

        var params = {};

        var selMoment = this.queryById('bcp-date-navigator').getMomentObject();
        params[Basinists.CP.CONST.UrlParam.FromTimestamp] = selMoment.clone().startOf('day').valueOf();
        params[Basinists.CP.CONST.UrlParam.ToTimestamp] = moment.utc(params[Basinists.CP.CONST.UrlParam.FromTimestamp]).add(1, 'days').endOf('hour').valueOf();

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.GetGuildFunds),
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

    setChartData: function (guildFundRecords) {
        var normalizeRecords = this.normalizeGuildFundRecords(guildFundRecords);
        this.queryById('bcp-line-chart').getStore().loadData(normalizeRecords);
    },

    normalizeGuildFundRecords: function (guildFundRecords) {
        _.each(guildFundRecords, function (fund, index, list) {
            fund.timestamp = moment.utc(fund.timestamp).clone().startOf('hour').valueOf();
            fund.total = fund.guild_stash + fund.treasure_trove + fund.deep_cave;
        });

        var groupByTimestamp = _.groupBy(guildFundRecords, 'timestamp');

        var normalizeRecords = [];
        _.each(groupByTimestamp, function (fundsByTimestamp, keyDisplayTime) {
            var abFund = _.max(_.where(fundsByTimestamp, { guild_id: Basinists.CP.CONST.AB_GUILD_GUID }), 'total').total;
            var ebFund = _.max(_.where(fundsByTimestamp, { guild_id: Basinists.CP.CONST.EB_GUILD_GUID }), 'total').total;

            normalizeRecords.push({ timestamp: fundsByTimestamp[0].timestamp, total_fund: abFund + ebFund, ab_fund: abFund, eb_fund: ebFund });
        });

        var hourMoment = this.queryById('bcp-date-navigator').getMomentObject().utc().startOf('day');
        for (var i = 0; i < 25; ++i) {
            var found = _.find(normalizeRecords, function (normalizeRec) {
                var recMoment = moment.utc(normalizeRec.timestamp);
                return recMoment.isSame(hourMoment, 'hour');
            });

            if (!found && hourMoment) {
                var rec = { timestamp: hourMoment.valueOf(), total_fund: undefined, ab_fund: undefined, eb_fund: undefined };
                normalizeRecords.push(rec);
            }

            hourMoment = hourMoment.clone().add(1, 'hours');
        };

        return normalizeRecords;
    }
});