/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'], function (q) {
    "use strict";
    var M = {};
    M.render = function (R, m) {
        var a = R;
        var r = M;
        var b = sap.ui.getCore().getConfiguration().getRTL();
        a.write("<TABLE role=\"presentation\"");
        a.writeControlData(m);
        a.write(" cellpadding=\"0\" cellspacing=\"0\"");
        a.addStyle("border-collapse", "collapse");
        var s = m.getWidth();
        if (s) {
            a.addStyle("width", s);
        }
        var c = m.getHeight();
        if (c && c != 'auto') {
            a.addStyle("height", c);
            var o = r.getValueUnit(c);
        }
        if (m.getLayoutFixed()) {
            a.addStyle("table-layout", "fixed");
            if (!s) {
                a.addStyle("width", "100%");
            }
        }
        a.addClass("sapUiMlt");
        a.writeStyles();
        a.writeClasses();
        if (m.getTooltip_AsString()) {
            a.writeAttributeEscaped('title', m.getTooltip_AsString());
        }
        a.write('>');
        var d = m.getRows();
        var C = m.getColumns();
        if (C < 1) {
            for (var i = 0; i < d.length; i++) {
                var e = d[i];
                var f = e.getCells();
                if (C < f.length) {
                    C = f.length;
                }
            }
        }
        if (C > 0) {
            var w = m.getWidths();
            a.write("<colgroup>");
            for (var j = 0; j < C; j++) {
                a.write("<col");
                if (w && w[j] && w[j] != "auto") {
                    a.addStyle('width', w[j]);
                    a.writeStyles();
                }
                a.write("/>");
            }
            a.write("</colgroup>");
        }
        var D = true;
        var g = false;
        a.write('<TBODY style="width: 100%; height: 100%">');
        for (var i = 0; i < d.length; i++) {
            var e = d[i];
            var h = e.getHeight();
            if (h == "auto") {
                h = "";
            }
            if (h && o) {
                var k = r.getValueUnit(h);
                if (k.Unit == '%' && o.Unit != '%') {
                    h = (o.Value * k.Value / 100) + o.Unit;
                }
            }
            a.write("<tr");
            a.writeElementData(e);
            a.writeClasses(e);
            if (e.getTooltip_AsString()) {
                a.writeAttributeEscaped('title', e.getTooltip_AsString());
            }
            if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version >= 9 && h) {
                a.addStyle("height", h);
                a.writeStyles();
            }
            a.write(">");
            var f = e.getCells();
            var l = C;
            if (C < 1) {
                l = f.length;
            }
            g = false;
            var n = 0;
            if (!e.RowSpanCells) {
                e.RowSpanCells = 0;
            } else {
                g = true;
            }
            for (var j = 0; j < l; j++) {
                if (j >= (l - n - e.RowSpanCells)) {
                    break;
                }
                var p = f[j];
                a.write("<td");
                if (h && (!p || p.getRowSpan() == 1)) {
                    a.addStyle("height", h);
                }
                if (p) {
                    a.writeElementData(p);
                    if (p.getTooltip_AsString()) {
                        a.writeAttributeEscaped('title', p.getTooltip_AsString());
                    }
                    if (m.getLayoutFixed() && p.getContent().length > 0) {
                        a.addStyle("overflow", "hidden");
                    }
                    var H = r.getHAlign(p.getHAlign(), b);
                    if (H) {
                        a.writeAttribute("align", H);
                    }
                    var v = r.getVAlign(p.getVAlign());
                    if (v && v != "middle") {
                        a.writeAttribute("valign", v);
                    }
                    if (p.getColSpan() > 1) {
                        a.writeAttribute("colspan", p.getColSpan());
                        n = n + p.getColSpan() - 1;
                        g = true;
                    }
                    if (p.getRowSpan() > 1) {
                        a.writeAttribute("rowspan", p.getRowSpan());
                        var V = 0;
                        var u = "";
                        for (var x = 0; x < p.getRowSpan(); x++) {
                            var t = d[i + x];
                            if (!t) {
                                u = false;
                                break;
                            }
                            if (!t.RowSpanCells) {
                                t.RowSpanCells = 0;
                            }
                            if (x > 0) {
                                t.RowSpanCells = t.RowSpanCells + p.getColSpan();
                            }
                            var y = t.getHeight();
                            if (!y || y == "auto") {
                                u = false;
                            } else {
                                var z = r.getValueUnit(y);
                                if (z.Unit == '%' && o.Unit != '%') {
                                    z.Value = (o.Value * k.Value / 100);
                                    z.Unit = o.Unit;
                                }
                                if (u == "") {
                                    u = z.Unit;
                                } else {
                                    if (u != z.Unit) {
                                        u = false;
                                    }
                                }
                                V = V + z.Value;
                            }
                        }
                        if (u != false) {
                            var S = V + u;
                            a.addStyle("height", S);
                        }
                    }
                    a.addClass(r.getBackgroundClass(p.getBackgroundDesign()));
                    a.addClass(r.getSeparationClass(p.getSeparation()));
                    if (!m.getLayoutFixed() || !h) {
                        a.addClass(r.getPaddingClass(p.getPadding()));
                        a.addClass("sapUiMltCell");
                    } else {
                        a.addStyle("white-space", "nowrap");
                    }
                    a.writeClasses(p);
                }
                a.writeStyles();
                a.write(">");
                if (p) {
                    if (m.getLayoutFixed() && h) {
                        a.write('<div');
                        if (p.getRowSpan() != 1 && S && S.search('%') == -1) {
                            a.addStyle("height", S);
                        } else if (h.search('%') != -1 || (p.getRowSpan() != 1 && !S)) {
                            a.addStyle("height", '100%');
                        } else {
                            a.addStyle("height", h);
                        }
                        a.addStyle("display", "inline-block");
                        if (v) {
                            a.addStyle("vertical-align", v);
                        }
                        a.writeStyles();
                        a.writeClasses(false);
                        a.write("></div>");
                        a.write('<div');
                        a.addStyle("display", "inline-block");
                        if (v) {
                            a.addStyle("vertical-align", v);
                        }
                        if (p.getRowSpan() != 1 && S && S.search('%') == -1) {
                            a.addStyle("max-height", S);
                        } else if (h.search('%') != -1 || (p.getRowSpan() != 1 && !S)) {
                            a.addStyle("max-height", '100%');
                        } else {
                            a.addStyle("max-height", h);
                        }
                        var A = "0";
                        var B = "";
                        var I = "0";
                        var E = p.getContent();
                        for (var F = 0, G = E.length; F < G; F++) {
                            if (E[F].getHeight && E[F].getHeight() != "") {
                                var J = r.getValueUnit(E[F].getHeight());
                                if (J) {
                                    if (B == "") {
                                        B = J.Unit;
                                    }
                                    if (B != J.Unit) {
                                        B = "%";
                                        A = "100";
                                        break;
                                    }
                                    if (J.Unit == "%") {
                                        if (parseFloat(A) < parseFloat(J.Value)) {
                                            A = J.Value;
                                            if (A != "100") {
                                                I = 10000 / parseFloat(A);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (A != "0") {
                            a.addStyle("height", A + B);
                        }
                        a.addStyle("white-space", "normal");
                        a.addStyle("width", "100%");
                        a.writeStyles();
                        a.writeClasses(false);
                        a.write("><div");
                        a.addStyle("overflow", "hidden");
                        a.addStyle("text-overflow", "inherit");
                        if (A != "0") {
                            if (I != "0") {
                                a.addStyle("height", I + "%");
                            } else {
                                a.addStyle("height", "100%");
                            }
                        }
                        a.addClass("sapUiMltCell");
                        a.addClass(r.getPaddingClass(p.getPadding()));
                        a.writeStyles();
                        a.writeClasses(false);
                        a.write(">");
                    }
                    var E = p.getContent();
                    for (var F = 0, G = E.length; F < G; F++) {
                        R.renderControl(E[F]);
                    }
                    if (m.getLayoutFixed() && h) {
                        a.write("</div></div>");
                    }
                }
                a.write("</td>");
            }
            a.write("</tr>");
            e.RowSpanCells = undefined;
            if (!g) {
                D = false;
            }
        }
        if (D && sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version >= 9) {
            a.write("<tr style='height:0;'>");
            for (var i = 0; i < C; i++) {
                a.write("<td></td>");
            }
            a.write("</tr>");
        }
        a.write("</TBODY></TABLE>");
    };
    M.getHAlign = function (h, r) {
        switch (h) {
            case sap.ui.commons.layout.HAlign.Begin:
                return null;
            case sap.ui.commons.layout.HAlign.Center:
                return "center";
            case sap.ui.commons.layout.HAlign.End:
                return r ? "left" : "right";
            case sap.ui.commons.layout.HAlign.Left:
                return r ? "left" : null;
            case sap.ui.commons.layout.HAlign.Right:
                return r ? null : "right";
        }
        return null;
    };
    M.getVAlign = function (v) {
        switch (v) {
            case sap.ui.commons.layout.VAlign.Bottom:
                return "bottom";
            case sap.ui.commons.layout.VAlign.Middle:
                return "middle";
            case sap.ui.commons.layout.VAlign.Top:
                return "top";
        }
        return null;
    };
    M.getBackgroundClass = function (b) {
        switch (b) {
            case sap.ui.commons.layout.BackgroundDesign.Border:
                return "sapUiMltBgBorder";
            case sap.ui.commons.layout.BackgroundDesign.Fill1:
                return "sapUiMltBgFill1";
            case sap.ui.commons.layout.BackgroundDesign.Fill2:
                return "sapUiMltBgFill2";
            case sap.ui.commons.layout.BackgroundDesign.Fill3:
                return "sapUiMltBgFill3";
            case sap.ui.commons.layout.BackgroundDesign.Header:
                return "sapUiMltBgHeader";
            case sap.ui.commons.layout.BackgroundDesign.Plain:
                return "sapUiMltBgPlain";
            case sap.ui.commons.layout.BackgroundDesign.Transparent:
                return null;
        }
        return null;
    };
    M.getPaddingClass = function (p) {
        switch (p) {
            case sap.ui.commons.layout.Padding.None:
                return "sapUiMltPadNone";
            case sap.ui.commons.layout.Padding.Begin:
                return "sapUiMltPadLeft";
            case sap.ui.commons.layout.Padding.End:
                return "sapUiMltPadRight";
            case sap.ui.commons.layout.Padding.Both:
                return "sapUiMltPadBoth";
            case sap.ui.commons.layout.Padding.Neither:
                return "sapUiMltPadNeither";
        }
        return null;
    };
    M.getSeparationClass = function (s) {
        switch (s) {
            case sap.ui.commons.layout.Separation.None:
                return null;
            case sap.ui.commons.layout.Separation.Small:
                return "sapUiMltSepS";
            case sap.ui.commons.layout.Separation.SmallWithLine:
                return "sapUiMltSepSWL";
            case sap.ui.commons.layout.Separation.Medium:
                return "sapUiMltSepM";
            case sap.ui.commons.layout.Separation.MediumWithLine:
                return "sapUiMltSepMWL";
            case sap.ui.commons.layout.Separation.Large:
                return "sapUiMltSepL";
            case sap.ui.commons.layout.Separation.LargeWithLine:
                return "sapUiMltSepLWL";
        }
        return null;
    };
    M.getValueUnit = function (s) {
        var v = 0;
        var u = "";
        var p = s.search('px');
        if (p > -1) {
            u = "px";
            v = parseInt(s.slice(0, p), 10);
            return ({Value: v, Unit: u});
        }
        p = s.search('pt');
        if (p > -1) {
            u = "pt";
            v = parseFloat(s.slice(0, p));
            return ({Value: v, Unit: u});
        }
        p = s.search('in');
        if (p > -1) {
            u = "in";
            v = parseFloat(s.slice(0, p));
            return ({Value: v, Unit: u});
        }
        p = s.search('mm');
        if (p > -1) {
            u = "mm";
            v = parseFloat(s.slice(0, p));
            return ({Value: v, Unit: u});
        }
        p = s.search('cm');
        if (p > -1) {
            u = "cm";
            v = parseFloat(s.slice(0, p));
            return ({Value: v, Unit: u});
        }
        p = s.search('em');
        if (p > -1) {
            u = "em";
            v = parseFloat(s.slice(0, p));
            return ({Value: v, Unit: u});
        }
        p = s.search('ex');
        if (p > -1) {
            u = "ex";
            v = parseFloat(s.slice(0, p));
            return ({Value: v, Unit: u});
        }
        p = s.search('%');
        if (p > -1) {
            u = "%";
            v = parseFloat(s.slice(0, p));
            return ({Value: v, Unit: u});
        }
    };
    return M;
}, true);
