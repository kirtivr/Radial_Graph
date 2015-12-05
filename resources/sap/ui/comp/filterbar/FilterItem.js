/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/m/Label','sap/ui/comp/library','sap/ui/core/Element','sap/ui/core/TooltipBase'],function(q,L,l,E,T){"use strict";var F=E.extend("sap.ui.comp.filterbar.FilterItem",{metadata:{library:"sap.ui.comp",properties:{label:{type:"string",group:"Misc",defaultValue:null},name:{type:"string",group:"Misc",defaultValue:null},mandatory:{type:"boolean",group:"Misc",defaultValue:false},visible:{type:"boolean",group:"Misc",defaultValue:true},labelTooltip:{type:"string",group:"Misc",defaultValue:null},partOfCurrentVariant:{type:"boolean",group:"Misc",defaultValue:false},visibleInFilterBar:{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{control:{type:"sap.ui.core.Control",multiple:false}},events:{change:{parameters:{propertyName:{type:"string"}}}}}});F.prototype.init=function(){this._oLabel=null;};F.prototype.setVisible=function(i){this.setProperty("visible",i);this.fireChange({propertyName:"visible"});};F.prototype.setVisibleInFilterBar=function(i){this.setProperty("visibleInFilterBar",i);this.fireChange({propertyName:"visibleInFilterBar"});};F.prototype._createLabelControl=function(){var t=this.getLabel();var o=new L({text:t,required:this.getMandatory(),textAlign:"Begin"});return o;};F.prototype.setMandatory=function(v){this.setProperty("mandatory",v);if(this._oLabel){this._oLabel.setRequired(v);}this.fireChange({propertyName:"mandatory"});};F.prototype.setLabel=function(v){this.setProperty("label",v);if(!this._oLabel){this._oLabel=this._createLabelControl();}if(!this.getLabelTooltip()){this.setLabelTooltip(v);}this._oLabel.setText(v);this.fireChange({propertyName:"label"});};F.prototype.setLabelTooltip=function(t){this.setProperty("labelTooltip",t);if(!this._oLabel){this._oLabel=this._createLabelControl();}this._oLabel.setTooltip(t);};F.prototype.getLabelControl=function(){if(!this._oLabel){this._oLabel=this._createLabelControl();}return this._oLabel;};F.prototype.destroy=function(){E.prototype.destroy.apply(this,arguments);this._oLabel=null;};return F;},true);
