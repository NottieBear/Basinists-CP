Ext.define('Basinists.CP.ux.DateNavigator', {
    extend: 'Ext.container.Container',
    xtype: 'ux.navigator.date',

    dateChange: null,

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
        xtype: 'datefield',
        itemId: 'bcp-datefield',
        format: 'd F Y',
        margin: '0 8 0 0',
        showToday: false
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

        var momentUtc = moment.utc();
        this.queryById('bcp-datefield').setValue(new Date(momentUtc.year(), momentUtc.month(), momentUtc.date(), 0, 0, 0, 0));

        this.queryById('bcp-left-btn').on({
            click: function (btn, e, eOpts) {
                var dateField = this.queryById('bcp-datefield');
                var momentNew = moment(dateField.getValue()).subtract(1, 'days');
                dateField.setValue(momentNew.toDate());
            },
            scope: this
        });

        this.queryById('bcp-right-btn').on({
            click: function (btn, e, eOpts) {
                var dateField = this.queryById('bcp-datefield');
                var momentNew = moment(dateField.getValue()).add(1, 'days');
                dateField.setValue(momentNew.toDate());
            },
            scope: this
        });

        this.queryById('bcp-datefield').on({
            change: function (datefield, newValue, oldValue, eOpts) {
                this.fireEvent('dateChange');
            },
            scope: this
        });
    },

    getMomentObject: function () {
        var selDate = this.queryById('bcp-datefield').getValue();
        return moment.utc([selDate.getFullYear(), selDate.getMonth(), selDate.getDate(), 0, 0, 0, 0]);
    }
});