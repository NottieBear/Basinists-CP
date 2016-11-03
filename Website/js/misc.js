function showInfoMsgbox(msg) {
    Ext.MessageBox.show({ title: 'Info', msg: msg, buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.INFO });
}

function showErrorMsgbox(msg, exception) {
    if (exception) {
        var exceptionMsg = 'Message: ' + exception.message;
        exceptionMsg += exception.fileName ? '<br />Filename: ' + exception.fileName : '';
        exceptionMsg += exception.lineNumber ? '<br />Line: ' + exception.lineNumber : '';

        Ext.MessageBox.show({ title: 'Exception', msg: exceptionMsg, buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.ERROR });
    }
    else {
        Ext.MessageBox.show({ title: 'Error', msg: msg, buttons: Ext.MessageBox.OK, icon: Ext.MessageBox.ERROR });
    }
}

function createActionUrl(actionName) {
    return Basinists.CP.CONST.GAS_URL + '?action=' + actionName;
}

function toCoins(coins) {
    return {
        gold: coins >= 10000 ? Math.floor(coins / 10000) : 0,
        silver: coins >= 100 ? (Math.floor(coins / 100) % 100) : 0,
        copper: coins % 100
    };
}

function dateCellRenderer(timestmap) {
    return moment.utc(timestmap).format('Y-MM-DD');
}

function multilineCellRenderer(multiLine) {
    if (multiLine) {
        return multiLine.replace(/\r?\n|\r/g, "<br />");
    }
}

function timestampCellRenderer(timestmap) {
    var momentUtc = moment.utc(timestmap);
    if (momentUtc.isValid()) {
        return moment.utc(timestmap).format('Y-MM-DD hh:mm A');
    }
    else {
        return '';
    }
}

function blankEditRenderer(value) {
    return '';
}

function centerEditRenderer(value) {
    return '<div style="text-align: center;"><span>' + value + '</span></div>';
}

function centerTimestampEditRenderer(timestmap) {
    return '<div style="text-align: center;"><span>' + timestampCellRenderer(timestmap) + '</span></div>';
}

function goldOnlyRenderer(coins) {
    return toCoins(coins).gold;
}

function coinsRenderer(coins) {
    var coinsObject = toCoins(coins);
    return coinsObject.gold + 'g ' + coinsObject.silver + 's ' + coinsObject.copper + 'c';
}

function getOctovineTimes() {
    var times = [];

    var momentUtcNow = moment().utc();
    var minTime = momentUtcNow.clone().startOf('day').add(1, 'hours');
    var maxTime = momentUtcNow.clone().endOf('day');

    while (minTime.valueOf() <= maxTime.valueOf()) {
        times.push({ disp: minTime.format('hh:mm A'), date: minTime.hour() });
        minTime.add(2, 'hours');
    }

    return times;
}

function toOctovineTimefieldName(hour) {
    return '_' + hour + '_';
}
