
var Util = Util || {};

// Combines two JSON objects in one.
Util.merge = function(obj1, obj2) {
    var obj = {};

    for (var x in obj1) {
        if (obj1.hasOwnProperty(x)) {
            obj[x] = obj1[x];
        }
    }

    for (var x in obj2) {
        if (obj2.hasOwnProperty(x)) {
            obj[x] = obj2[x];
        }
    }

    return obj;
};

/**
 * Turns a NodeList into an array.
 *
 * @param {NodeList} list The array-like object.
 * @return {Array} The NodeList as an array.
 */
Util.toArray = function(list) {
    return Array.prototype.slice.call(list || [], 0);
};

/**
 * Urlencodes a JSON object of key/value query parameters.
 * @param {Object} parameters Key value pairs representing URL parameters.
 * @return {string} query parameters concatenated together.
 */
Util.stringify = function(parameters) {
    var params = [];
    for(var p in parameters) {
        params.push(encodeURIComponent(p) + '=' +
        encodeURIComponent(parameters[p]));
    }
    return params.join('&');
};

/**
 * Creates a JSON object of key/value pairs
 * @param {string} paramStr A string of Url query parmeters.
 *    For example: max-results=5&startindex=2&showfolders=true
 * @return {Object} The query parameters as key/value pairs.
 */
Util.unstringify = function(paramStr) {
    var parts = paramStr.split('&');

    var params = {};
    for (var i = 0, pair; pair = parts[i]; ++i) {
        var param = pair.split('=');
        params[decodeURIComponent(param[0])] = decodeURIComponent(param[1]);
    }
    return params;
};

/**
 * Utility for formatting a date string.
 * @param {string} dateStr The date in UTC format. Example: 2010-04-01T08:00:00Z.
 * @return {string} The date formated as mm/dd/yy. Example: 04/01/10.
 */
Util.formatDate = function(dateStr) {
    var date = new Date(dateStr.split('T')[0]);
    return [date.getMonth() + 1, date.getDate(),
        date.getFullYear().toString().substring(2)].join('/');
};

/**
 * Utility for formatting a Date object as a string in ISO 8601 format using UTC.
 * @param {Date} d The date to format.
 * @return {string} The formated date string in ISO 8601 format.
 */
Util.ISODateString = function(d) {
    var pad = function(n) {
        return n < 10 ? '0' + n : n;
    };
    return d.getUTCFullYear() + '-'
    + pad(d.getUTCMonth() + 1) + '-'
    + pad(d.getUTCDate()) + 'T'
    + pad(d.getUTCHours()) + ':'
    + pad(d.getUTCMinutes()) + ':'
    + pad(d.getUTCSeconds());// + 'Z'
};

/**
 * Formats a string with the given parameters. The string to format must have
 * placeholders that correspond to the index of the arguments passed and surrounded
 * by curly braces (e.g. 'Some {0} string {1}').
 *
 * @param {string} var_args The string to be formatted should be the first
 *     argument followed by the variables to inject into the string
 * @return {string} The string with the specified parameters injected
 */
Util.format = function(var_args) {
    var args = Array.prototype.slice.call(arguments, 1);
    return var_args.replace(/\{(\d+)\}/g, function(m, i) {
        return args[i];
    });
};

Util.sortByDate = function(a, b) {
    if (a.updatedDateFull < b.updatedDateFull) {
        return 1;
    }
    if (a.updatedDateFull > b.updatedDateFull) {
        return -1;
    }
    return 0;
};

Util.sortByTitle = function(a, b) {
    if (a.title < b.title) {
        return 1;
    }
    if (a.title > b.title) {
        return -1;
    }
    return 0;
};

Util.createUUID = function() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
};

Util.cleanFileName = function(file_name) {
    if (encodeURIComponent(file_name) != file_name) {
        var str_nospaces = file_name.replace(/ /g, '_');
        if (str_nospaces != encodeURIComponent(str_nospaces)) {
            var file_extension = file_name.split('.').pop().toLowerCase();
            var str_random = Date.now();
            return str_random + '.' + file_extension;
        } else {
            return encodeURIComponent(str_nospaces);
        }
    } else {
        return encodeURIComponent(file_name);
    }
};
