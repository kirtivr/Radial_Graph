/* eslint-disable strict */

/*
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides BaseController
sap.ui.define(['jquery.sap.global', 'sap/m/P13nItem', 'sap/ui/base/ManagedObject', './Util', 'sap/ui/table/Table'],
	function(jQuery, P13nItem, ManagedObject, Util, Table) {
	"use strict";


	/**
	 * The BaseController is a base class for personalization Controller like e.g. FilterController, SortController etc. *
	 * 
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class An abstract class for personalization Controllers.
	 * @extends sap.ui.base.ManagedObject
	 * @author SAP SE
	 * @version 1.25.0-SNAPSHOT *
	 * @constructor
	 * @public
	 * @since 1.28.0
	 * @alias sap.ui.comp.personalization.BaseController
	 */
	var BaseController = ManagedObject.extend("sap.ui.comp.personalization.BaseController",
	/** @lends sap.ui.comp.personalization.BaseController */
	{
		metadata: {
			"abstract": true,
			publicMethods: [
				"getPanel"
			],
			library: "sap.ui.comp",
			properties: {
				/**
				 * Controller type for generic use
				 * 
				 * @since 1.28.0
				 */
				type: {
					type: "sap.m.P13nPanelType",
					group: "Misc",
					defaultValue: null
				},
				/**
				 * Controller model. Each controller has its own name space as part of the entire model.
				 * 
				 * @since 1.28.0
				 */
				model: {
					type: "sap.ui.model.json.JSONModel",
					group: "Misc",
					defaultValue: null
				},
				/**
				 * @since 1.28.0
				 */
				persistentDataRestore: {
					type: "object",
					group: "Misc",
					defaultValue: null,
					visibility: "hidden"
				}
			},
			associations: {
				/**
				 * Table for which settings are applied.
				 * 
				 * @since 1.28.0
				 */
				table: {
					type: "sap.ui.core.Control",
					multiple: false
				}
			},
			events: {
				/**
				 * Event is raised before potential change on table will be applied
				 * 
				 * @since 1.28.0
				 */
				beforePotentialTableChange: {},
				/**
				 * Event is raised after potential change on table has be applied
				 * 
				 * @since 1.28.0
				 */
				afterPotentialTableChange: {}
			}
		}
	});
	
	/**
	 * Initialization hook.
	 * 
	 * @private
	 */
	BaseController.prototype.init = function() {
	};
	
	/**
	 * Load data - used for lazy loading
	 * 
	 * @protected
	 * @returns {function} to set the model data
	 */
	BaseController.prototype.setModelFunction = function() {
		var that = this;
		var fn = function() {
			if (!this.getModel()) {
				this.setModel(that.getModel());
			}
		};
		return fn;
	};
	
	/**
	 * Getter for association <code>table</code>
	 * 
	 * @returns {object} that represents sap.m.Table || sap.ui.table.Table
	 * @protected
	 */
	BaseController.prototype.getTable = function() {
		var oTable = this.getAssociation("table");
		if (typeof oTable === "string") {
			oTable = sap.ui.getCore().byId(oTable);
		}
		return oTable;
	};
	
	/**
	 * Creates persistent object
	 * 
	 * @param {array} aItems is a list of items that will be placed in the new created persistent structure
	 * @returns {object} JSON object
	 * @protected
	 */
	BaseController.prototype.createPersistentStructure = function(aItems) {
		aItems = aItems || [];
		var oPersistentData = {};
		oPersistentData[this.getType()] = {};
		oPersistentData[this.getType()][this.getType() + "Items"] = aItems;
		return oPersistentData;
	};
	
	/**
	 * Getter of persistent data object
	 * 
	 * @returns {object} JSON object
	 * @protected
	 */
	BaseController.prototype.getPersistentData = function() {
		var oData = this.getModel().getData();
		var oPersistentData = {};
		if (!oData.persistentData[this.getType()]) {
			oPersistentData = this.createPersistentStructure();
		} else {
			oPersistentData[this.getType()] = oData.persistentData[this.getType()];
		}
		return oPersistentData;
	};
	
	/**
	 * Setter of persistent data object *
	 * 
	 * @param {object} oDataNew contains the new data that will be set into model persistentData
	 * @protected
	 */
	BaseController.prototype.setPersistentData = function(oDataNew) {
		var oData = this.getModel().getData();
		oData.persistentData[this.getType()] = oDataNew[this.getType()];
	};
	
	/**
	 * Getter of persistent items data object
	 * 
	 * @returns {object} JSON object
	 * @protected
	 */
	BaseController.prototype.getPersistentDataItems = function() {
		return this.getPersistentData()[this.getType()][this.getType() + "Items"];
	};
	
	/**
	 * Setter of persistent items data object
	 * 
	 * @param {array} aItems is an array that contains the new items that will be set into model persistentData
	 * @protected
	 */
	BaseController.prototype.setPersistentDataItems = function(aItems) {
		this.setPersistentData(this.createPersistentStructure(aItems));
	};
	
	/**
	 * Getter of transient data object
	 * 
	 * @returns {object} JSON object
	 * @protected
	 */
	BaseController.prototype.getTransientData = function() {
		var oData = this.getModel().getData();
		var oTransientData = {};
		if (!oData.transientData[this.getType()]) {
			oTransientData[this.getType()] = {};
			oTransientData[this.getType()].title = this.getTitleText();
			oTransientData[this.getType()].items = [];
		} else {
			oTransientData[this.getType()] = oData.transientData[this.getType()];
		}
		return oTransientData;
	};
	
	/**
	 * Setter of transient data object
	 * 
	 * @param {object} oDataNew contains the new data that will be set into model transientData
	 * @protected
	 */
	BaseController.prototype.setTransientData = function(oDataNew) {
		var oData = this.getModel().getData();
		oData.transientData[this.getType()] = oDataNew[this.getType()];
	};
	
	/**
	 * Initialization of model
	 * 
	 * @param {object} oModel of type sap.ui.model.json.JSONModel that will be used for initialization
	 * @public
	 */
	BaseController.prototype.initializeModel = function(oModel) {
		this.setModel(oModel);
		this.setTransientData(this.getTransientData());
		this.setPersistentData(this.getPersistentData());
	};
	
	BaseController.prototype.createTableRestoreJson = function() {
		// TODO: this is not correct but the best we can do - problem is that the order in which we sort is not extractable from the table instance.
		// Consider to log error if more that one sort criteria
		this.setPersistentDataRestore(this._getTable2Json());
	};
	
	BaseController.prototype.getTableRestoreJson = function() {
		return Util.copy(this.getPersistentDataRestore());
	};
	
	/**
	 * only keep a columnItem if key is available in table
	 */
	BaseController.prototype.reducePersistentModel = function() {
		var oTable = this.getTable();
		if (!oTable) {
			return;
		}
	
		var aColumns = oTable.getColumns();
		var aItemsReduced = [];
		this.getPersistentDataItems().forEach(function(oItem) {
			var oColumn = Util.getColumn(oItem.columnKey, aColumns);
			if (oColumn) {
				aItemsReduced.push(oItem);
			}
		});
		this.setPersistentDataItems(aItemsReduced);
	};
	
	/**
	 * this method will make a complete json snapshot of the current table instance ("original") from the perspective of the columns controller; the json
	 * snapshot can later be applied to any table instance to recover all columns related infos of the "original" table TODO: This really only works for
	 * when max 1 sort criteria is defined since otherwise potentially order of sort criteria is destroyed
	 */
	BaseController.prototype._getTable2Json = function() {
	
	};
	
	BaseController.prototype.syncTable2PersistentModel = function() {
		// first put table representation into persistentData - full json representation
		// NOTE: This really only works for when max 1 sort criteria is defined since otherwise potentially order of sort
		// criteria is destroyed
		this.setPersistentData(this._getTable2Json());
	
		// NOTE: we leave persistentData in this form though for persistence we have too much data (compared to what we need to persist); reason is that
		// we wish to expose this data in the UI.
	};
	
	BaseController.prototype.syncTable2TransientModel = function() {
	};
	
	BaseController.prototype.getPanel = function() {
	};
	
	/**
	 * hook to apply made changes. The "oPayload" object can be used by subclasses.
	 * 
	 * @param {object} oPayload is an object that contains additional data, which can be filled by the connected panels  
	 * @public
	 * @name BaseController#onAfterSubmit
	 * @function
	 */
	BaseController.prototype.onAfterSubmit = function(oPayload) {
		this.syncJsonModel2Table(this.getModel().getData().persistentData);
	};

	/**
	 * This method is called from Controller after Reset button was executed. This method is a base
	 * implementation and it is optional to re-implement it in the specific sub-controller
	 * 
	 * @param {object} oPayload is an object that contains additional data, which can be filled by the connected panels 
	 * @public
	 * @name BaseController#onAfterReset
	 * @function
	 */
	BaseController.prototype.onAfterReset = function(oPayload) {
	};
	
	BaseController.prototype.syncJsonModel2Table = function(oJsonModel) {
	};
	
	/**
	 * Operations on sorting are processed sometime directly at the table and sometime not. In case that something has been changed via Personalization
	 * Dialog the consumer of the Personalization Dialog has to apply sorting at the table. In case that sorting has been changed via user interaction at
	 * table, the change is instantly applied at the table.
	 * 
	 * @param {object} oPersistentDataBase JSON object
	 * @param {object} oPersistentDataCompare JSON object 
	 */
	BaseController.prototype.getChangeType = function(oPersistentDataBase, oPersistentDataCompare) {
	};
	
	/**
	 * Result is XOR based difference = oPersistentDataBase - oPersistentDataCompare
	 * 
	 * @param {object} oPersistentDataBase JSON object.
	 * @param {object} oPersistentDataCompare JSON object. Note: if sortItems is [] then it means that all sortItems have been deleted 
	 */
	BaseController.prototype.getChangeData = function(oPersistentDataBase, oPersistentDataCompare) {
	};
	
	/**
	 * @param {object} oPersistentDataBase: JSON object to which different properties from JSON oPersistentDataCompare are added
	 * @param {object} oPersistentDataCompare: JSON object from where the different properties are added to oPersistentDataBase. Note: if sortItems is []
	 *        then it means that all sortItems have been deleted
	 */
	BaseController.prototype.getUnionData = function(oPersistentDataBase, oPersistentDataCompare) {
	};
	
	/**
	 * Cleans up before destruction.
	 * 
	 * @private
	 */
	BaseController.prototype.exit = function() {
	};
	
	/* eslint-enable strict */
	

	return BaseController;

}, /* bExport= */ true);
