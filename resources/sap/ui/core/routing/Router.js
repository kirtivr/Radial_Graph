/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider', 'sap/ui/base/ManagedObject', './HashChanger', './Route', './Views', './Targets', 'sap/ui/thirdparty/crossroads', 'sap/ui/thirdparty/signals'], function ($, E, M, H, R, V, T) {
    "use strict";
    var r = {};
    var a = E.extend("sap.ui.core.routing.Router", {
        constructor: function (o, c, O, t) {
            E.apply(this);
            this._oConfig = c || {};
            this._oRouter = crossroads.create();
            this._oRouter.ignoreState = true;
            this._oRoutes = {};
            this._oViews = new V({component: O});
            if (t) {
                this._oTargets = this._createTargets(c, t);
            }
            var b = this, d;
            if (!o) {
                o = {};
            }
            if ($.isArray(o)) {
                d = o;
                o = {};
                $.each(d, function (i, e) {
                    o[e.name] = e;
                });
            }
            $.each(o, function (s, e) {
                if (e.name === undefined) {
                    e.name = s;
                }
                b.addRoute(e);
            });
            this._oRouter.bypassed.add($.proxy(this._onBypassed, this));
        }, addRoute: function (c, p) {
            if (!c.name) {
                $.sap.log.error("A name has to be specified for every route", this);
            }
            if (this._oRoutes[c.name]) {
                $.sap.log.error("Route with name " + c.name + " already exists", this);
            }
            this._oRoutes[c.name] = new R(this, c, p);
        }, parse: function (n) {
            this._oRouter.parse(n);
        }, initialize: function () {
            var t = this, h = this.oHashChanger = H.getInstance();
            if (this._bIsInitialized) {
                $.sap.log.warning("Router is already initialized.", this);
                return this;
            }
            this._bIsInitialized = true;
            this.fnHashChanged = function (e) {
                t.parse(e.getParameter("newHash"), e.getParameter("oldHash"));
            };
            if (!h) {
                $.sap.log.error("navTo of the router is called before the router is initialized. If you want to replace the current hash before you initialize the router you may use getUrl and use replaceHash of the Hashchanger.", this);
                return;
            }
            h.attachEvent("hashChanged", this.fnHashChanged);
            if (!h.init()) {
                this.parse(h.getHash());
            }
            return this;
        }, stop: function () {
            if (!this._bIsInitialized) {
                $.sap.log.warning("Router is not initialized. But it got stopped", this);
            }
            if (this.fnHashChanged) {
                this.oHashChanger.detachEvent("hashChanged", this.fnHashChanged);
            }
            this._bIsInitialized = false;
            return this;
        }, destroy: function () {
            E.prototype.destroy.apply(this);
            if (!this._bIsInitialized) {
                $.sap.log.info("Router is not initialized, but got destroyed.", this);
            }
            if (this.fnHashChanged) {
                this.oHashChanger.detachEvent("hashChanged", this.fnHashChanged);
            }
            this._oRouter.removeAllRoutes();
            this._oRouter = null;
            $.each(this._oRoutes, function (i, o) {
                o.destroy();
            });
            this._oRoutes = null;
            this._oConfig = null;
            if (this._oTargets) {
                this._oTargets.destroy();
                this._oTargets = null;
            }
            this.bIsDestroyed = true;
            return this;
        }, getURL: function (n, p) {
            if (p === undefined) {
                p = {};
            }
            var o = this.getRoute(n);
            if (!o) {
                $.sap.log.warning("Route with name " + n + " does not exist", this);
                return;
            }
            return o.getURL(p);
        }, getRoute: function (n) {
            return this._oRoutes[n];
        }, getViews: function () {
            return this._oViews;
        }, _createTargets: function (c, t) {
            return new T({views: this._oViews, config: c, targets: t});
        }, getView: function (v, s, b) {
            var o = this._oViews._getViewWithGlobalId({viewName: v, type: s, id: b});
            this.fireViewCreated({view: o, viewName: v, type: s});
            return o;
        }, setView: function (v, o) {
            this._oViews.setView(v, o);
            return this;
        }, navTo: function (n, p, b) {
            if (b) {
                this.oHashChanger.replaceHash(this.getURL(n, p));
            } else {
                this.oHashChanger.setHash(this.getURL(n, p));
            }
            return this;
        }, getTargets: function () {
            return this._oTargets;
        }, attachRouteMatched: function (d, f, l) {
            this.attachEvent("routeMatched", d, f, l);
            return this;
        }, detachRouteMatched: function (f, l) {
            this.detachEvent("routeMatched", f, l);
            return this;
        }, fireRouteMatched: function (A) {
            this.fireEvent("routeMatched", A);
            return this;
        }, attachViewCreated: function (d, f, l) {
            this.attachEvent("viewCreated", d, f, l);
            return this;
        }, detachViewCreated: function (f, l) {
            this.detachEvent("viewCreated", f, l);
            return this;
        }, fireViewCreated: function (A) {
            this.fireEvent("viewCreated", A);
            return this;
        }, attachRoutePatternMatched: function (d, f, l) {
            this.attachEvent("routePatternMatched", d, f, l);
            return this;
        }, detachRoutePatternMatched: function (f, l) {
            this.detachEvent("routePatternMatched", f, l);
            return this;
        }, fireRoutePatternMatched: function (A) {
            this.fireEvent("routePatternMatched", A);
            return this;
        }, attachBypassed: function (d, f, l) {
            return this.attachEvent(a.M_EVENTS.Bypassed, d, f, l);
        }, detachBypassed: function (f, l) {
            return this.detachEvent(a.M_EVENTS.Bypassed, f, l);
        }, fireBypassed: function (A) {
            return this.fireEvent(a.M_EVENTS.Bypassed, A);
        }, register: function (n) {
            r[n] = this;
            return this;
        }, _onBypassed: function (h) {
            if (this._oConfig.bypassed) {
                this._oTargets.display(this._oConfig.bypassed.target, {hash: h});
            }
            this.fireBypassed({hash: h});
        }, metadata: {publicMethods: ["initialize", "getURL", "register", "getRoute"]}
    });
    a.M_EVENTS = {
        RouteMatched: "routeMatched",
        RoutePatternMatched: "routePatternMatched",
        ViewCreated: "viewCreated",
        Bypassed: "bypassed"
    };
    a.getRouter = function (n) {
        return r[n];
    };
    return a;
}, true);
