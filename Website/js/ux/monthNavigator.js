Ext.define('Basinists.CP.ux.MonthNavigator', {
    extend: 'Ext.container.Container',
    xtype: 'ux.navigator.month',

    previousMonthClick: null,
    nextMonthClick: null,

    layout: { type: 'hbox', align: 'middle' },

    items: [{
        xtype: 'button',
        itemId: 'bcp-left-btn',
        glyph: Basinists.CP.ICON.NAVLEFT,
        margin: '0 8 0 0',
        cls: 'content-navigator-button',
        focusCls: 'content-navigator-button',
        iconCls: 'content-navigator-icon',
        overCls: 'content-navigator-button-over',
        _pressedCls: 'content-navigator-button-over'
    }, {
        xtype: 'ux.monthpicker',
        itemId: 'bcp-monthpicker',
        margin: '0 8 0 0'
    }, {
        xtype: 'button',
        itemId: 'bcp-right-btn',
        glyph: Basinists.CP.ICON.NAVRIGHT,
        cls: 'content-navigator-button',
        focusCls: 'content-navigator-button',
        iconCls: 'content-navigator-icon',
        overCls: 'content-navigator-button-over',
        _pressedCls: 'content-navigator-button-over'
    }],

    initComponent: function () {
        this.callParent();

        this.queryById('bcp-left-btn').on({
            click: function (btn, e, eOpts) {
                var monthPicker = this.queryById('bcp-monthpicker');
                var momentMonthYear = monthPicker.getMomentObject();

                momentMonthYear.subtract(1, 'months');
                monthPicker.setMonthYear(momentMonthYear.utc().month(), momentMonthYear.utc().year());

                this.fireEvent('previousMonthClick');
            },
            scope: this
        });

        this.queryById('bcp-right-btn').on({
            click: function (btn, e, eOpts) {
                var monthPicker = this.queryById('bcp-monthpicker');
                var momentMonthYear = monthPicker.getMomentObject();

                momentMonthYear.add(1, 'months');
                monthPicker.setMonthYear(momentMonthYear.utc().month(), momentMonthYear.utc().year());
                this.fireEvent('nextMonthClick');
            },
            scope: this
        });
    },

    getMomentObject: function () {
        return this.queryById('bcp-monthpicker').getMomentObject();
    }
});