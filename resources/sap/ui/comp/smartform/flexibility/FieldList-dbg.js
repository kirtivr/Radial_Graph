/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartform.flexibility.FieldList.
sap.ui.define(['jquery.sap.global', 'sap/ui/comp/library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";


	
	/**
	 * Constructor for a new smartform/flexibility/FieldList.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Contains list of forms, groups and fields which can could be modified by the SAPUI5 flexibility services
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartform.flexibility.FieldList
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FieldList = Control.extend("sap.ui.comp.smartform.flexibility.FieldList", /** @lends sap.ui.comp.smartform.flexibility.FieldList.prototype */ { metadata : {
	
		library : "sap.ui.comp",
		aggregations : {
	
			/**
			 * Nodes representing either a Form, a Group or a field
			 */
			nodes : {type : "sap.ui.comp.smartform.flexibility.FieldListNode", multiple : true, singularName : "node"}
		},
		events : {
	
			/**
			 * Event is fired when the selected node has changed
			 */
            selectionChanged: {}
		}
	}});
	
	/**
	 * init
	 * 
	 * @public
	 */
	FieldList.prototype.init = function() {

        // // do something for initialization...
		this._oSelectedNode = null;
	};
	
	/**
	 * Returns the currently selected field list node
	 *
     * @returns {sap.ui.comp.smartform.flexibility.FieldListNode} node
	 * @public
	 */
	FieldList.prototype.getSelectedNode = function() {

		return this._oSelectedNode;
	};
	
	/**
     * Registers to the Selected event of the provided node
	 *
     * @param {sap.ui.comp.smartform.flexibility.FieldListNode} oNode
     *            node
	 * @private
	 */
	FieldList.prototype._registerNodeSelectionChangedEvent = function(oNode) {

		if (oNode) {
			oNode.attachSelected(this._handleSelectionChanged.bind(this));
		}
	};

        /**
         * Deregisters to the Selected event of the provided node
	 *
         * @param {sap.ui.comp.smartform.flexibility.FieldListNode} oNode
         *            node
	 * @private
	 */
	FieldList.prototype._deregisterNodeSelectionChangedEvent = function(oNode) {

		if (oNode) {
            oNode.detachSelected(this._handleSelectionChanged.bind(this)); // memory leak?
		}
	};
	
	/**
     * Event handler for Selected event of the node
	 *
     * @param {object} oEvent
     *            event
	 * @private
	 */
	FieldList.prototype._handleSelectionChanged = function(oEvent) {

		var oNode;
		oNode = oEvent.getParameter("target");
		if (oNode) {
			// this._setSelectedNode(oNode);
			this.fireSelectionChanged({
				node: oNode
			});
		}
	};
	
	/**
     * Unselects the previoulsy registered node and selects the new one
	 *
     * @param {sap.ui.comp.smartform.flexibility.FieldListNode} oNode
     *            node
	 * @private
	 */
	FieldList.prototype._setSelectedNode = function(oNode) {

		if (!oNode) {
			return;
		}
	
		if (this._oSelectedNode) {
			this._oSelectedNode.setIsSelected(false);
		}
		this._oSelectedNode = oNode;
		this._oSelectedNode.setIsSelected(true);
	};
	
	/**
     * @private Overwritten - called when node is added
	 * @param {sap.ui.comp.smartform.flexibility.FieldListNode} oNode field list node
	 * @returns {sap.ui.comp.smartform.flexibility.FieldListNode} added field list node
	 */
	FieldList.prototype.addNode = function(oNode) {

        this.addAggregation("nodes", oNode, true);
		this._registerNodeSelectionChangedEvent(oNode);
		return this;
	};
	
	/**
     * @private Overwritten - called when node is destroyed
	 * @param {sap.ui.comp.smartform.flexibility.FieldListNode} oNode field list node
	 * @returns {sap.ui.comp.smartform.flexibility.FieldListNode} destroyed field list node
	 */
	FieldList.prototype.destroyNodes = function(oNode) {

        var aNodes, length, i;
		aNodes = this.getNodes();
		length = aNodes.length;
		for (i = 0; i < length; i++) {
			this._deregisterNodeSelectionChangedEvent(aNodes[i]);
		}
		this.destroyAggregation("nodes");
		return this;
	};
	
	/**
     * @private Overwritten - called when node is removed
	 * @param {sap.ui.comp.smartform.flexibility.FieldListNode} oNode field list node
	 * @returns {sap.ui.comp.smartform.flexibility.FieldListNode | number} removed field list node
	 */
	FieldList.prototype.removeNode = function(oNode) {


        this.removeAggregation("nodes", oNode);
	
		if (typeof oNode === 'number') {
			oNode = this.getNodes([
				oNode
			]);
		}
		this._deregisterNodeSelectionChangedEvent(oNode);

        return this;
	};
	

	return FieldList;

}, /* bExport= */ true);
