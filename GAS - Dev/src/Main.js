function doGet(request) {
    var response = { success: false, msg: 'Invalid action or parameters.' };

    var urlAction = request.parameter.action;
    if (urlActionMappingGet[urlAction]) {
        try {
            response = { success: true, msg: 'Action [' + urlAction + '] is completed successfully.' };
            response.returnValue = urlActionMappingGet[urlAction](request);
        }
        catch (exception) {
            response = { success: false, msg: 'Server Exception thrown.', exception: exception };
        }
    }

    if (request.parameter.callback) {
        return ContentService.createTextOutput(request.parameter.callback + '(' + JSON.stringify(response) + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    else {
        return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(ContentService.MimeType.JSON);
    }
}

function saveOctovineSquadAndMemberOnlineInfo_(request) {
    addOctovineSquad_(request);
    addMemberOnline_(request);
}

function getEnums_(request) {
    var enumType = checkUrlParameter_(request.parameter.enum_type, request.parameter.action, 'enum_type', false);

    var cond = {};
    cond[_COLUMN_ENUM_TYPE] = enumType;

    var db = objDB.open(_DB_MAIN_FILE_ID);
    return objDB.getRows(db, _TABLE_ENUM, [_COLUMN_ENUM_NAME, _COLUMN_ENUM_VALUE], cond);
}