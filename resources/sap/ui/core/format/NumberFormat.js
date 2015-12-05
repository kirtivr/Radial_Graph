/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/core/LocaleData'], function (q, L) {
    "use strict";
    var N = sap.ui.base.Object.extend("sap.ui.core.format.NumberFormat", {
        constructor: function (f) {
            throw new Error();
        }
    });
    var n = {INTEGER: "integer", FLOAT: "float", CURRENCY: "currency", PERCENT: "percent"};
    var g = {ARABIC: "arabic", INDIAN: "indian"};
    var r = {
        FLOOR: "floor",
        CEILING: "ceiling",
        TOWARDS_ZERO: "towards_zero",
        AWAY_FROM_ZERO: "away_from_zero",
        HALF_FLOOR: "half_floor",
        HALF_CEILING: "half_ceiling",
        HALF_TOWARDS_ZERO: "half_towards_zero",
        HALF_AWAY_FROM_ZERO: "half_away_from_zero"
    };
    var R = {};
    R[r.FLOOR] = Math.floor;
    R[r.CEILING] = Math.ceil;
    R[r.TOWARDS_ZERO] = function (d) {
        return d > 0 ? Math.floor(d) : Math.ceil(d);
    };
    R[r.AWAY_FROM_ZERO] = function (d) {
        return d > 0 ? Math.ceil(d) : Math.floor(d);
    };
    R[r.HALF_TOWARDS_ZERO] = function (d) {
        return d > 0 ? Math.ceil(d - 0.5) : Math.floor(d + 0.5);
    };
    R[r.HALF_AWAY_FROM_ZERO] = function (d) {
        return d > 0 ? Math.floor(d + 0.5) : Math.ceil(d - 0.5);
    };
    R[r.HALF_FLOOR] = function (d) {
        return Math.ceil(d - 0.5);
    };
    R[r.HALF_CEILING] = Math.round;
    N.RoundingMode = r;
    N.oDefaultIntegerFormat = {
        minIntegerDigits: 1,
        maxIntegerDigits: 99,
        minFractionDigits: 0,
        maxFractionDigits: 0,
        groupingEnabled: false,
        groupingType: g.ARABIC,
        groupingSeparator: ",",
        decimalSeparator: ".",
        plusSign: "+",
        minusSign: "-",
        isInteger: true,
        type: n.INTEGER,
        showMeasure: false,
        style: "standard",
        roundingMode: N.RoundingMode.TOWARDS_ZERO
    };
    N.oDefaultFloatFormat = {
        minIntegerDigits: 1,
        maxIntegerDigits: 99,
        minFractionDigits: 0,
        maxFractionDigits: 99,
        groupingEnabled: true,
        groupingType: g.ARABIC,
        groupingSeparator: ",",
        decimalSeparator: ".",
        plusSign: "+",
        minusSign: "-",
        isInteger: false,
        type: n.FLOAT,
        showMeasure: false,
        style: "standard",
        roundingMode: N.RoundingMode.HALF_AWAY_FROM_ZERO
    };
    N.oDefaultPercentFormat = {
        minIntegerDigits: 1,
        maxIntegerDigits: 99,
        minFractionDigits: 0,
        maxFractionDigits: 99,
        groupingEnabled: true,
        groupingType: g.ARABIC,
        groupingSeparator: ",",
        decimalSeparator: ".",
        plusSign: "+",
        minusSign: "-",
        percentSign: "%",
        isInteger: false,
        type: n.PERCENT,
        showMeasure: false,
        style: "standard",
        roundingMode: N.RoundingMode.HALF_AWAY_FROM_ZERO
    };
    N.oDefaultCurrencyFormat = {
        minIntegerDigits: 1,
        maxIntegerDigits: 99,
        groupingEnabled: true,
        groupingType: g.ARABIC,
        groupingSeparator: ",",
        decimalSeparator: ".",
        plusSign: "+",
        minusSign: "-",
        isInteger: false,
        type: n.CURRENCY,
        showMeasure: true,
        currencyCode: true,
        currencyContext: 'standard',
        style: "standard",
        roundingMode: N.RoundingMode.HALF_AWAY_FROM_ZERO
    };
    N.getInstance = function (f, l) {
        return this.getFloatInstance(f, l);
    };
    N.getFloatInstance = function (f, l) {
        var F = this.createInstance(f, l), o = this.getLocaleFormatOptions(F.oLocaleData, n.FLOAT);
        F.oFormatOptions = q.extend(false, {}, this.oDefaultFloatFormat, o, f);
        return F;
    };
    N.getIntegerInstance = function (f, l) {
        var F = this.createInstance(f, l), o = this.getLocaleFormatOptions(F.oLocaleData, n.INTEGER);
        F.oFormatOptions = q.extend(false, {}, this.oDefaultIntegerFormat, o, f);
        return F;
    };
    N.getCurrencyInstance = function (f, l) {
        var F = this.createInstance(f, l), C = f && f.currencyContext, o = this.getLocaleFormatOptions(F.oLocaleData, n.CURRENCY, C);
        F.oFormatOptions = q.extend(false, {}, this.oDefaultCurrencyFormat, o, f);
        return F;
    };
    N.getPercentInstance = function (f, l) {
        var F = this.createInstance(f, l), o = this.getLocaleFormatOptions(F.oLocaleData, n.PERCENT);
        F.oFormatOptions = q.extend(false, {}, this.oDefaultPercentFormat, o, f);
        return F;
    };
    N.createInstance = function (f, l) {
        var F = q.sap.newObject(this.prototype), p;
        if (f instanceof sap.ui.core.Locale) {
            l = f;
            f = undefined;
        }
        if (!l) {
            l = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
        }
        F.oLocale = l;
        F.oLocaleData = L.getInstance(l);
        if (f && f.pattern) {
            p = this.parseNumberPattern(f.pattern);
            q.each(p, function (d, o) {
                f[d] = o;
            });
        }
        return F;
    };
    N.getLocaleFormatOptions = function (l, t, C) {
        var o = {}, d;
        switch (t) {
            case n.PERCENT:
                d = l.getPercentPattern();
                break;
            case n.CURRENCY:
                d = l.getCurrencyPattern(C);
                break;
            default:
                d = l.getDecimalPattern();
        }
        o = this.parseNumberPattern(d);
        o.plusSign = l.getNumberSymbol("plusSign");
        o.minusSign = l.getNumberSymbol("minusSign");
        o.decimalSeparator = l.getNumberSymbol("decimal");
        o.groupingSeparator = l.getNumberSymbol("group");
        o.percentSign = l.getNumberSymbol("percentSign");
        o.pattern = d;
        switch (t) {
            case n.FLOAT:
            case n.PERCENT:
                o.minFractionDigits = 0;
                o.maxFractionDigits = 99;
                break;
            case n.INTEGER:
                o.minFractionDigits = 0;
                o.maxFractionDigits = 0;
                o.groupingEnabled = false;
                break;
            case n.CURRENCY:
                o.minFractionDigits = undefined;
                o.maxFractionDigits = undefined;
                break;
        }
        return o;
    };
    N.parseNumberPattern = function (f) {
        var m = 0;
        var M = 0;
        var d = 0;
        var G = false;
        var e = g.ARABIC;
        var S = f.indexOf(";");
        if (S !== -1) {
            f = f.substring(0, S);
        }
        var h = 0;
        for (var i = 0; i < f.length; i++) {
            var C = f[i];
            if (C === ",") {
                if (G) {
                    e = g.INDIAN;
                }
                G = true;
                continue;
            } else if (C === ".") {
                h = 1;
                continue;
            } else if (h == 0 && C === "0") {
                m++;
            } else if (h == 1) {
                if (C === "0") {
                    M++;
                    d++;
                } else if (C === "#") {
                    d++;
                }
            }
        }
        return {minIntegerDigits: m, minFractionDigits: M, maxFractionDigits: d, groupingEnabled: G, groupingType: e};
    };
    N.prototype.format = function (v, m) {
        if (q.isArray(v)) {
            m = v[1];
            v = v[0];
        }
        var i = "", f = "", G = "", d = "", e = "", p = "", P = 0, l = 0, h = 0, j = v < 0, D = -1, o = q.extend({}, this.oFormatOptions), k;
        if (o.decimals !== undefined) {
            o.minFractionDigits = o.decimals;
            o.maxFractionDigits = o.decimals;
        }
        var S = a(v, this.oFormatOptions.style, this.oLocaleData);
        if (S) {
            if (o.shortDecimals !== undefined) {
                o.minFractionDigits = o.shortDecimals;
                o.maxFractionDigits = o.shortDecimals;
            }
            v = v / S.magnitude;
        }
        if (o.type == n.PERCENT) {
            v = s(+v, 2);
        }
        if (o.type == n.CURRENCY) {
            var t = this.oLocaleData.getCurrencyDigits(m);
            if (o.maxFractionDigits === undefined) {
                o.maxFractionDigits = t;
            }
            if (o.minFractionDigits === undefined) {
                o.minFractionDigits = t;
            }
        }
        if (typeof v == "number") {
            v = c(v, o);
        }
        e = this.convertToDecimal(v);
        if (e == "NaN") {
            return e;
        }
        if (j) {
            e = e.substr(1);
        }
        D = e.indexOf(".");
        if (D > -1) {
            i = e.substr(0, D);
            f = e.substr(D + 1);
        } else {
            i = e;
        }
        if (i.length < o.minIntegerDigits) {
            i = q.sap.padLeft(i, "0", o.minIntegerDigits);
        } else if (i.length > o.maxIntegerDigits) {
            i = q.sap.padLeft("", "?", o.maxIntegerDigits);
        }
        if (f.length < o.minFractionDigits) {
            f = q.sap.padRight(f, "0", o.minFractionDigits);
        } else if (f.length > o.maxFractionDigits) {
            f = f.substr(0, o.maxFractionDigits);
        }
        l = i.length;
        if (o.groupingEnabled && l > 3) {
            if (o.groupingType == g.ARABIC) {
                P = l % 3 || 3;
                h = 3;
            } else {
                P = l % 2 + 1 || 3;
                h = 2;
            }
            G = i.substr(0, P);
            while (P < i.length - 1) {
                G += o.groupingSeparator;
                G += i.substr(P, h);
                P += h;
            }
            G += i.substr(P);
            i = G;
        }
        if (j) {
            d = o.minusSign;
        }
        d += i;
        if (f) {
            d += o.decimalSeparator + f;
        }
        if (S && S.formatString) {
            d = S.formatString.replace(S.valueSubString, d);
            d = d.replace(/'.'/g, ".");
        }
        if (o.type == n.CURRENCY) {
            p = o.pattern;
            k = p.split(";");
            if (k.length === 2) {
                p = j ? k[1] : k[0];
                if (j) {
                    d = d.substring(1);
                }
            }
            if (!o.currencyCode) {
                m = this.oLocaleData.getCurrencySymbol(m);
            }
            if (o.showMeasure && m) {
                p = p.replace(/\u00a4/, m);
            } else {
                p = p.replace(/\s*\u00a4\s*/, "");
            }
            if (j) {
                p = p.replace(/-/, o.minusSign);
            }
            p = p.replace(/[0#.,]+/, d);
            d = p;
        }
        if (o.type == n.PERCENT) {
            p = o.pattern;
            d = p.replace(/[0#.,]+/, d);
            d = d.replace(/%/, o.percentSign);
        }
        if (sap.ui.getCore().getConfiguration().getOriginInfo()) {
            d = new String(d);
            d.originInfo = {source: "Common Locale Data Repository", locale: this.oLocale.toString()};
        }
        return d;
    };
    N.prototype.parse = function (v) {
        var o = this.oFormatOptions, d = "^\\s*([+-]?(?:[0-9\\" + o.groupingSeparator + "]+|[0-9\\" + o.groupingSeparator + "]*\\" + o.decimalSeparator + "[0-9]+)(?:[eE][+-][0-9]+)?)\\s*$", e = "^\\s*([+-]?[0-9\\" + o.groupingSeparator + "]+)\\s*$", G = new RegExp("\\" + o.groupingSeparator, "g"), D = new RegExp("\\" + o.decimalSeparator, "g"), p = this.oLocaleData.getPercentPattern(), P = this.oLocaleData.getNumberSymbol("percentSign"), f, h, i, j, k, C, l = 0;
        if (p.charAt(0) === "%") {
            d = d.slice(0, 1) + "%?" + d.slice(1);
        } else if (p.charAt(p.length - 1) === "%") {
            d = d.slice(0, d.length - 1) + "%?" + d.slice(d.length - 1);
        }
        v = v.replace(/\s/g, "");
        var S = b(v, this.oFormatOptions.style, this.oLocaleData);
        v = S.number;
        if (o.isInteger) {
            f = new RegExp(e);
        } else if (o.type === n.CURRENCY) {
            j = "[^\\d\\s+-]*";
            i = "(?:^(" + j + ")" + d.substring(1, d.length - 1) + "$)|(?:^" + d.substring(1, d.length - 1) + "(" + j + ")\\s*$)";
            f = new RegExp(i);
        } else {
            f = new RegExp(d);
        }
        if (!f.test(v)) {
            return NaN;
        }
        if (o.type === n.CURRENCY) {
            k = f.exec(v);
            if (k[2]) {
                v = k[2];
                C = k[1];
            } else {
                v = k[3];
                C = k[4];
            }
        }
        if (C) {
            C = this.oLocaleData.getCurrencyCodeBySymbol(C) || C;
        }
        v = v.replace(G, "");
        if (o.isInteger) {
            l = parseInt(v, 10);
        } else {
            v = v.replace(D, ".");
            if (v.indexOf(P) !== -1) {
                h = true;
                v = v.replace(P, "");
            }
            l = parseFloat(v);
            if (h) {
                l = s(l, -2);
            }
        }
        if (S.factor > 1) {
            l = l * S.factor;
        }
        return o.type === n.CURRENCY ? [l, C] : l;
    };
    N.prototype.convertToDecimal = function (v) {
        var V = "" + v, d, B, D, f, e, p;
        if (V.indexOf("e") == -1 && V.indexOf("E") == -1) {
            return V;
        }
        var h = V.match(/^([+-]?)((\d+)(?:\.(\d+))?)[eE]([+-]?\d+)$/);
        d = h[1] == "-";
        B = h[2].replace(/\./g, "");
        D = h[3] ? h[3].length : 0;
        f = h[4] ? h[4].length : 0;
        e = parseInt(h[5], 10);
        if (e > 0) {
            if (e < f) {
                p = D + e;
                V = B.substr(0, p) + "." + B.substr(p);
            } else {
                V = B;
                e -= f;
                for (var i = 0; i < e; i++) {
                    V += "0";
                }
            }
        } else {
            if (-e < D) {
                p = D + e;
                V = B.substr(0, p) + "." + B.substr(p);
            } else {
                V = B;
                e += D;
                for (var i = 0; i > e; i--) {
                    V = "0" + V;
                }
                V = "0." + V;
            }
        }
        if (d) {
            V = "-" + V;
        }
        return V;
    };
    function a(v, S, l) {
        var o;
        if (S != "short" && S != "long") {
            return o;
        }
        var k = 1;
        while (Math.abs(v) >= k * 10 && k < 1e14) {
            k = k * 10;
        }
        var f = v / k;
        var p = "other";
        if (f == 0) {
            p = "zero";
        } else if (f == 1) {
            p = "one";
        } else if (f == 2) {
            p = "two";
        } else if (f > 2 && f <= 5) {
            p = "few";
        } else if (f > 5 && f <= 10) {
            p = "many";
        }
        var C = l.getDecimalFormat(S, k.toString(), p);
        if (!C) {
            return o;
        }
        o = {};
        if (!C || C == "0") {
            o.magnitude = 1;
        } else {
            o.formatString = C;
            var m = C.match(/0+\.*0*/);
            if (m) {
                o.valueSubString = m[0];
                var d = o.valueSubString.indexOf(".");
                if (d == -1) {
                    o.decimals = 0;
                    o.magnitude = k * Math.pow(10, 1 - o.valueSubString.length);
                } else {
                    o.decimals = o.valueSubString.length - d - 1;
                    o.magnitude = k * Math.pow(10, 1 - d);
                }
            } else {
                o.magnitude = 1;
            }
        }
        return o;
    }

    function b(v, S, l) {
        var d;
        var f = 1;
        if (S != "short" && S != "long") {
            return {number: v, factor: f};
        }
        var k = 10;
        var p;
        var C;
        while (k < 1e14) {
            for (var i = 0; i < 6; i++) {
                switch (i) {
                    case 0:
                        p = "zero";
                        break;
                    case 1:
                        p = "one";
                        break;
                    case 2:
                        p = "two";
                        break;
                    case 3:
                        p = "few";
                        break;
                    case 4:
                        p = "many";
                        break;
                    default:
                        p = "other";
                }
                C = l.getDecimalFormat(S, k.toString(), p);
                if (C) {
                    C = C.replace(/[\s\u00a0]/g, "");
                    var m = C.match(/0+\.*0*/);
                    if (m) {
                        var V = m[0];
                        var u = C.replace(V, "");
                        var I = v.indexOf(u);
                        if (I >= 0) {
                            d = v.replace(u, "");
                            f = k;
                            break;
                        }
                    }
                }
            }
            if (d) {
                break;
            }
            k = k * 10;
        }
        if (!d) {
            d = v;
        }
        return {number: d, factor: f};
    }

    function c(v, o) {
        if (typeof v !== "number") {
            return NaN;
        }
        var d = o.roundingMode || N.RoundingMode.HALF_AWAY_FROM_ZERO;
        if (typeof d === "function") {
            v = d(v, o.maxFractionDigits);
        } else {
            if (!o.maxFractionDigits) {
                return R[d](v);
            }
            v = s(R[d](s(v, o.maxFractionDigits)), -o.maxFractionDigits);
        }
        return v;
    }

    function s(v, S) {
        if (typeof v !== "number" || typeof S !== "number") {
            return NaN;
        }
        var e = v.toString().split("e");
        S = e[1] ? (+e[1] + S) : S;
        return +(e[0] + "e" + S);
    }

    return N;
}, true);
