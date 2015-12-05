/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.smartform.flexibility.DialogContent.
sap.ui.define(['jquery.sap.global', 'sap/m/Button', 'sap/m/FlexAlignItems', 'sap/m/FlexAlignSelf', 'sap/m/FlexDirection', 'sap/m/FlexItemData', 'sap/m/FlexJustifyContent', 'sap/m/HBox', 'sap/m/VBox', 'sap/ui/comp/library', 'sap/ui/comp/odata/FieldSelector', './FieldList', 'sap/ui/core/Control', 'sap/ui/core/ResizeHandler', 'sap/ui/fl/registry/Settings', 'sap/ui/layout/Grid'],
	function(jQuery, Button, FlexAlignItems, FlexAlignSelf, FlexDirection, FlexItemData, FlexJustifyContent, HBox, VBox, library, FieldSelector, FieldList, Control, ResizeHandler, Settings, Grid) {
	"use strict";


	
	/**
	 * Constructor for a new smartform/flexibility/DialogContent.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The content of the personalization dialog of the SmartForm
	 * @extends sap.ui.core.Control
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.smartform.flexibility.DialogContent
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DialogContent = Control.extend("sap.ui.comp.smartform.flexibility.DialogContent", /** @lends sap.ui.comp.smartform.flexibility.DialogContent.prototype */ { metadata : {
	
		library : "sap.ui.comp",
		aggregations : {
	
			/**
			 * Content of the control itself
			 */
			content : {type : "sap.ui.core.Control", multiple : false}
		}
	}});
	
	
	/**
	 * Initialisation
	 * 
	 * @public
	 */
	DialogContent.prototype.init = function() {
		this._oScrollView = new sap.m.ScrollContainer();
		var smartFormDialog = sap.ui.getCore().byId("smartFormPersDialog");
		if (smartFormDialog) {
			this._oResizeDialogHandlerId = ResizeHandler.register(smartFormDialog, jQuery.proxy(this._handleResizeDialog, this));
		}
	
		this._textResources = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
		this._constructLayout();
		this._createButtons();
		this._createFieldList();
		this._createFieldSelector();
		this._initiateBinding();
		this.addStyleClass("sapUiSizeCompact");
		this._sFirstIdPart = undefined;
	};
	
	DialogContent.prototype._handleResizeDialog = function() {
		if (this._oScrollView) {
			var height = jQuery("#smartFormPersDialog-cont").height();
			var headerHeight = jQuery("#smartFormPersDialogFieldListHeader").height();
			this._oScrollView.setHeight(height - headerHeight + "px");
		}
	};
	
	/**
	 * Initialises the binding of the subordinate controls like move up/down button, field list, field selector
	 * 
	 * @private
	 */
	DialogContent.prototype._initiateBinding = function() {

		this._oFieldList.bindAggregation("nodes", {
			path: "/children",
			factory: this._createNodeFactoryFunction.bind(this)
		});
	
		this._oFieldList.attachSelectionChanged(this._onSelectionChanged.bind(this));
	
		this._oBtnMoveDown.bindProperty("enabled", {
			path: "/isMoveDownButtonEnabled"
		});
		this._oBtnMoveUp.bindProperty("enabled", {
			path: "/isMoveUpButtonEnabled"
		});
	
		this._oBtnMoveBottom.bindProperty("enabled", {
			path: "/isMoveBottomButtonEnabled"
		});
		this._oBtnMoveTop.bindProperty("enabled", {
			path: "/isMoveTopButtonEnabled"
		});
	
	};
	
	/**
	 * Sets the first part of new control ids for the view context
	 * 
	 * @param {string} sId	Control Id
	 * @public
	 */
	DialogContent.prototype.setViewId = function(sId) {
		this._sViewId = sId;
	};
	
	/**
	 * Returns Ids of the assigned changes of the component (correctly sorted)
	 * 
	 * @param {sap.ui.model.odata.ODataModel} oODataModel The list of fields will be extracetd from the models metadata
	 * @param {string} sEntityType The entity type whose fields could be selected
	 * @param {string} sComponentName The name of the SAPUI5 component
	 * @param {array} aIgnoredFields List of fields which should be ignored.
	 * @public
	 */
	DialogContent.prototype.initialiseODataFieldSelector = function(oODataModel, sEntityType, sComponentName, aIgnoredFields) {

		var oODataFieldSelector;
		var bShowCreateExtFieldButton = false;
		oODataFieldSelector = this._oFieldSelector;
		if (oODataFieldSelector) {
			// get the information of the
			Settings.getInstance(sComponentName).then(function(oSettings) {
				if (oSettings.isModelS) {
					bShowCreateExtFieldButton = oSettings.isModelS();
				}
				oODataFieldSelector.setModel(oODataModel, sEntityType, bShowCreateExtFieldButton, aIgnoredFields);
			});
		}
	};
	
	/**
	 * Factory function used for the recursive binding of the FieldListNode
	 * 
	 * @param {string} sId	id of the to-be-created FieldListNode
	 * @param {object} oContext Binding Context
	 * @returns {FieldListNode} Newly created FieldListNode
	 * @private
	 */
	DialogContent.prototype._createNodeFactoryFunction = function(sId, oContext) {

		var nodeBindingSettings, oNode;
	
		nodeBindingSettings = {
			label: {
				path: "label"
			},
			nodes: {
				path: oContext.getPath() + "/children",
				factory: this._createNodeFactoryFunction.bind(this)
			},
			isSelected: {
				path: "isSelected"
			},
			isVisible: {
				path: "isVisible"
			}
		};
		oNode = new sap.ui.comp.smartform.flexibility.FieldListNode(sId, nodeBindingSettings);
		return oNode;
	};
	
	/**
	 * Event handler called when the selection of a root FieldListNode has changed
	 * 
	 * @param {object} oEvent Event
	 * @private
	 */
	DialogContent.prototype._onSelectionChanged = function(oEvent) {

		var oSelectedFieldListNode, oNode;
		oSelectedFieldListNode = oEvent.getParameter('node');
		oNode = oSelectedFieldListNode.getBindingContext().getObject();
	
		this._changeSelection(oNode);
	
		this.getModel().updateBindings();
	
	};
	
	/**
	 * Changes the selected FieldListNode. Unselects previously selected FieldListNode
	 * 
	 * @param {object} oNodeToBeSelected	JSON object from the model representing the newly selected node
	 * @private
	 */
	DialogContent.prototype._changeSelection = function(oNodeToBeSelected) {

	
		// Deselect previously selected node
		if (this._oSelectedFieldListNodeData) {
			this._oSelectedFieldListNodeData.isSelected = false;
		}
	
		// select newly selected node
		this._oSelectedFieldListNodeData = oNodeToBeSelected;
		this._oSelectedFieldListNodeData.isSelected = true;
	
		this._readDataFromModelAndUpdateMoveButtonEnabledState();
	
		this.getModel().updateBindings();
	};
	
	/**
	 * Reads the data from the model and recalculate the move button enabled state
	 * 
	 * @private
	 */
	DialogContent.prototype._readDataFromModelAndUpdateMoveButtonEnabledState = function() {

		var oData;
		oData = this._getDataFromModel();
		this._updateMoveButtonEnabledState(oData);
	
	};
	
	/**
	 * Recalculates the move button enabled state
	 * 
	 * @param {object} oData The data of the whole JSON model
	 * @private
	 */
	DialogContent.prototype._updateMoveButtonEnabledState = function(oData) {

		var fn, bIsMoveDownEnabled, bIsMoveUpEnabled, bIsMoveBottomEnabled, bIsMoveTopEnabled;
	
		fn = function(oNode, nLevelInAdjacenceList, aAdjacenceList) {
			var nParentIndex;
			nParentIndex = aAdjacenceList[nLevelInAdjacenceList - 1].indexOf(oNode.parent);
	
			bIsMoveDownEnabled = oNode.parent.children.length - 1 > oNode.index;
			bIsMoveDownEnabled = bIsMoveDownEnabled || (aAdjacenceList[nLevelInAdjacenceList - 1].length - 1 > nParentIndex);
			bIsMoveUpEnabled = (oNode.index > 0) || (nParentIndex > 0);
			bIsMoveBottomEnabled = bIsMoveDownEnabled;
			bIsMoveTopEnabled = bIsMoveUpEnabled;
		};
	
		if (this._oSelectedFieldListNodeData) {
			this._findNodeInDataModel(oData, this._oSelectedFieldListNodeData.id, fn);
		} else { // nothing selected
			bIsMoveDownEnabled = false;
			bIsMoveUpEnabled = false;
			bIsMoveBottomEnabled = false;
			bIsMoveTopEnabled = false;
		}
	
		oData.isMoveDownButtonEnabled = bIsMoveDownEnabled;
		oData.isMoveUpButtonEnabled = bIsMoveUpEnabled;
		oData.isMoveBottomButtonEnabled = bIsMoveBottomEnabled;
		oData.isMoveTopButtonEnabled = bIsMoveTopEnabled;
	};
	
	DialogContent.prototype._constructLayout = function() {
		this.oLayout = new HBox({
			direction: FlexDirection.Row
		});
		this.oLayoutLeft = new VBox({
			direction: FlexDirection.Column,
			layoutData: new FlexItemData({
				order: 1,
				growFactor: 2
			})
		});
		this.oLayoutLeft.addStyleClass("sapUiCompDialogContentFieldListContainer");
	
		this.oLayoutMiddle = new VBox({
			direction: FlexDirection.Column,
			layoutData: new FlexItemData({
				order: 2,
				growFactor: 1
			})
		});
		this.oLayoutMiddle.addStyleClass("sapUiCompDialogContentMiddle");
	
		this.oLayoutTopLeft = new Grid("smartFormPersDialogFieldListHeader");
		this.oLayoutTopLeft.addStyleClass("sapUiCompDialogContentFieldListContainerTop");
	
		this.oLayoutLeft.addItem(this.oLayoutTopLeft);
	
		this.oLayoutRight = new VBox({
			direction: FlexDirection.Column,
			layoutData: new FlexItemData({
				order: 3,
				growFactor: 9
			})
		});
	
		this.oLayout.addItem(this.oLayoutLeft);
		this.oLayout.addItem(this.oLayoutMiddle);
		this.oLayout.addItem(this.oLayoutRight);
		this.setContent(this.oLayout);
	};
	
	/**
	 * Creates an instance of the FieldList Control
	 * 
	 * @private
	 */
	DialogContent.prototype._createFieldList = function() {
		this._oScrollView.setWidth("100%");
		this._oScrollView.setVertical(true);
	
		this._oFieldList = new FieldList(this.getId() + '-FieldList');
		this._oScrollView.addContent(this._oFieldList);
		this._handleResizeDialog();
	
		this.oLayoutLeft.addItem(this._oScrollView);
	};
	
	/**
	 * Creates an instance of the FieldSelector Control
	 * 
	 * @private
	 */
	DialogContent.prototype._createFieldSelector = function() {
		this._oFieldSelector = new FieldSelector({
			layoutData: new FlexItemData({
				order: 3,
				growFactor: 9
			})
		});
		this.oLayoutRight.addItem(this._oFieldSelector);
	};
	
	/**
	 * Creates the Move up/down buttons, add group button, add field button
	 * 
	 * @private
	 */
	DialogContent.prototype._createButtons = function() {
		var sText, sTooltip;
	
		this._oBtnMoveBottom = new Button(this.getId() + '-MoveBottomButton', {
			layoutData : new sap.ui.layout.GridData({
				span : "L2 M3 S3"
			})
		});
		this._oBtnMoveBottom.setIcon("sap-icon://expand-group");
		this._oBtnMoveBottom.attachPress(this._onMoveBottomClick.bind(this));
		sTooltip = this._textResources.getText("FORM_PERS_DIALOG_MOVE_BOTTOM");
		this._oBtnMoveBottom.setTooltip(sTooltip);
		this.oLayoutTopLeft.addContent(this._oBtnMoveBottom);
	
		this._oBtnMoveDown = new Button(this.getId() + '-MoveDownButton', {
			layoutData : new sap.ui.layout.GridData({
				span : "L2 M3 S3"
			})
		});
		this._oBtnMoveDown.setIcon("sap-icon://slim-arrow-down");
		this._oBtnMoveDown.attachPress(this._onMoveDownClick.bind(this));
		sTooltip = this._textResources.getText("FORM_PERS_DIALOG_MOVE_DOWN");
		this._oBtnMoveDown.setTooltip(sTooltip);
		this.oLayoutTopLeft.addContent(this._oBtnMoveDown);
	
		this._oBtnMoveUp = new Button(this.getId() + '-MoveUpButton', {
			layoutData : new sap.ui.layout.GridData({
				span : "L2 M3 S3"
			})
		});
		this._oBtnMoveUp.setIcon("sap-icon://slim-arrow-up");
		this._oBtnMoveUp.attachPress(this._onMoveUpClick.bind(this));
		sTooltip = this._textResources.getText("FORM_PERS_DIALOG_MOVE_UP");
		this._oBtnMoveUp.setTooltip(sTooltip);
		this.oLayoutTopLeft.addContent(this._oBtnMoveUp);
	
		this._oBtnMoveTop = new Button(this.getId() + '-MoveTopButton', {
			layoutData : new sap.ui.layout.GridData({
				span : "L2 M3 S3"
			})
		});
		this._oBtnMoveTop.setIcon("sap-icon://collapse-group");
		this._oBtnMoveTop.attachPress(this._onMoveTopClick.bind(this));
		sTooltip = this._textResources.getText("FORM_PERS_DIALOG_MOVE_TOP");
		this._oBtnMoveTop.setTooltip(sTooltip);
		this.oLayoutTopLeft.addContent(this._oBtnMoveTop);
	
		this._oBtnAddGroup = new Button(this.getId() + '-AddGroupButton', {
			layoutData : new sap.ui.layout.GridData({
				span : "L4 M12 S12"
			})
		});
		sText = this._textResources.getText("FORM_PERS_DIALOG_ADD_GROUP");
		this._oBtnAddGroup.setText(sText);
		this._oBtnAddGroup.attachPress(this._onAddGroupClick.bind(this));
		sTooltip = this._textResources.getText("FORM_PERS_DIALOG_ADD_GROUP");
		this._oBtnAddGroup.setTooltip(sTooltip);
		this.oLayoutTopLeft.addContent(this._oBtnAddGroup);
	
		this._oBtnAddField = new Button(this.getId() + '-AddFieldButton');
		this._oBtnAddField.setIcon("sap-icon://slim-arrow-left");
		this._oBtnAddField.attachPress(this._onAddFieldClick.bind(this));
		sTooltip = this._textResources.getText("FORM_PERS_DIALOG_ADD_FIELD");
		this._oBtnAddField.setTooltip(sTooltip);
		this.oLayoutMiddle.addItem(this._oBtnAddField);
	};
	
	/**
	 * Event handler called when the move up button is clicked
	 * 
	 * @private
	 */
	DialogContent.prototype._onMoveUpClick = function() {

		var oModel, oData, sId;
	
		oModel = this.getModel();
		if (oModel) {
			sId = this._getIdOfSelectedFieldListNode();
			oData = this._getDataFromModel();
			this._executeMoveUp(oData, sId);
			this._updateMoveButtonEnabledState(oData);
			oModel.setData(oData);
		}
	};
	
	/**
	 * Event handler called when the move down button is clicked
	 * 
	 * @private
	 */
	DialogContent.prototype._onMoveDownClick = function() {

		var oData, sId, oModel;
	
		oModel = this.getModel();
		if (oModel) {
			sId = this._getIdOfSelectedFieldListNode();
			oData = this._getDataFromModel();
			this._executeMoveDown(oData, sId);
			this._updateMoveButtonEnabledState(oData);
			oModel.setData(oData);
		}
	};
	
	/**
	 * Event handler called when the move top button is clicked
	 * 
	 * @private
	 */
	DialogContent.prototype._onMoveTopClick = function() {

		var oModel, oData, sId;
	
		oModel = this.getModel();
		if (oModel) {
			sId = this._getIdOfSelectedFieldListNode();
			oData = this._getDataFromModel();
			this._executeMoveTop(oData, sId);
			this._updateMoveButtonEnabledState(oData);
			oModel.setData(oData);
		}
	};
	
	/**
	 * Event handler called when the move bottom button is clicked
	 * 
	 * @private
	 */
	DialogContent.prototype._onMoveBottomClick = function() {

		var oData, sId, oModel;
	
		oModel = this.getModel();
		if (oModel) {
			sId = this._getIdOfSelectedFieldListNode();
			oData = this._getDataFromModel();
			this._executeMoveBottom(oData, sId);
			this._updateMoveButtonEnabledState(oData);
			oModel.setData(oData);
		}
	};
	
	/**
	 * Event handler called when the add group button is clicked
	 * 
	 * @private
	 */
	DialogContent.prototype._onAddGroupClick = function() {

		var oData, oModel;
	
		oModel = this.getModel();
		if (oModel) {
			oData = this._getDataFromModel();
			this._executeAddGroup(oData);
			oModel.setData(oData);
		}
	};
	
	/**
	 * Returns the id of the currently selected FieldListNode. Undefined if no FieldListNode is selected
	 * 
	 * @returns {string} Id of selected FieldListNode
	 * @private
	 */
	DialogContent.prototype._getIdOfSelectedFieldListNode = function() {

		var oNode;
		oNode = this._oSelectedFieldListNodeData;
	
		if (oNode) {
			return oNode.id;
		}
	};
	
	/**
	 * Event handler, called when add field button was clicked
	 * 
	 * @param {object} oEvent Event
	 * @private
	 */
	DialogContent.prototype._onAddFieldClick = function(oEvent) {
		var oModel, oData;
	
		oModel = this.getModel();
		if (oModel) {
			oData = this._getDataFromModel();
			this._executeAddField(oData);
			oModel.setData(oData);
		}
	};
	
	/**
	 * Calculates position where a new field would be added to. Basis for this calculation is the currently selected node.
	 * 
	 * @param {object} oData JSON data from model
	 * @returns {object} Map having a member 'parent' (new parent node) and 'index' (Position in parent's children collection)
	 * @private
	 */
	DialogContent.prototype._getParentAndIndexNodeForNewField = function(oData) {
		var sId, nIndex, oParentNode;
	
		// Search for the currently selected field list node and determine new parent
		sId = this._getIdOfSelectedFieldListNode();
		this._findNodeInDataModel(oData, sId, function(oNode) {
			if (oNode.type === 'group') {
				oParentNode = oNode;
				if (oParentNode.children && oParentNode.children.length) {
					nIndex = oParentNode.children.length;
				}
			} else {
				oParentNode = oNode.parent;
				nIndex = oNode.index + 1;
			}
		});
		// if no FieldNode was selected, append to last group
		if (!oParentNode) {
			oParentNode = this._getBottomGroup(oData);
			nIndex = oParentNode.children.length;
		}
	
		return {
			parent: oParentNode,
			index: nIndex
		};
	
	};
	
	/**
	 * Returns the last group
	 * 
	 * @param {object} oData JSON data from model returns {object} The very last group. Undefined if there are no groups.
	 * @returns {object} Parent node instance
	 * @private
	 */
	DialogContent.prototype._getBottomGroup = function(oData) {
		var oParentNode;
	
		if (oData && oData.children && oData.children.length > 0) {
			oParentNode = oData.children[oData.children.length - 1]; // get last element
		}
		return oParentNode;
	};
	
	/**
	 * Gets the data from the model
	 * 
	 * @returns {object} JSON data from model
	 * @private
	 */
	DialogContent.prototype._getDataFromModel = function() {

		var oModel;
	
		oModel = this.getModel();
		if (oModel) {
			return oModel.getData();
		}
	};
	
	/**
	 * Creates an adjacence list from the provided JSON tree. The data has a single root node and multiple children. Each child can have multiple children
	 * too. The tree depth is not limited. The adjacence list is an array of arrays. list[i] contains an ordered list of all nodes of the tree, having the
	 * depth i. This means list[0] equals the root node. As a side effect two additional properties will be added to all nodes of the model: - index:
	 * Contains the position of this node in the parent's children collection - parent: The parent of this node These properties can be removed with
	 * _destroyAdjacenceList
	 * 
	 * @param {object} oData The data from the JSON model
	 * @returns {Array} Adjacence list
	 * @private
	 */
	DialogContent.prototype._createAdjacenceList = function(oData) {

		var aAdjacenceList, fCreateAdjacenceList;
	
		aAdjacenceList = [];
		fCreateAdjacenceList = function(oNode, oParent, nIndex, nDepth) {
			oNode.index = nIndex;
			oNode.parent = oParent;
			aAdjacenceList[nDepth] = aAdjacenceList[nDepth] || [];
			aAdjacenceList[nDepth].push(oNode);
		};
	
		this._dfs(oData, fCreateAdjacenceList);
	
		return aAdjacenceList;
	};
	
	/**
	 * Removes the properties from the data model added, which were added when calling _createAdjacenceList
	 * 
	 * @param {object} oData The data from the JSON model
	 * @private
	 */
	DialogContent.prototype._destroyAdjacenceList = function(oData) {

		var fDestroyAdjacenceList;
	
		fDestroyAdjacenceList = function(oNode, oParent, nIndex, nDepth) {
			delete oNode.index;
			delete oNode.parent;
		};
	
		this._dfs(oData, fDestroyAdjacenceList);
	};
	
	/**
	 * DFS (depth first search) traverses the full graph an calls fn for each node. Method is recursive
	 * 
	 * @param {object} oData The data of the current node
	 * @param {function} fn Function to be called for each node
	 * @param {object} oParent The parent node
	 * @param {number} nIndex The index of the cirrent node within the parent's children collection
	 * @param {number} nDepth The depth within the tree of the current node
	 * @private
	 */
	DialogContent.prototype._dfs = function(oData, fn, oParent, nIndex, nDepth) {

		var i;
	
		if (!oData) {
			return;
		}
	
		nDepth = nDepth || 0;
		nIndex = nIndex || 0;
	
		fn(oData, oParent, nIndex, nDepth);
	
		if (oData && oData.children) {
			for (i = 0; i < oData.children.length; i++) {
				this._dfs(oData.children[i], fn, oData, i, nDepth + 1);
			}
		}
	};
	
	/**
	 * Searches for a node in the data tree and executes the funtion fn for this node
	 * 
	 * @param {object} oData The data of the JSON model
	 * @param {String} sId oParent The parent node
	 * @param {function} fn Function to be executed for this node. Function will be called with these parameters: fn(oNode, nDepth, aAdjacenceList).
	 * @private
	 */
	DialogContent.prototype._findNodeInDataModel = function(oData, sId, fn) {

		var aAdjacenceList;
	
		aAdjacenceList = this._createAdjacenceList(oData);
	
		(function() {
			var nDepth, j, nMaxHierarchyDepth, length, oNode;
	
			nMaxHierarchyDepth = aAdjacenceList.length;
			for (nDepth = 0; nDepth < nMaxHierarchyDepth; nDepth++) {
				length = aAdjacenceList[nDepth].length;
				for (j = 0; j < length; j++) {
					oNode = aAdjacenceList[nDepth][j];
					if (oNode.id === sId) {
						fn(oNode, nDepth, aAdjacenceList);
						return;
					}
				}
			}
		}());
	
		this._destroyAdjacenceList(oData);
	};
	
	/**
	 * Moves a node down in the data model
	 * 
	 * @param {object} oNode The JSON node representing a FieldListNode to be moved down
	 * @param {number} nLevelInAdjacenceList Depth of the node in the tree
	 * @param {Array} aAdjacenceList Adjacence List
	 * @private
	 */
	DialogContent.prototype._moveDownNode = function(oNode, nLevelInAdjacenceList, aAdjacenceList) {

		var oNewParent, nOldParentIndex;
		if (oNode.index < oNode.parent.children.length - 1) { // node found --> move down (simple case)
			oNode.parent.children.splice(oNode.index, 1);
			oNode.parent.children.splice(oNode.index + 1, 0, oNode);
			return;
		} else if (oNode.index === oNode.parent.children.length - 1) { // move down (find new parent node)
			nOldParentIndex = aAdjacenceList[nLevelInAdjacenceList - 1].indexOf(oNode.parent);
			if (nOldParentIndex > -1) {
				oNewParent = aAdjacenceList[nLevelInAdjacenceList - 1][nOldParentIndex + 1];
				if (oNewParent) {
					oNode.parent.children.splice(oNode.index, 1);
					oNewParent.children = oNewParent.children || [];
					oNewParent.children.splice(0, 0, oNode);
					return;
				}
			}
		}
	};
	
	/**
	 * Moves a node up in the data model
	 * 
	 * @param {object} oNode The JSON node representing a FieldListNode to be moved up
	 * @param {number} nLevelInAdjacenceList Depth of the node in the tree
	 * @param {Array} aAdjacenceList Adjacence List
	 * @private
	 */
	DialogContent.prototype._moveUpNode = function(oNode, nLevelInAdjacenceList, aAdjacenceList) {

		var oNewParent, nOldParentIndex;
		if (oNode.index !== 0) { // node found --> move up (simple case)
			oNode.parent.children.splice(oNode.index, 1);
			oNode.parent.children.splice(oNode.index - 1, 0, oNode);
			return;
		} else if (oNode.index === 0) { // move up (find new parent node)
			nOldParentIndex = aAdjacenceList[nLevelInAdjacenceList - 1].indexOf(oNode.parent);
			if (nOldParentIndex >= 1) {
				oNewParent = aAdjacenceList[nLevelInAdjacenceList - 1][nOldParentIndex - 1];
				if (oNewParent) {
					oNode.parent.children.splice(oNode.index, 1);
					oNewParent.children = oNewParent.children || [];
					oNewParent.children.push(oNode);
					return;
				}
			}
		}
	};
	
	/**
	 * Moves a node down to the bottom in the data model
	 * 
	 * @param {object} oNode The JSON node representing a FieldListNode to be moved down to the bottom
	 * @param {number} nLevelInAdjacenceList Depth of the node in the tree
	 * @param {Array} aAdjacenceList Adjacence List
	 * @private
	 */
	DialogContent.prototype._moveBottomNode = function(oNode, nLevelInAdjacenceList, aAdjacenceList) {

	
		var oNewParent, nOldParentIndex;
		if (oNode.index < oNode.parent.children.length - 1) { // node found --> move bottom (simple case)
			oNode.parent.children.splice(oNode.index, 1);
			oNode.parent.children.push(oNode);
			return;
		} else if (oNode.index === oNode.parent.children.length - 1) { // move bottom (find new parent node)
			nOldParentIndex = aAdjacenceList[nLevelInAdjacenceList - 1].indexOf(oNode.parent);
			if (nOldParentIndex > -1) {
				oNewParent = aAdjacenceList[nLevelInAdjacenceList - 1][nOldParentIndex + 1];
				if (oNewParent) {
					oNode.parent.children.splice(oNode.index, 1);
					oNewParent.children = oNewParent.children || [];
					oNewParent.children.push(oNode);
					return;
				}
			}
		}
	};
	
	/**
	 * Moves a node up to the top in the data model
	 * 
	 * @param {object} oNode The JSON node representing a FieldListNode to be moved up to the top
	 * @param {number} nLevelInAdjacenceList Depth of the node in the tree
	 * @param {Array} aAdjacenceList Adjacence List
	 * @private
	 */
	DialogContent.prototype._moveTopNode = function(oNode, nLevelInAdjacenceList, aAdjacenceList) {

	
		var oNewParent, nOldParentIndex;
		if (oNode.index !== 0) { // node found --> move top (simple case)
			oNode.parent.children.splice(oNode.index, 1);
			oNode.parent.children.splice(0, 0, oNode);
			return;
		} else if (oNode.index === 0) { // move top (find new parent node)
			nOldParentIndex = aAdjacenceList[nLevelInAdjacenceList - 1].indexOf(oNode.parent);
			if (nOldParentIndex >= 1) {
				oNewParent = aAdjacenceList[nLevelInAdjacenceList - 1][nOldParentIndex - 1];
				if (oNewParent) {
					oNode.parent.children.splice(oNode.index, 1);
					oNewParent.children = oNewParent.children || [];
					oNewParent.children.splice(0, 0, oNode);
					return;
				}
			}
		}
	};
	
	/**
	 * Moves a node down in the data model
	 * 
	 * @param {object} oData The data of the JSON model
	 * @param {String} sId The id of the node to be moved down
	 * @returns {object} Node in data model after move
	 * @private
	 */
	DialogContent.prototype._executeMoveDown = function(oData, sId) {

		return this._findNodeInDataModel(oData, sId, this._moveDownNode);
	};
	
	/**
	 * Moves a node up in the data model
	 * 
	 * @param {object} oData The data of the JSON model
	 * @param {String} sId The id of the node to be moved up
	 * @returns {object} Node in the data model after the move
	 * @private
	 */
	DialogContent.prototype._executeMoveUp = function(oData, sId) {

		return this._findNodeInDataModel(oData, sId, this._moveUpNode);
	};
	
	/**
	 * Moves a node down to the bottom in the data model
	 * 
	 * @param {object} oData The data of the JSON model
	 * @param {String} sId The id of the node to be moved down to the bottom
	 * @return {object} Bottom node in the data model
	 * @private
	 */
	DialogContent.prototype._executeMoveBottom = function(oData, sId) {

		return this._findNodeInDataModel(oData, sId, this._moveBottomNode);
	};
	
	/**
	 * Moves a node up to the top in the data model
	 * 
	 * @param {object} oData The data of the JSON model
	 * @param {String} sId The id of the node to be moved up to the top
	 * @returns {object} Top node in the data model
	 * @private
	 */
	DialogContent.prototype._executeMoveTop = function(oData, sId) {

		return this._findNodeInDataModel(oData, sId, this._moveTopNode);
	};
	
	/**
	 * Reads the selected field from the field selector and adds it to the data
	 * 
	 * @param {object} oData The data of the JSON model
	 * @private
	 */
	DialogContent.prototype._executeAddField = function(oData) {
		var oNewPosition, oNewNode;
		oNewPosition = this._getParentAndIndexNodeForNewField(oData);
	
		oNewNode = this._getNewNodeFromSelectedODataField(oData, this._getSelectedFieldFromFieldSelector());
		this._addField(oNewNode, oNewPosition.parent, oNewPosition.index);
	};
	
	/**
	 * Adds the new node to the specified position
	 * 
	 * @param {object} oNewNode The node to be added
	 * @param {object} oParentNode The new parent of the node
	 * @param {number} nIndex The position where the new node will be added into the parent's children collection. If undefined, the new node will be
	 *        appended as last node.
	 * @private
	 */
	DialogContent.prototype._addField = function(oNewNode, oParentNode, nIndex) {
	
		if (!oNewNode) {
			return;
		}
	
		// Add new field
		oParentNode.children = oParentNode.children || [];
		if (nIndex || nIndex === 0) {
			oParentNode.children.splice(nIndex, 0, oNewNode);
		} else {
			oParentNode.children.push(oNewNode);
		}
	};
	
	/**
	 * Gets the currently selected field from the OData Field Selector and creates and returns a new node which can be added to the model
	 * @param {object} oData	Data object
	 * @param {object} oSelectedField	Selected field instance
	 * @returns {object} The new node for the OData field
	 * @private
	 */
	DialogContent.prototype._getNewNodeFromSelectedODataField = function(oData, oSelectedField) {
		var bNodeAlreadyExists, oNewNode;
	
		if (!oSelectedField) {
			return null;
		}
	
	// create new entry
		oNewNode = {
			id: this._sViewId + oSelectedField.entityType + "_" + oSelectedField.name,
			entitySet: oSelectedField.entitySet,
			entityType: oSelectedField.entityType,
			label: oSelectedField.field, // "{" + oSelectedField.name + "/@sap:label}"
			valueProperty: "value",
			fieldValue: oSelectedField.name,
			jsType: "sap.ui.comp.smartfield.SmartField",
			isVisible: true,
			type: "field"
		};
	
	// check if the field was already created
		this._findNodeInDataModel(oData, oNewNode.id, function() {
			bNodeAlreadyExists = true;
		});
		if (bNodeAlreadyExists) {
			return null;
		}
	
		return oNewNode;
	};
	
	/**
	 * Gets the currently selected field from the OData Field Selector
	 * 
	 * @returns {object} Selected OData field as JSON object
	 * @private
	 */
	DialogContent.prototype._getSelectedFieldFromFieldSelector = function() {
		return this._oFieldSelector.getSelectedField();
	};
	
	/**
	 * Adds a new group as first element to the data
	 * 
	 * @param {object} oData The data of the JSON model
	 * @private
	 */
	DialogContent.prototype._executeAddGroup = function(oData) {
		var sText, oNewGroup;
		sText = this._textResources.getText("FORM_PERS_DIALOG_NEW_GROUP");
	
		// create new entry
		oNewGroup = {
			id: this._sViewId + jQuery.sap.uid(),
			label: sText,
			isVisible: true,
			type: "group",
			children: []
		};
	
		oData.children.splice(0, 0, oNewGroup); // Insert new group as first group
		this._changeSelection(oNewGroup);
	};
	
	DialogContent.prototype.exit = function() {
		if (this._oScrollView) {
			this._oScrollView.destroy();
			this._oScrollView = null;
		}
		if (this._oBtnMoveBottom) {
			this._oBtnMoveBottom.destroy();
			this._oBtnMoveBottom = null;
		}
		if (this._oBtnMoveDown) {
			this._oBtnMoveDown.destroy();
			this._oBtnMoveDown = null;
		}
		if (this._oBtnMoveUp) {
			this._oBtnMoveUp.destroy();
			this._oBtnMoveUp = null;
		}
		if (this._oBtnMoveTop) {
			this._oBtnMoveTop.destroy();
			this._oBtnMoveTop = null;
		}
		if (this._oBtnAddGroup) {
			this._oBtnAddGroup.destroy();
			this._oBtnAddGroup = null;
		}
		if (this._oBtnAddField) {
			this._oBtnAddField.destroy();
			this._oBtnAddField = null;
		}
	
		if (this._oFieldSelector) {
			this._oFieldSelector.destroy();
			this._oFieldSelector = null;
		}
		if (this.oLayoutRight) {
			this.oLayoutRight.destroy();
			this.oLayoutRight = null;
		}
		if (this.oLayoutMiddle) {
			this.oLayoutMiddle.destroy();
			this.oLayoutMiddle = null;
		}
		if (this.oLayoutTopLeft) {
			this.oLayoutTopLeft.destroy();
			this.oLayoutTopLeft = null;
		}
		if (this.oLayoutLeft) {
			this.oLayoutLeft.destroy();
			this.oLayoutLeft = null;
		}
		if (this.oLayout) {
			this.oLayout.destroy();
			this.oLayout = null;
		}
	
	};
	

	return DialogContent;

}, /* bExport= */ true);
