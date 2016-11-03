Ext.define('Basinists.CP.ux.MonthPicker', {
    extend: 'Ext.container.Container',
    xtype: 'ux.monthpicker',

    layout: { type: 'hbox', align: 'middle' },

    items: [{
        xtype: 'combobox',
        itemId: 'bcp-month-combo',
        width: 120,
        queryMode: 'local',
        displayField: 'name',
        valueField: 'value',
        editable: false,
        store: Ext.create('Ext.data.ArrayStore', { fields: ['name', 'value'] }),
        margin: '0 8 0 0'
    }, {
        xtype: 'numberfield',
        itemId: 'bcp-year-numfield',
        width: 90,
    }],

    initComponent: function () {
        this.callParent();

        moment.locale('en');
        var monthNames = moment.localeData().months();
        var enLocaleDate = moment.localeData('en');

        var months = [];
        for (var i = 0; i < monthNames.length; ++i) {
            months.push({ name: monthNames[i], value: enLocaleDate.monthsParse(monthNames[i]) });
        }

        var monthCombo = this.queryById('bcp-month-combo');
        this.queryById('bcp-month-combo').getStore().loadData(months);

        var dateUtcNow = moment().utc();
        this.setMonthYear(dateUtcNow.month(), dateUtcNow.year());
    },

    setMonthYear: function (monthValue, year) {
        this.queryById('bcp-month-combo').setValue(monthValue);
        this.queryById('bcp-year-numfield').setValue(year);
    },

    getMomentObject: function () {
        var year = this.queryById('bcp-year-numfield').getValue();
        var month = this.queryById('bcp-month-combo').getValue();
        return moment.utc([year, month]);
    }
});