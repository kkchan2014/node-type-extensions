/*---------------------------------------------------------------------------------------------
 *  Copyright (c) kkChan(694643393@qq.com). All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict'

var extend = require('extend');

extend(Number.prototype, {
    //数字补位
    comp: function(nn) {
        var val = this.toString();
        var nnLen = typeof nn === 'string' ? nn.length : nn;
    
        if(nnLen <= val.length) {
            return val.substr(nnLen - val.length);
        } else {
            return Array(nnLen - val.length + 1).join('0') + val;
        }
    }
});

extend(String.prototype, {
    isDate: function() {
        var date = new Date(this);
    
        return date && date.valueOf();
    },
    toDate: function() {
        return new Date(this);
    },
    startWith: function (c) {
        return typeof c === 'string' && c.length > 0 && this.length >= c.length && this.substr(0, c.length) === c;
    },
    endWith: function (c) {
        return typeof c === 'string' && this.length > 0 && c.length >= this.length && c.substr(c.length - this.length) === this;
    },
    prependWith: function (condition, c) {
        if (!c) {
            c = condition;
        }

        if (!this.startWith(c)) {
            return c + this;
        }

        return this;
    },
    appendWith: function (condition, c) {
        if (!c) {
            c = condition;
        }

        if (!this.endWith(c)) {
            return this + c;
        }

        return this;
    },
    trimStart2: function(c) {
        var result = this.trimStart();

        while (c && result.startWith(c)) {
            result = result.substr(c.length);
        }

        return result;
    },
    trimEnd2: function(c) {
        var result = this.trimEnd();

        while (c && result.endWith(c)) {
            result = result.substr(0, result.length - c.length);
        }

        return result;
    },
    maxLength: function (length) {
        if (this.length > length) return this.substr(0, length);

        return this;
    }
});
extend(Date.prototype, {
    format: function(format) {
        var result = format || 'yyyy-MM-dd HH:mm:ss';
        var map = {
            "y+": this.getFullYear(),
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "H+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
    
        for (var key in map) {
            if (new RegExp(`(${key})`).test(result)) {
                result = result.replace(RegExp.$1, map[key].format(RegExp.$1.length));
            }
        }
        
        return result;
    }
});
extend(Array.prototype, {
    deepCopy: function() {
        return JSON.parse(JSON.stringify(this));
    },
    where: function(_eachHandler) {
        var result = [];

        this.forEach(function(item, index) {
            if(_eachHandler(item, index) === true) {
                result.push(item);
            }
        });

        return result;
    },
    first: function(_eachHandler) {
        var result = null;

        if(_eachHandler) {
            this.some(function(item, index) {
                if(!_eachHandler || _eachHandler(item, index) === true) {
                    result = item;
    
                    return true;
                }
            });
        } else {
            result = this[0];
        }

        return result;
    },
    end: function() {
        return this[this.length - 1];
    },
    add: function(a, index) {
        if(index >= 0) {
            this.splice(index, 0, a);
        } else {
            this.push(a);
        }
        
        return this;
    },
    addrange: function(arr) {
        arr.forEach(a => {
            if (a !== undefined) {
                this.push(a);
            }
        });
        
        return this;
    },
    remove: function (index) {
        this.splice(index, 1);
    },
    sum: function() {
        var result = 0;

        this.forEach(a => result += Number(a) || 0);

        return result;
    },
    toDict: function (keyf, valf) {
        var dict = {};

        this.forEach(a => {
            if (a[keyf]) {
                dict[a[keyf]] = a[valf];
            }
        });

        return dict;
    },
    extend: function (ext, replace) {
        for (var i in this) {
            extend(this[i], ext);

            if (replace === true) {
                Object.each(this[i], (key, val) => {
                    if (typeof val === 'string') {
                        this[i][key] = val.replace('{index}', Number(i) + 1);
                    }
                });
            }
        }

        return this;
    },
    toData: function(fields, extendData) {
        var data = [[]];

        for(var key in fields) {
            data[0].push(fields[key]);
        }

        this.forEach(function(item) {
            var row = [];

            extendData = extendData || {};

            for(var key in fields) {
                var cellValue = extendData[key] ? (typeof extendData[key] === 'function' ? extendData[key](item[key]) : extendData[key]) : item[key];

                row.push((cellValue || '').toString());
            }

            data.push(row);
        });

        return data;
    }
});
extend(Object, {
    toList: function(obj, opts) {
        var list = [];

        Object.each(obj, (key, val) => {
            var item = extend({}, opts);

            Object.each(item, (key2, val2) => {
                switch (val2) {
                    case '$key':
                        item[key2] = key;
                        break;
                    case '$value':
                        item[key2] = obj[key];
                        break;
                }
            });

            list.push(item);
        });
        
        return list;
    },
    each: function (obj, eachHandler) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && eachHandler(key, obj[key]) === true) {
                break;
            }
        }

        return obj;
    }
});