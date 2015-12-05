/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/ui/comp/library','sap/ui/core/Control'],function(q,l,C){"use strict";var F=C.extend("sap.ui.comp.smartform.flexibility.FieldList",{metadata:{library:"sap.ui.comp",aggregations:{nodes:{type:"sap.ui.comp.smartform.flexibility.FieldListNode",multiple:true,singularName:"node"}},events:{selectionChanged:{}}}});F.prototype.init=function(){this._oSelectedNode=null;};F.prototype.getSelectedNode=function(){return this._oSelectedNode;};F.prototype._registerNodeSelectionChangedEvent=function(n){if(n){n.attachSelected(this._handleSelectionChanged.bind(this));}};F.prototype._deregisterNodeSelectionChangedEvent=function(n){if(n){n.detachSelected(this._handleSelectionChanged.bind(this));}};F.prototype._handleSelectionChanged=function(e){var n;n=e.getParameter("target");if(n){this.fireSelectionChanged({node:n});}};F.prototype._setSelectedNode=function(n){if(!n){return;}if(this._oSelectedNode){this._oSelectedNode.setIsSelected(false);}this._oSelectedNode=n;this._oSelectedNode.setIsSelected(true);};F.prototype.addNode=function(n){this.addAggregation("nodes",n,true);this._registerNodeSelectionChangedEvent(n);return this;};F.prototype.destroyNodes=function(n){var N,a,i;N=this.getNodes();a=N.length;for(i=0;i<a;i++){this._deregisterNodeSelectionChangedEvent(N[i]);}this.destroyAggregation("nodes");return this;};F.prototype.removeNode=function(n){this.removeAggregation("nodes",n);if(typeof n==='number'){n=this.getNodes([n]);}this._deregisterNodeSelectionChangedEvent(n);return this;};return F;},true);