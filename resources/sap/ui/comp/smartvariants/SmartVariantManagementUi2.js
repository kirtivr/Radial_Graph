/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/comp/library','./PersonalizableInfo','sap/ui/comp/variants/VariantItem','sap/ui/comp/variants/VariantManagement','sap/m/MessageBox'],function(q,l,P,V,a,M){"use strict";var S=a.extend("sap.ui.comp.smartvariants.SmartVariantManagementUi2",{metadata:{library:"sap.ui.comp",properties:{currentVariantId:{type:"string",group:"Behavior",defaultValue:null}},aggregations:{personalizableControl:{type:"sap.ui.comp.smartvariants.PersonalizableInfo",multiple:false}},events:{initialise:{},afterSave:{}}}});S.prototype.init=function(){a.prototype.init.apply(this);this._oStandardVariant=null;this._oPersController=null;this._sKeyName=null;this._oContainer=null;this._oVariantSet=null;if(this.setLifecycleSupport){this.setLifecycleSupport(true);}this._setBackwardCompatibility(false);};S.prototype.getVariantContent=function(c,k){var C=null;if(k===this.STANDARDVARIANTKEY){C=this._getStandardVariant();}else{if(this._oVariantSet){var v=this._oVariantSet.getVariant(k);if(v){C=this._getContent(v);}}}return C;};S.prototype.getCurrentVariantId=function(){var k="";var i=this._getSelectedItem();if(i){k=i.getKey();if(k===this.STANDARDVARIANTKEY){k="";}}return k;};S.prototype.setCurrentVariantId=function(v,d){var c;var i=v;if(!i){i=this.STANDARDVARIANTKEY;}else{if(!this.getItemByKey(i)){i=this.STANDARDVARIANTKEY;}}if(this._oVariantSet){c=this.getVariantContent(this._oPersController,i);if(c){this._setSelectionByKey(i);if(d!==true){this._applyVariantContent(c);}}}};S.prototype.addPersonalizableControl=function(c){this.setAggregation("personalizableControl",c,true);if(c.getControl()){this._oPersController=sap.ui.getCore().getControl(c.getControl());}this._sKeyName=c.getKeyName();};S.prototype.initialise=function(){var c=this._getPersistencyKey();if(!c){q.sap.log.warning("PersistencyKey not set");this.fireEvent("initialise");return;}if(sap.ushell&&sap.ushell.Container){var t=this;sap.ushell.Container.getService("Personalization").getContainer(c,{validity:Infinity}).fail(function(){q.sap.log.error("Loading personalization container failed");t._setErrorValueState(t.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"));t.fireEvent("initialise");}).done(function(C){t._readPersonalization(C);t.fireEvent("initialise");t._setStandardVariant();t._setSelectedVariant();});return;}q.sap.log.error("Could not obtain the personalization container");this._setErrorValueState(this.oResourceBundle.getText("VARIANT_MANAGEMENT_READ_FAILED"));this.fireEvent("initialise");};S.prototype._setSelectedVariant=function(){var v=null;if(this._oVariantSet){var k=this.getSelectionKey();if(k){v=this._oVariantSet.getVariant(k);if(v){this._applyVariant(v);}}}};S.prototype._reCreateVariantEntries=function(){var n=null;var v=null;var o,b;this.removeAllItems();if(this._oVariantSet){var m=this._oVariantSet.getVariantNamesAndKeys();if(m){for(n in m){if(n){b=new V({text:n,key:m[n]});this.addVariantItem(b);}}v=this._oVariantSet.getCurrentVariantKey();o=this._oVariantSet.getVariant(v);if(o){this.setDefaultVariantKey(v);this.setInitialSelectionKey(v);}}}};S.prototype._getVariantSetAdapter=function(){var v=null;if(this._oContainer){v=new sap.ushell.services.Personalization.VariantSetAdapter(this._oContainer);}return v;};S.prototype._createVariantEntries=function(){var v=this._getVariantSetAdapter();if(v){this._oVariantSet=v.getVariantSet("filterBarVariantSet");if(this._oVariantSet){this._reCreateVariantEntries();}else{this._oVariantSet=v.addVariantSet("filterBarVariantSet");}}};S.prototype._readPersonalization=function(c){this._oContainer=c;if(this._oContainer){this._createVariantEntries();}};S.prototype._savePersonalizationContainer=function(){var t=this;if(this._oContainer){this._oContainer.save().fail(function(){q.sap.log.error("Saving personalization data failed");t._setErrorValueState(t.oResourceBundle.getText("VARIANT_MANAGEMENT_SAVE_FAILED"));}).done(function(){q.sap.log.info("Saving personalization data succeeded");t.fireEvent("afterSave");});}};S.prototype.fireSave=function(v){var o=null,n=null;var s;if(!this._oVariantSet){return;}if(v){if(v.overwrite){if(v.key){o=this._oVariantSet.getVariant(v.key);}}else{if(v.name){o=this._oVariantSet.addVariant(v.name);n=o;s=n.getVariantKey();this.replaceKey(v.key,s);this.setInitialSelectionKey(s);}}if(o){this.fireEvent("save",v);var b=this._fetchVariant();if(b){o.setItemValue("filterBarVariant",b.filterBarVariant);o.setItemValue("filterbar",b.filterbar);s=o.getVariantKey();if(v.def){if(s){this._oVariantSet.setCurrentVariantKey(s);}}else{var d=this._oVariantSet.getCurrentVariantKey();if(s===d){this._oVariantSet.setCurrentVariantKey(null);}}}this._savePersonalizationContainer();}}};S.prototype._setStandardVariant=function(){this._oStandardVariant=this._fetchVariant();};S.prototype._getStandardVariant=function(){return this._oStandardVariant;};S.prototype._setVariantName=function(v,s,n){var k;var f,F;if(this._oVariantSet){var N=this._oVariantSet.addVariant(n);f=v.getItemValue("filterBarVariant");N.setItemValue("filterBarVariant",f);F=v.getItemValue("filterbar");N.setItemValue("filterbar",F);k=this._oVariantSet.getCurrentVariantKey();if(k===s){this._oVariantSet.setCurrentVariantKey(N.getVariantKey());}this._oVariantSet.delVariant(s);k=N.getVariantKey();this.replaceKey(s,k);this.setInitialSelectionKey(k);}};S.prototype.fireManage=function(v){var i;var r=null,d=null;var o;if(!this._oVariantSet){return;}if(v){r=v.renamed;d=v.deleted;if(r){for(i=0;i<r.length;i++){o=this._oVariantSet.getVariant(r[i].key);if(o){if(o.setVariantName){o.setVariantName(r[i].name);}else{this._setVariantName(o,r[i].key,r[i].name);}}}}if(d){var s=this._oVariantSet.getCurrentVariantKey();for(i=0;i<d.length;i++){o=this._oVariantSet.getVariant(d[i]);if(o){if(s&&s===o.getVariantKey()){this._oVariantSet.setCurrentVariantKey(null);}this._oVariantSet.delVariant(d[i]);}}}if(v.def){o=this._oVariantSet.getVariant(v.def);if(o||(v.def===this.STANDARDVARIANTKEY)){this._oVariantSet.setCurrentVariantKey(v.def);}}if((d&&d.length>0)||(r&&r.length>0)||(v.def)){this._savePersonalizationContainer();}}};S.prototype.fireSelect=function(v){var o=null;if(v&&v.key){if(this._oVariantSet){if(v.key===this.STANDARDVARIANTKEY){o=this._getStandardVariant();}else{o=this._oVariantSet.getVariant(v.key);}}}if(o){this._applyVariant(o);}};S.prototype._getContent=function(v){var c=null;if(v){if(v.getItemValue){c={filterbar:v.getItemValue("filterbar"),filterBarVariant:v.getItemValue("filterBarVariant")};}else{c=v;}}return c;};S.prototype._applyVariant=function(v){var c=this._getContent(v);this._applyVariantContent(c);};S.prototype._applyVariantContent=function(c){if(c&&this._oPersController&&this._oPersController.applyVariant){this._oPersController.applyVariant(c);}};S.prototype._fetchVariant=function(){if(this._oPersController&&this._oPersController.fetchVariant){return this._oPersController.fetchVariant();}return null;};S.prototype._getPersistencyKey=function(){if(this._oPersController&&this._sKeyName){return this._oPersController.getProperty(this._sKeyName);}return null;};S.prototype._setErrorValueState=function(t){this.setEnabled(false);this._displayError(t);};S.prototype._displayError=function(t){M.show(t,{icon:M.Icon.ERROR,title:this.oResourceBundle.getText("VARIANT_MANAGEMENT_ERROR_TITLE"),styleClass:(this.$()&&this.$().closest(".sapUiSizeCompact").length>0)?"sapUiSizeCompact":""});};S.prototype.exit=function(){a.prototype.exit.apply(this,arguments);this._oStandardVariant=null;this._oPersController=null;this._sKeyName=null;this._oContainer=null;this._oVariantSet=null;};return S;},true);
