/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/comp/library', './PersonalizableInfo', 'sap/ui/comp/variants/VariantItem', 'sap/ui/comp/variants/VariantManagement', 'sap/ui/core/ValueState', 'sap/ui/fl/Change', 'sap/ui/fl/Persistence', 'sap/ui/fl/registry/Settings', 'sap/m/MessageBox'], function (q, l, P, V, a, b, C, c, S, M) {
    "use strict";
    var d = a.extend("sap.ui.comp.smartvariants.SmartVariantManagement", {
        metadata: {
            library: "sap.ui.comp",
            aggregations: {
                personalizableControls: {
                    type: "sap.ui.comp.smartvariants.PersonalizableInfo",
                    multiple: true,
                    singularName: "personalizableControl"
                }
            },
            events: {initialise: {}, afterSave: {}}
        }
    });
    d._mComponentReadError = {};
    d.prototype.init = function () {
        a.prototype.init.apply(this);
        this._mStandardVariants = {};
        this._mControlPersistence = {};
        this._mControlComponent = {};
        this._aPersonalizableControls = null;
        this._bIsInitialized = false;
        if (this.setLifecycleSupport) {
            this.setLifecycleSupport(true);
        }
        this._setBackwardCompatibility(false);
    };
    d.prototype.addPersonalizableControl = function (o) {
        this.addAggregation("personalizableControls", o, true);
        var s = o.getControl();
        if (s) {
            var e = sap.ui.getCore().getControl(s);
            this._mControlPersistence[e] = new c(e, o.getKeyName());
            this._mControlComponent[e] = sap.ui.fl.Utils.getComponentClassName(e);
        }
    };
    d.prototype.getVariantContent = function (o, k) {
        var e = null;
        if (k === this.STANDARDVARIANTKEY) {
            e = this._getStandardVariant(o);
        } else {
            var v = this._getVariant(o, k);
            if (v) {
                e = v.getContent();
            }
        }
        return e;
    };
    d.prototype._getVariant = function (o, i) {
        var e = null;
        if (o) {
            var p = this._mControlPersistence[o];
            if (p) {
                e = p.getChange(i);
            }
        }
        return e;
    };
    d.prototype._getAllPersonalizableControls = function () {
        var i;
        var o = null;
        if (!this._aPersonalizableControls) {
            this._aPersonalizableControls = [];
            var p = this.getPersonalizableControls();
            if (p) {
                for (i = 0; i < p.length; i++) {
                    o = sap.ui.getCore().getControl(p[i].getControl());
                    if (o) {
                        this._aPersonalizableControls.push({
                            control: o,
                            type: p[i].getType(),
                            dataSource: p[i].getDataSource(),
                            persistence: this._mControlPersistence[o],
                            keyName: p[i].getKeyName()
                        });
                    }
                }
            }
        }
        return this._aPersonalizableControls;
    };
    d.prototype._createVariantEntries = function (v, o) {
        var n = null;
        var s;
        var e, f;
        var g = [];
        this.removeAllItems();
        if (v) {
            for (n in v) {
                if (n) {
                    e = v[n];
                    if (e.isVariant()) {
                        f = new V({
                            key: e.getId(),
                            text: e.getText("variantName"),
                            global: !e.isUserDependent(),
                            executeOnSelection: this._getExecuteOnSelection(e),
                            lifecycleTransportId: e.getRequest(),
                            lifecyclePackage: e.getPackage(),
                            namespace: e.getNamespace(),
                            readOnly: e.isReadOnly(),
                            labelReadOnly: e.isLabelReadOnly()
                        });
                        this.addVariantItem(f);
                        g.push(e.getId());
                    }
                }
            }
        }
        if (o) {
            s = this._getDefaultVariantKey(o);
            if (s) {
                this.setInitialSelectionKey(s);
            }
        }
        if (this._isVariantDownport(o)) {
            this._enableManualVariantKey(true);
        }
        return g;
    };
    d.prototype.getVariantsInfo = function (f) {
        if (!f) {
            q.sap.log.error("'getVariantsInfo' failed . Expecting callBack not passed.");
            return;
        }
        var n = null;
        var v;
        var e = [];
        var g;
        var t = this;
        try {
            g = this._getAllPersonalizableControls();
            if (g && (g.length === 1) && g[0].persistence && g[0].control) {
                g[0].persistence.getChanges().then(function (m) {
                    if (m) {
                        for (n in m) {
                            if (n) {
                                v = m[n];
                                if (v.isVariant()) {
                                    e.push({key: v.getId(), text: v.getText("variantName")});
                                }
                            }
                        }
                    }
                    f(e);
                }, function (i) {
                    var E = "'getChanges' failed:";
                    if (i && i[0] && i[0].messages && i[0].messages[0]) {
                        E += (' ' + i[0].messages[0]);
                    }
                    t._setErrorValueState(t.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"), E, g[0].control);
                    f(e);
                });
            }
        } catch (h) {
            this._setErrorValueState(this.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"), "'getChanges' throws an exception", null);
        }
    };
    d.prototype.getCurrentVariantId = function () {
        var k = "";
        var i = this._getSelectedItem();
        if (i) {
            k = i.getKey();
            if (k === this.STANDARDVARIANTKEY) {
                k = "";
            }
        }
        return k;
    };
    d.prototype.setCurrentVariantId = function (v, D) {
        var o;
        var i = v;
        if (!i) {
            i = this.STANDARDVARIANTKEY;
        } else {
            if (!this.getItemByKey(i)) {
                i = this.STANDARDVARIANTKEY;
            }
        }
        var e = this._getAllPersonalizableControls();
        if (e && (e.length === 1) && e[0].persistence && e[0].control) {
            if (!this._bIsInitialized) {
                e[0].currentVariantId = v;
            } else {
                o = this.getVariantContent(e[0].control, i);
                if (o) {
                    this._setSelectionByKey(i);
                    if (D !== true) {
                        this._applyVariant(e[0].control, o);
                    }
                }
            }
        }
    };
    d.prototype.initialise = function () {
        var t = this;
        var e;
        var o = null, v;
        var p = {variantKeys: []};
        var s = false;
        var k;
        try {
            e = this._getAllPersonalizableControls();
            if (e && (e.length === 1) && e[0].persistence && e[0].control) {
                e[0].persistence.getChanges().then(function (m) {
                    var g = e[0].persistence.getComponentName();
                    sap.ui.fl.registry.Settings.getInstance(g).then(function (h) {
                        if (h) {
                            t.setShowShare(h.isKeyUser());
                        }
                        p.variantKeys = t._createVariantEntries(m, e[0]);
                        var D = t._getDefaultVariantKey(e[0]);
                        if (D) {
                            v = t._getVariant(e[0].control, D);
                            if (v) {
                                t.setDefaultVariantKey(D);
                                t.setInitialSelectionKey(D);
                            }
                        }
                        t.fireEvent("initialise", p);
                        t._bIsInitialized = true;
                        t._setStandardVariant(e[0].control);
                        if (e[0].currentVariantId) {
                            t.setInitialSelectionKey(e[0].currentVariantId);
                            e[0].currentVariantId = undefined;
                        }
                        k = t.getSelectionKey();
                        if (k && (k !== t.STANDARDVARIANTKEY)) {
                            v = t._getVariant(e[0].control, k);
                            if (v) {
                                o = v.getContent();
                            }
                        }
                        if (o) {
                            t._applyVariant(e[0].control, o, s);
                        } else {
                            if ((k === t.STANDARDVARIANTKEY) && t.bExecuteOnSelectForStandard) {
                                if (e[0].control.search) {
                                    t.setInitialSelectionKey(k);
                                    e[0].control.search();
                                }
                            }
                        }
                    }, function (h) {
                        var E = "'getInstance' failed:";
                        if (h && h[0] && h[0].messages && h[0].messages[0]) {
                            E += (' ' + h[0].messages[0]);
                        }
                        t._setErrorValueState(t.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"), E, e[0].control);
                        t.fireEvent("initialise", p);
                        t._setStandardVariant(e[0].control);
                    });
                }, function (g) {
                    var E = "'getChanges' failed:";
                    if (g && g[0] && g[0].messages && g[0].messages[0]) {
                        E += (' ' + g[0].messages[0]);
                    }
                    t._setErrorValueState(t.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"), E, e[0].control);
                    t.fireEvent("initialise", p);
                    t._setStandardVariant(e[0].control);
                });
            } else {
                this._setErrorValueState(this.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"), "'initialise' no personalizable component available", null);
                this.fireEvent("initialise", p);
                if (e && (e.length === 1) && e[0].control) {
                    this._setStandardVariant(e[0].control);
                }
            }
        } catch (f) {
            this._setErrorValueState(this.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"), "'getChanges' throws an exception", null);
            this.fireEvent("initialise", p);
            if (e && (e.length === 1) && e[0].control) {
                this._setStandardVariant(e[0].control);
            }
        }
    };
    d.prototype._updateVariant = function (v, o) {
        if (v.key !== this.STANDARDVARIANTKEY) {
            if (v && o && o.control && o.control.fetchVariant) {
                var e = this._getVariant(o.control, v.key);
                if (e) {
                    try {
                        if ((v.lifecycleTransportId !== null) && (v.lifecycleTransportId !== undefined)) {
                            e.setRequest(v.lifecycleTransportId);
                        }
                        var f = o.control.fetchVariant();
                        if (f) {
                            var i = this.getItemByKey(v.key);
                            if (i) {
                                f.executeOnSelection = i.getExecuteOnSelection();
                            }
                            e.setContent(f);
                        }
                    } catch (g) {
                        q.sap.log.error("'_updateVariant' throws an exception");
                    }
                }
            }
        }
    };
    d.prototype._newVariant = function (v, o) {
        var i;
        if (v && o && o.control && o.control.fetchVariant && o.persistence) {
            var t = o.type;
            var D = o.dataSource;
            var u = !v.global;
            var p = "";
            if ((v.lifecyclePackage !== null) && (v.lifecyclePackage !== undefined)) {
                p = v.lifecyclePackage;
            }
            var T = "";
            if ((v.lifecycleTransportId !== null) && (v.lifecycleTransportId !== undefined)) {
                T = v.lifecycleTransportId;
            }
            var e = o.control.fetchVariant();
            if (e) {
                var s = JSON.stringify(e);
                e = JSON.parse(s);
                if (v.exe) {
                    e.executeOnSelection = v.exe;
                }
                if (v.tile) {
                    e.tile = v.tile;
                }
            }
            i = this._isVariantDownport(o) ? v.key : null;
            var m = {
                type: t,
                ODataService: D,
                texts: {variantName: v.name},
                content: e,
                isVariant: true,
                packageName: p,
                isUserDependent: u,
                id: i
            };
            i = o.persistence.addChange(m);
            this.replaceKey(v.key, i);
            this.setInitialSelectionKey(i);
            var f = this._getVariant(o.control, i);
            if (f) {
                f.setRequest(T);
                var I = this.getItemByKey(i);
                if (I) {
                    I.setNamespace(f.getNamespace());
                }
            }
            if (v.def === true) {
                this._setDefaultVariantKey(o, i);
            }
        }
    };
    d.prototype._appendLifecycleInformation = function (v, i) {
        var t;
        var I = this.getItemByKey(i);
        if (I) {
            t = I.getLifecycleTransportId();
            if (t === null || t === undefined) {
                t = "";
            }
            if (v) {
                v.setRequest(t);
            }
        }
    };
    d.prototype._renameVariant = function (v, o) {
        if (v.key !== this.STANDARDVARIANTKEY) {
            if (v && o && o.control) {
                var e = this._getVariant(o.control, v.key);
                if (e) {
                    e.setText("variantName", v.name);
                    this._appendLifecycleInformation(e, v.key);
                }
            }
        }
    };
    d.prototype._deleteVariants = function (v, o) {
        var i;
        if (v && v.length && o && o.control) {
            var s = this._getDefaultVariantKey(o);
            for (i = 0; i < v.length; i++) {
                if (v[i] === this.STANDARDVARIANTKEY) {
                    continue;
                }
                var e = this._getVariant(o.control, v[i]);
                if (e) {
                    e.markForDeletion();
                    if (s && s === v[i]) {
                        this._setDefaultVariantKey(o, "");
                    }
                    this._appendLifecycleInformation(e, v[i]);
                }
            }
        }
    };
    d.prototype._getDefaultVariantKey = function (o) {
        var D = "";
        if (o && o.persistence) {
            D = o.persistence.getDefaultVariantIdSync();
        }
        return D;
    };
    d.prototype._setDefaultVariantKey = function (o, v) {
        if (o && o.persistence) {
            o.persistence.setDefaultVariantIdSync(v);
        }
    };
    d.prototype._isVariantDownport = function (o) {
        var D = false;
        if (o && o.persistence) {
            D = o.persistence.isVariantDownport();
        }
        return D;
    };
    d.prototype._getExecuteOnSelection = function (v) {
        var j;
        if (v) {
            j = v.getContent();
            if (j && (j.executeOnSelection !== undefined)) {
                return j.executeOnSelection;
            }
        }
        return false;
    };
    d.prototype._setExecuteOnSelections = function (v, o) {
        var i;
        if (v && v.length && o && o.control) {
            for (i = 0; i < v.length; i++) {
                if (v[i].key === this.STANDARDVARIANTKEY) {
                    continue;
                }
                var e = this._getVariant(o.control, v[i].key);
                if (e) {
                    var j = e.getContent();
                    if (j) {
                        j.executeOnSelection = v[i].exe;
                        e.setContent(j);
                    }
                    this._appendLifecycleInformation(e, v[i].key);
                }
            }
        }
    };
    d.prototype._save = function (o) {
        var t = this;
        if (o && o.persistence) {
            try {
                o.persistence.saveAll().then(function () {
                    t.fireEvent("afterSave");
                }, function (f) {
                    var E = "'_save' failed:";
                    if (f && f[0] && f[0].messages && f[0].messages[0]) {
                        E += (' ' + f[0].messages[0]);
                    }
                    t._setErrorValueState(t.oResourceBundle.getText("VARIANT_MANAGEMENT_SAVE_FAILED"), E, o.control);
                });
            } catch (e) {
                this._setErrorValueState(this.oResourceBundle.getText("VARIANT_MANAGEMENT_SAVE_FAILED"), "'_save' throws an exception", o.control);
            }
        }
    };
    d.prototype.fireSave = function (v) {
        var s = false;
        var e = this._getAllPersonalizableControls();
        if (e && (e.length === 1)) {
            if (v) {
                if (v.overwrite) {
                    if (v.key !== this.STANDARDVARIANTKEY) {
                        this.fireEvent("save");
                        this._updateVariant(v, e[0]);
                        s = true;
                    }
                } else {
                    this.fireEvent("save");
                    this._newVariant(v, e[0]);
                    s = true;
                }
                if (s) {
                    this._save(e[0]);
                }
            }
        }
    };
    d.prototype.fireManage = function (v) {
        var i;
        var e = this._getAllPersonalizableControls();
        if (e && (e.length === 1)) {
            if (v) {
                if (v.renamed) {
                    for (i = 0; i < v.renamed.length; i++) {
                        this._renameVariant(v.renamed[i], e[0]);
                    }
                }
                if (v.deleted) {
                    this._deleteVariants(v.deleted, e[0]);
                }
                if (v.exe) {
                    this._setExecuteOnSelections(v.exe, e[0]);
                }
                if (v.def) {
                    var D = this._getDefaultVariantKey(e[0]);
                    if (D !== v.def) {
                        this._setDefaultVariantKey(e[0], v.def);
                    }
                }
                if ((v.deleted && v.deleted.length > 0) || (v.renamed && v.renamed.length > 0) || (v.exe && v.exe.length > 0) || v.def) {
                    this._save(e[0]);
                }
            }
        }
    };
    d.prototype.fireSelect = function (v) {
        var o = null;
        var e = this._getAllPersonalizableControls();
        if (e && (e.length === 1)) {
            if (v && v.key) {
                o = this.getVariantContent(e[0].control, v.key);
                if (o) {
                    var s = JSON.stringify(o);
                    o = JSON.parse(s);
                    if ((v.key === this.STANDARDVARIANTKEY) && this.bExecuteOnSelectForStandard) {
                        o.executeOnSelection = this.bExecuteOnSelectForStandard;
                    }
                    this._applyVariant(e[0].control, o);
                }
            }
        }
    };
    d.prototype._setStandardVariant = function (o) {
        if (o && o.fetchVariant) {
            var s = o.fetchVariant();
            this._mStandardVariants[o] = s;
        }
    };
    d.prototype._getStandardVariant = function (o) {
        var e = null;
        if (this._mStandardVariants && this._mStandardVariants[o]) {
            e = this._mStandardVariants[o];
        }
        return e;
    };
    d.prototype._applyVariant = function (o, e) {
        if (o && o.applyVariant) {
            o.applyVariant(e);
        }
    };
    d.prototype._setErrorValueState = function (t, L, o) {
        this.setEnabled(false);
        if (L) {
            q.sap.log.error(L);
        }
        var s = o ? this._mControlComponent[o] : null;
        d._displayError(this, s, t);
    };
    d._displayError = function (s, e, t) {
        if (s) {
            if (e) {
                if (!d._mComponentReadError[e]) {
                    d._mComponentReadError[e] = e;
                    s._displayError(t);
                }
            } else {
                s._displayError(t);
            }
        }
    };
    d.prototype._displayError = function (t) {
        M.show(t, {
            icon: M.Icon.ERROR,
            title: this.oResourceBundle.getText("VARIANT_MANAGEMENT_ERROR_TITLE"),
            styleClass: (this.$() && this.$().closest(".sapUiSizeCompact").length > 0) ? "sapUiSizeCompact" : ""
        });
    };
    d.prototype.exit = function () {
        a.prototype.exit.apply(this, arguments);
        this._mStandardVariants = null;
        this._mControlPersistence = null;
        this._aPersonalizableControls = null;
        var n, s;
        for (n in this._mControlComponent) {
            if (n) {
                s = this._mControlComponent[n];
                if (s) {
                    delete d._mComponentReadError[s];
                }
            }
        }
        this._mControlComponent = null;
    };
    return d;
}, true);
