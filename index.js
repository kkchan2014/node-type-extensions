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
        var nnLen = Object.isString(nn) ? nn.length : nn;
    
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
        return Object.isString(c) && c.length > 0 && this.length >= c.length && this.substr(0, c.length) === c;
    },
    endWith: function (c) {
        return Object.isString(c) && this.length > 0 && c.length >= this.length && c.substr(c.length - this.length) === this;
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
    where: function(handle) {
        var result = [];

        this.forEach((item, index) => handle(item, index) === true && result.push(item));

        return result;
    },
    first: function(handle) {
        var result = null;

        if(handle) {
            this.some(function(item, index) {
                if(!handle || handle(item, index) === true) {
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
        arr.forEach(a => a !== undefined && this.push(a));
        
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

        this.forEach(a => a[keyf] && (dict[a[keyf]] = a[valf]));

        return dict;
    },
    extend: function (ext, replace) {
        for (var i in this) {
            extend(this[i], ext);

            if (replace === true) {
                Object.extract(this[i], (k, v) => Object.isString(v) && (this[i][k] = v.replace('{index}', Number(i) + 1)));
            }
        }

        return this;
    },
    toData: function(fields, d) {
        var data = [[]];

        Object.extract(fields, (k, v) => data[0].push(v));

        d = d || {};

        this.forEach(function(item) {
            var row = [];

            Object.extract(fields, (k, v) => {
                var cellValue = d[k] ? (Object.isFunction(d[k]) ? d[k](item[k]) : d[k]) : item[k];

                row.push((cellValue || '').toString());
            });

            data.push(row);
        });

        return data;
    }
});
extend(Object, {
    toList: function(obj, opts) {
        var list = [];

        Object.extract(obj, (key, val) => {
            var item = extend({}, opts);

            Object.extract(item, (key2, val2) => {
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
    extract: function (obj, func, keyHandle) {
        if(obj instanceof Array || !Object.isObject(obj)) {
            obj = { '0': obj };
        }

        for (var key in obj) {
            if (obj.hasOwnProperty(key) && func(keyHandle ? keyHandle(key) : key, obj[key]) === true) {
                break;
            }
        }

        return obj;
    },
    isObject: function(_1) {
        return _1 instanceof Object && _1.hasOwnProperty && _1.isPrototypeOf;
    },
    isArray: function(_1) {
        return _1 instanceof Array;
    },
    isFunction: function(_1) {
        return typeof _1 === 'function';
    },
    isString: function(_1) {
        return typeof _1 === 'string';
    },
    isNumber: function(_1) {
        return typeof _1 === 'number';
    }
});