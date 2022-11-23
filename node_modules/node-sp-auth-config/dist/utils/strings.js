"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimByChar = void 0;
var trimByChar = function (str, char) {
    if (char === void 0) { char = ' '; }
    var strArr = str.split('');
    var first = strArr.findIndex(function (ch) { return ch !== char; });
    var last = strArr.reverse().findIndex(function (ch) { return ch !== char; });
    return str.substring(first, str.length - last);
};
exports.trimByChar = trimByChar;
//# sourceMappingURL=strings.js.map