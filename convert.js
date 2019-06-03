'use strict';

angular.module('simpletive.convert', [])
    .factory('convert', function () {
        return {
            twoDigit: function (value) {
                if (!value) {
                    return '00';
                }
                value = value + '';
                if (value.length == 1) return '0' + value;
                else return value;
            },
            thousandSeparator: function (value) {
                return simpletive.util.thousandSeparator(value);
            },
            timeSpanToDate: function (value) {
                return simpletive.util.convertTimeSpanToDate(value);
            },
            timeSpanToTime: function (value) {
                return this.toStandardTime(this.timeSpanToDate(value));
            },
            toStandardTime: function () {
                var hours, minutes, seconds;
                if (arguments.length == 1) {
                    hours = this.twoDigit(arguments[0].getHours());
                    minutes = this.twoDigit(arguments[0].getMinutes());
                    seconds = this.twoDigit(arguments[0].getSeconds());
                }
                else if (arguments.length == 3) {
                    hours = this.twoDigit(arguments[0]);
                    minutes = this.twoDigit(arguments[1]);
                    seconds = this.twoDigit(arguments[2]);
                }
                else {
                    return '';
                }
                return hours + ":" + minutes + ":" + seconds;
            },
            toShortTime: function () {
                var hours, minutes, seconds;
                if (arguments.length == 1) {
                    hours = this.twoDigit(arguments[0].getHours());
                    minutes = this.twoDigit(arguments[0].getMinutes());
                    seconds = this.twoDigit(arguments[0].getSeconds());
                }
                else if (arguments.length == 3) {
                    hours = this.twoDigit(arguments[0]);
                    minutes = this.twoDigit(arguments[1]);
                    seconds = this.twoDigit(arguments[2]);
                }
                else {
                    return '';
                }
                return hours + ":" + minutes;
            },
            toStandardDate: function (value) {
                if (value) {
                    var timeSpanDate = /Date\(-?\d+\)/;
                    var msDate = /\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} .*/;
                    var faDate = /\d{4}\/\d\d?\/\d\d?/;
                    if (timeSpanDate.test(value + '')) {
                        return this.timeSpanToDate(value);
                    }
                    else if (faDate.test(value + '')) {
                        // it's a fa date time
                        return BaseJalaliDate.jalaliToGregorianDate(value);
                    }
                    else if (msDate.test(value + '')) {
                        // it's a javascript Date object
                        return new Date(value);
                    }
                    else if (typeof (value) == 'object') {
                        // it's a javascript Date object
                        return value;
                    }
                    else if (value.indexOf('T') > -1) {
                        var dt = value.replace('T', ' ');
                        return new Date(dt);
                    }
                }
                return new Date(value);
            },
            toPersianDateTime: function (value) {
                if (value) {
                    value = this.toStandardDate(value);
                    var date = BaseJalaliDate.gregorianToJalaliDate(value);
                    return this.toStandardTime(value) + " " + date;
                }
                return '';
            },
            toPersianDate: function (value) {
                if (value) {
                    value = this.toStandardDate(value);
                    return BaseJalaliDate.gregorianToJalaliDate(value);
                }
                return '';
            },
            toPersianTime: function (value) {
                if (value) {
                    var timeSpanDate = /Date\(-?\d+\)/;
                    var msDate = /\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} .*/;

                    if (timeSpanDate.test(value + '')) {
                        value = this.timeSpanToDate(value);
                        // it's an en date time
                        return this.toStandardTime(value); //value.toLocaleTimeString().replace('AM', 'ق.ظ').replace('PM', 'ب.ظ');
                    }
                    else if (msDate.test(value + '')) {
                        // it's a javascript Date object
                        return this.toStandardTime(value); //value.toLocaleTimeString().replace('AM', 'ق.ظ').replace('PM', 'ب.ظ');
                    }
                    else if (typeof (value) == 'object') {
                        // it's a c# timespan object
                        return this.toStandardTime(value.Hours, value.Minutes, value.Seconds);
                    }
                    else if (value.indexOf('T') > -1) {
                        var dt = value.replace('T', ' ');
                        value = new Date(dt);
                        // it's a javascript Date object
                        return this.toStandardTime(value); //value.toLocaleTimeString();
                    }
                    else return value;
                }
                return '';
            },
            toPersianShortTime: function (value) {
                if (value) {
                    var timeSpanDate = /Date\(-?\d+\)/;
                    var msDate = /\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} .*/;

                    if (timeSpanDate.test(value + '')) {
                        value = this.timeSpanToDate(value);
                        // it's an en date time
                        return this.toShortTime(value); //value.toLocaleTimeString().replace('AM', 'ق.ظ').replace('PM', 'ب.ظ');
                    }
                    else if (msDate.test(value + '')) {
                        // it's a javascript Date object
                        return this.toShortTime(value); //value.toLocaleTimeString().replace('AM', 'ق.ظ').replace('PM', 'ب.ظ');
                    }
                    else if (typeof (value) == 'object') {
                        // it's a c# timespan object
                        return this.toShortTime(value.Hours, value.Minutes, value.Seconds);
                    }
                    else if (value.indexOf('T') > -1) {
                        var dt = value.replace('T', ' ');
                        value = new Date(dt);
                        // it's a javascript Date object
                        return this.toShortTime(value); //value.toLocaleTimeString();
                    }
                    else return value;
                }
                return '';
            },
            fixURL: function (value) {
                if (!value) {
                    return '';
                }
                // Replace every %20 with _ to protect them from decodeURI
                var old = "";
                while (old != value) {
                    old = value;
                    value = value.replace(/(http\S+?)\%20/g, '$1\u200c\u200c\u200c_\u200c\u200c\u200c');
                }
                // Decode URIs
                // NOTE: This would convert all %20's to _'s which could break some links
                // but we will undo that later on
                value = value.replace(/(http\S+)/g, function (s, p) {
                    return decodeURI(p);
                });
                // Revive all instances of %20 to make sure no links is broken
                value = value.replace(/\u200c\u200c\u200c_\u200c\u200c\u200c/g, '%20');
                return value;
            },
            decodeLocation: function ($location) {
                $location.$$absUrl = decodeURI($location.$$absUrl);
                $location.$$url = decodeURI($location.$$url);
            },
            csvToJson: function (csv) {
                var lines = csv.split("\n");
                var result = [];
                var headers = lines[0].split(",");
                for (var i = 1; i < lines.length; i++) {
                    var obj = {};
                    var currentline = lines[i].split(",");
                    for (var j = 0; j < headers.length; j++) {
                        var h = headers[j];
                        obj[h] = currentline[j];
                    }
                    result.push(obj);
                }
                return result;
            },
            persianStandardFormat: function (value) {
                var reg = /^([1-9]|[0-1][0-2]{1,2})\/([1-9]|[0-1][0-9]|[2][0-9]|[3][0-1]{1,2})\/([0-9]{4})\s([1-9]|[0-5][0-9]{1,2}):([1-9]|[0-5][0-9]{1,2}):([1-9]|[0-5][0-9]{1,2})$/g;
                var regAmPm = /^([1-9]|[0-1][0-2]{1,2})\/([1-9]|[0-1][0-9]|[2][0-9]|[3][0-1]{1,2})\/([0-9]{4})\s([1-9]|[0-1][0-2]{1,2}):([1-9]|[0-5][0-9]{1,2}):([1-9]|[0-5][0-9]{1,2})\s[APap][mM]$/g;
                if (value) {
                    if (reg.test(value)) {
                        value = new Date(value);
                    } else if (regAmPm.test(value)) {
                        value = new Date(value);
                    }
                    var standardValue = this.toStandardDate(value);
                    var dayOfWeek = BaseJalaliDate.getPersianDayOfWeekByEnglishDayIndex(standardValue.getDay());
                    var persianDateArray = BaseJalaliDate.gregorianToJalali(standardValue.getUTCFullYear(), standardValue.getUTCMonth() + 1, standardValue.getDate());
                    var nameOfPersianMonth = BaseJalaliDate.GetPersianMonthNameByIndex(persianDateArray[1]);
                    var numberOfDay = persianDateArray[2];
                    var numberOfYear = persianDateArray[0];

                    return dayOfWeek + ' ' + numberOfDay + ' ' + nameOfPersianMonth + ' ' + numberOfYear;
                }
                return '';
            },
        }
    }
    );