Ext.define('Basinists.CP.view.OctovineSquadHistory', {
    extend: 'Ext.grid.Panel',
    xtype: 'octovine-squad-history-view',

    firstLoadCalled: false,

    stateId: 'Basinists.CP.view.SquadHistory.State',
    stateful: true,

    viewConfig: { cls: 'content-grid-view', enableTextSelection: true },

    initComponent: function () {
        this.createStore();
        this.createColumns();
        this.callParent();
        this.createToolbar();
    },

    createColumns: function () {
        this.columns = [{ text: 'Date', dataIndex: 'date', width: 120, align: 'center', draggable: false }];

        var octovineTimes = getOctovineTimes();
        for (var i = 0; i < octovineTimes.length; ++i) {
            this.columns.push({ text: octovineTimes[i].disp, dataIndex: toOctovineTimefieldName(octovineTimes[i].date), renderer: this.squadRenderer, align: 'center', minWidth: 180, flex: 1, menuDisabled: true, sortable: false, draggable: false });
        }
    },

    createToolbar: function () {
        this.addDocked({
            xtype: 'toolbar',
            dock: 'top',

            items: [' ', {
                xtype: 'ux.navigator.month',
                itemId: 'bcp-month-navigator'
            }, '->', {
                glyph: Basinists.CP.ICON.REFRESH,
                scope: this,

                handler: function () { this.loadSquadHistory(); }
            }]
        });

        this.queryById('bcp-month-navigator').on('previousMonthClick', this.loadSquadHistory, this);
        this.queryById('bcp-month-navigator').on('nextMonthClick', this.loadSquadHistory, this);
    },

    createStore: function () {
        var storeFields = ['date'];

        var octovineTimes = getOctovineTimes();
        for (var i = 0; i < octovineTimes.length; ++i) {
            storeFields.push(toOctovineTimefieldName(octovineTimes[i].date));
        }

        this.store = Ext.create('Ext.data.ArrayStore', {
            fields: storeFields,
            sorters: [{ property: 'date', direction: 'ASC' }],
            data: []
        });
    },

    firstLoad: function () {
        if (!this.firstLoadCalled) {
            this.loadSquadHistory();

            this.firstLoadCalled = true;
        }
    },

    createEmptySquadMonthRecord: function () {
        var selectedMonthYear = this.queryById('bcp-month-navigator').getMomentObject();
        var startOfMonth = selectedMonthYear.clone().startOf('month');
        var totalDays = selectedMonthYear.daysInMonth();

        var squadMonthRecords = [];
        var year = startOfMonth.year();
        var month = startOfMonth.month();
        var octovineTimes = getOctovineTimes();

        for (var i = startOfMonth.date() ; i <= totalDays; ++i) {
            var squadDayRecord = {};
            squadDayRecord['date'] = dateCellRenderer(moment.utc([year, month, i]).valueOf());

            for (var j = 0; j < octovineTimes.length; ++j) {
                squadDayRecord[toOctovineTimefieldName(octovineTimes[j].date)] = [];
            }

            squadMonthRecords.push(squadDayRecord);
        }

        return squadMonthRecords;
    },

    setSquadMonthRecord: function (squadHistory) {
        var squadMonthData = this.createEmptySquadMonthRecord();

        for (var i = 0; i < squadHistory.length; ++i) {
            var rec = _.find(squadMonthData, function (daySquadRec) { return daySquadRec.date == dateCellRenderer(squadHistory[i].timestamp); });
            if (rec) {
                rec[toOctovineTimefieldName(moment.utc(squadHistory[i].timestamp).hour())].push(squadHistory[i]);
            }
        }

        this.getStore().loadData(squadMonthData);
    },

    loadSquadHistory: function () {
        this.mask('Loading...');

        var params = {};

        var selMoment = this.queryById('bcp-month-navigator').getMomentObject();
        params[Basinists.CP.CONST.UrlParam.FromTimestamp] = selMoment.clone().startOf('month').valueOf();
        params[Basinists.CP.CONST.UrlParam.ToTimestamp] = selMoment.clone().endOf('month').valueOf();

        Ext.data.JsonP.request({
            url: createActionUrl(Basinists.CP.CONST.UrlAction.GetOctovineSquads),
            params: params,
            success: function (jsonData) {
                if (jsonData.success) {
                    this.setSquadMonthRecord(jsonData.returnValue);
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

    squadRenderer: function (squads) {
        var cmdrs = '';
        for (var i = 0; i < squads.length; ++i) {
            cmdrs += squads[i].commander + '<br />';
        }

        return cmdrs;
    }
});