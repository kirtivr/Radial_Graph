/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// -----------------------------------------------------------------------------
// Generates the data-model required for SmartFilter using SAP-Annotations metadata
// -----------------------------------------------------------------------------
sap.ui.define([
	'jquery.sap.global', 'sap/m/ComboBox', 'sap/m/DatePicker', 'sap/m/DateRangeSelection', 'sap/m/Input', 'sap/m/MultiComboBox', 'sap/m/MultiInput', 'sap/m/SearchField', 'sap/m/Token', 'sap/ui/comp/odata/MetadataAnalyser', 'sap/ui/comp/providers/ValueHelpProvider', 'sap/ui/comp/providers/ValueListProvider', 'sap/ui/model/Filter', 'sap/ui/model/json/JSONModel', 'sap/ui/model/type/Float'
], function(jQuery, ComboBox, DatePicker, DateRangeSelection, Input, MultiComboBox, MultiInput, SearchField, Token, MetadataAnalyser, ValueHelpProvider, ValueListProvider, Filter, JSONModel, Float) {
	"use strict";

	/**
	 * Constructs a class to generate the view/datamodel metadata for the SmartFilterBar from the SAP-Annotations metadata
	 * 
	 * @constructor
	 * @experimental This module is only for internal/experimental use!
	 * @public
	 * @param {object} mPropertyBag - PropertyBag having members model, serviceUrl, entityType, additionalConfiguration
	 * @author Pavan Nayak, Thomas Biesemann
	 */
	var FilterProvider = function(mPropertyBag) {
		if (mPropertyBag) {
			this._oParentODataModel = mPropertyBag.model;
			this._sServiceURL = mPropertyBag.serviceUrl;
			this._sBasicSearchFieldName = mPropertyBag.basicSearchFieldName;
			this.sEntityType = mPropertyBag.entityType;
			this._isRunningInValueHelpDialog = mPropertyBag.isRunningInValueHelpDialog;
			this._oAdditionalConfiguration = mPropertyBag.additionalConfiguration;
			this.sDefaultDropDownDisplayBehaviour = mPropertyBag.defaultDropDownDisplayBehaviour;
			if (!this.sDefaultDropDownDisplayBehaviour || this.sDefaultDropDownDisplayBehaviour === sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR.auto) {
				this.sDefaultDropDownDisplayBehaviour = sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR.descriptionOnly;
			}
			this.sDefaultTokenDisplayBehaviour = mPropertyBag.defaultTokenDisplayBehaviour;
			if (!this.sDefaultTokenDisplayBehaviour || this.sDefaultTokenDisplayBehaviour === sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR.auto) {
				this.sDefaultTokenDisplayBehaviour = sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR.descriptionAndId;
			}
			if (typeof mPropertyBag.dateFormatSettings === "string") {
				try {
					this._oDateFormatSettings = mPropertyBag.dateFormatSettings ? JSON.parse(mPropertyBag.dateFormatSettings) : undefined;
				} catch (ex) {
					// Invalid dateformat provided!
				}
			} else {
				this._oDateFormatSettings = mPropertyBag.dateFormatSettings;
			}
			// Used for IN param handling (visible field)
			// TODO: CleanUp - a better handling
			this._oSmartFilter = mPropertyBag.smartFilter;
		}
		this.sFilterModelName = FilterProvider.FILTER_MODEL_NAME;
		this._sBasicFilterAreaID = FilterProvider.BASIC_FILTER_AREA_ID;
		this._aFilterBarViewMetadata = [];
		this._aFilterBarMultiValueFieldMetadata = [];
		this._aFilterBarDateFieldNames = [];
		// Array of FieldGroups from FieldGroup annotations
		this._aFieldGroupAnnotation = [];
		this._oMetadataAnalyser = new MetadataAnalyser(this._oParentODataModel || this._sServiceURL);
		// Initialise the model early so this can already be passed to the necessary helper classes --> Ex: BaseValueListProvider
		this.oModel = new JSONModel();
		// TODO: Loop over and destroy these on destroying this object!
		this._aValueListProvider = [];
		this._aValueHelpDialogProvider = [];
		this._intialiseMetadata();
	};

	FilterProvider.FILTER_MODEL_NAME = "fi1t3rM0d31";
	FilterProvider.BASIC_FILTER_AREA_ID = "_BASIC";
	FilterProvider.BASIC_SEARCH_FIELD_ID = "_BASIC_SEARCH_FIELD";
	FilterProvider.CUSTOM_FIELDS_MODEL_PROPERTY = "_CUSTOM";

	/**
	 * Initialises the necessary filter metadata and model
	 * 
	 * @private
	 */
	FilterProvider.prototype._intialiseMetadata = function() {
		var iGroupLen, iFieldLen, oODataFilterGroup, aODataFilterGroups, i, j, oFieldMetadata, oGroupMetadata, aCustomFilterField, aCustomGroup;
		// first, create a Basic Area Group (groupId/groupName shall be "_BASIC")
		this._aFilterBarViewMetadata.push({
			groupName: this._sBasicFilterAreaID,
			index: 0, // should be the 1st group on the UI
			fields: []
		});
		// Store name without namespace to determine the main entity (used for association filter expression)
		this.sEntityTypeName = this._oMetadataAnalyser.removeNamespace(this.sEntityType);
		aODataFilterGroups = this._oMetadataAnalyser.getAllFilterableFieldsByEntityTypeName(this.sEntityType);
		if (aODataFilterGroups) {
			// Get the array of FieldGroup annotations
			this._aFieldGroupAnnotation = this._oMetadataAnalyser.getFieldGroupAnnotation(this.sEntityType);

			// Create groups based on FieldGroup annotation
			if (this._aFieldGroupAnnotation) {
				iGroupLen = this._aFieldGroupAnnotation.length;
				for (i = 0; i < iGroupLen; i++) {
					// Create metadata for group
					oODataFilterGroup = this._aFieldGroupAnnotation[i];
					oGroupMetadata = this._createGroupMetadata(oODataFilterGroup);
					oGroupMetadata.index = this._aFilterBarViewMetadata.length; // Set the index to maintain the order
					this._aFilterBarViewMetadata.push(oGroupMetadata);
				}
			}

			// Create groups and fields based on entity metadata
			iGroupLen = aODataFilterGroups.length;
			for (i = 0; i < iGroupLen; i++) {
				// Create metadata for group
				oODataFilterGroup = aODataFilterGroups[i];
				iFieldLen = oODataFilterGroup.fields.length;
				oGroupMetadata = this._createGroupMetadata(oODataFilterGroup);
				this._aFilterBarViewMetadata.push(oGroupMetadata);

				// Create metadata for fields
				for (j = 0; j < iFieldLen; j++) {
					oFieldMetadata = this._createFieldMetadata(oODataFilterGroup.fields[j]);
					oGroupMetadata.fields.push(oFieldMetadata);
				}
			}
		}

		// custom groups
		aCustomGroup = this._getAdditionalConfigurationForCustomGroups(aODataFilterGroups);
		iGroupLen = aCustomGroup.length;
		for (j = 0; j < iGroupLen; j++) {
			oGroupMetadata = this._createGroupMetadataForCustomGroup(aCustomGroup[j]);
			if (oGroupMetadata) {
				this._aFilterBarViewMetadata.push(oGroupMetadata);
			}
		}

		// custom filter fields
		aCustomFilterField = this._getAdditionalConfigurationForCustomFilterFields();
		iFieldLen = aCustomFilterField.length;
		for (j = 0; j < iFieldLen; j++) {
			oFieldMetadata = this._createFieldMetadataForCustomFilterFields(aCustomFilterField[j]);
			if (oFieldMetadata) {
				this._aFilterBarViewMetadata[0].fields.push(oFieldMetadata);
			}
		}

		// Basic search
		if (this._hasBasicSearch()) {
			oFieldMetadata = this._createBasicSearchFieldMetadata();
			this._aFilterBarViewMetadata[0].fields.push(oFieldMetadata);
		}

		this._applyGroupId();
		this._applyIndexes();
		this._createInitialModel(true);
	};

	/**
	 * Returns a flag indicating whether a field for the basic search shall be rendered or not
	 * 
	 * @returns {boolean} Flag
	 * @private
	 */
	FilterProvider.prototype._hasBasicSearch = function() {
		return !!this._sBasicSearchFieldName;
	};

	/**
	 * Looks for custom filter fields from the additional configuration which have a name which is not known in the ODATA metadata
	 * 
	 * @returns {Array} Array containing the the control configuration of the additional filter fields
	 * @private
	 */
	FilterProvider.prototype._getAdditionalConfigurationForCustomFilterFields = function() {
		var aControlConfiguration, length, nODataFilterFieldKeyLength, i, aResult, j, bFound, aODataFilterFieldName;

		// get additional control configuration
		if (!this._oAdditionalConfiguration) {
			return [];
		}
		aControlConfiguration = this._oAdditionalConfiguration.getControlConfiguration();

		// get field names from OData metadata
		aODataFilterFieldName = this._oMetadataAnalyser.getAllFilterableFieldNamesByEntityTypeName(this.sEntityType);
		if (!aODataFilterFieldName || !aODataFilterFieldName.length) {
			return aControlConfiguration;
		}

		aResult = [];
		nODataFilterFieldKeyLength = aODataFilterFieldName.length;
		length = aControlConfiguration.length;
		for (i = 0; i < length; i++) {
			bFound = false;
			for (j = 0; j < nODataFilterFieldKeyLength; j++) {
				if (aODataFilterFieldName[j] === aControlConfiguration[i].key) {
					bFound = true;
					break;
				}
			}
			if (!bFound) { // filter field for control configuration could not be found in OData metadata...this is a custom filter field!
				aResult.push(aControlConfiguration[i]);
			}
		}

		return aResult;
	};

	/**
	 * Looks for custom groups from the additional configuration which have a name which is not known in the ODATA metadata
	 * 
	 * @param {object} aODataFilterGroups - groups from the ODATA metadata
	 * @returns {Array} Array containing the the group configuration of the custom groups
	 * @private
	 */
	FilterProvider.prototype._getAdditionalConfigurationForCustomGroups = function(aODataFilterGroups) {
		var aGroupConfiguration, length, nODataGroupsLength, i, aResult, j, bFound;

		// get additional group configuration
		if (!this._oAdditionalConfiguration) {
			return [];
		}
		aGroupConfiguration = this._oAdditionalConfiguration.getGroupConfiguration();

		// get groups from OData metadata
		if (!aODataFilterGroups || !aODataFilterGroups.length) {
			return aGroupConfiguration;
		}

		aResult = [];
		nODataGroupsLength = aODataFilterGroups.length;
		length = aGroupConfiguration.length;
		for (i = 0; i < length; i++) {
			bFound = false;
			for (j = 0; j < nODataGroupsLength; j++) {
				if (aODataFilterGroups[j].groupName === aGroupConfiguration[i].key) {
					bFound = true;
					break;
				}
			}
			if (!bFound) { // group from group configuration could not be found in OData metadata...this is a custom group!
				aResult.push(aGroupConfiguration[i]);
			}
		}

		return aResult;
	};

	/**
	 * Initialises the necessary filter metadata and model
	 * 
	 * @param {object} oJSONData - The JSON data from the model
	 * @param {object} oFilterFieldMetadata - The metadata for the filter field
	 * @private
	 */
	FilterProvider.prototype._createInitialModelForField = function(oJSONData, oFilterFieldMetadata, bUseDefaultValues) {
		var aDefaultFilterValues, oDefaultFilterValue, bHasDefaultFilterValue = false, bIsRangeField = false, sLowValue = null, sHighValue = null, iLength, oItem = null, aItems = [], aRanges = [];
		// Model will no be created for custom filter fields..
		if (!oFilterFieldMetadata || oFilterFieldMetadata.isCustomFilterField) {
			return;
		}
		if (oFilterFieldMetadata.filterRestriction !== sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.multiple) {
			bIsRangeField = true;
		}
		if (bUseDefaultValues) {
			// Get the array of default filter values
			aDefaultFilterValues = oFilterFieldMetadata.defaultFilterValues;
			bHasDefaultFilterValue = aDefaultFilterValues && aDefaultFilterValues.length;
		}
		if (oFilterFieldMetadata.filterRestriction === sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.single) {
			// If there is a default filter value use only the low value of 1st one --> single filter scenario!
			if (bHasDefaultFilterValue) {
				oDefaultFilterValue = aDefaultFilterValues[0];
				sLowValue = oDefaultFilterValue.low;
			}
			oJSONData[oFilterFieldMetadata.fieldName] = sLowValue;

		} else if (oFilterFieldMetadata.filterRestriction === sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.interval) {
			// If there is a default filter value use both low and high, but only of the 1st one --> interval filter scenario!
			if (bHasDefaultFilterValue) {
				oDefaultFilterValue = aDefaultFilterValues[0];
				sLowValue = oDefaultFilterValue.low;
				sHighValue = oDefaultFilterValue.high;
			}
			oJSONData[oFilterFieldMetadata.fieldName] = {
				low: sLowValue,
				high: sHighValue
			};
		} else {
			// If there is a default filter value use all the low values as keys --> multiple/range
			if (bHasDefaultFilterValue) {
				iLength = aDefaultFilterValues.length;
				while (iLength--) {
					oDefaultFilterValue = aDefaultFilterValues[iLength];
					if (bIsRangeField) {
						oItem = {
							"exclude": oDefaultFilterValue.sign === "E",
							"operation": oDefaultFilterValue.operator,
							"keyField": oFilterFieldMetadata.fieldName,
							"value1": oDefaultFilterValue.low,
							"value2": oDefaultFilterValue.high
						};

					} else {
						oItem = {
							key: oDefaultFilterValue.low,
							text: oDefaultFilterValue.low
						};
					}

					aItems.push(oItem);
				}
			}
			// Add this to the local multi-value field array
			this._aFilterBarMultiValueFieldMetadata.push(oFilterFieldMetadata);
			// Update the model
			oJSONData[oFilterFieldMetadata.fieldName] = {
				value: null
			};
			if (bIsRangeField) {
				aRanges = aItems.slice(0);
				aItems = [];
				oJSONData[oFilterFieldMetadata.fieldName].ranges = aRanges;
			}
			oJSONData[oFilterFieldMetadata.fieldName].items = aItems;

			// Update the corresponding control with array value
			this._updateMultiValueControl(oFilterFieldMetadata.control, aItems, aRanges);
		}
	};

	/**
	 * Initialises the JSON model for filter fields
	 * 
	 * @private
	 */
	FilterProvider.prototype._createInitialModel = function(bUseDefaultValues) {
		var oJSONData, iGroupLength, iFieldLength, oGroup, j, i;
		oJSONData = {};
		// This will now be recreated if required
		this._aFilterBarMultiValueFieldMetadata = [];
		if (this._aFilterBarViewMetadata) {
			iGroupLength = this._aFilterBarViewMetadata.length;
			for (i = 0; i < iGroupLength; i++) {
				oGroup = this._aFilterBarViewMetadata[i];
				iFieldLength = oGroup.fields.length;
				for (j = 0; j < iFieldLength; j++) {
					this._createInitialModelForField(oJSONData, oGroup.fields[j], bUseDefaultValues);
				}
			}
		}
		this.oModel.setData(oJSONData);
	};

	/**
	 * Updates the multi-value control with initial/filter data
	 * 
	 * @param {object} oControl - the control to be updated
	 * @param {Array} aItems = the array of key, text values to be set in the control
	 * @private
	 */
	FilterProvider.prototype._updateMultiValueControl = function(oControl, aItems, aRanges) {
		var i = 0, aTokens = null, oToken = null, oRange = null, sText = null, aKeys = null;
		// MultiComboBox and MultiInput fields cannot be bound, since the tokens are created internally and do not support 2 way binding
		// In case the model is reset/set initially, set the tokens manually through this
		if (oControl && aItems) {
			i = aItems.length;
			if (oControl instanceof MultiInput) {
				aTokens = [];
				while (i--) {
					sText = aItems[i].text || aItems[i].key;
					aTokens.push(new Token({
						key: aItems[i].key,
						text: sText,
						tooltip: sText
					}));
				}
				if (aRanges) {
					i = aRanges.length;
					while (i--) {
						oRange = aRanges[i];

						sText = FilterProvider.getFormattedRangeText(oRange.operation, oRange.value1, oRange.value2, oRange.exclude);
						oToken = new Token({
							key: sText,
							text: sText,
							tooltip: sText
						});
						oToken.data("range", oRange);
						aTokens.push(oToken);
					}
				}
				oControl.setTokens(aTokens);
			}
			if (oControl instanceof MultiComboBox) {
				aKeys = [];
				while (i--) {
					aKeys.push(aItems[i].key);
				}
				oControl.setSelectedKeys(aKeys);
			}
		}
	};

	/**
	 * Updates the view metadata by applying index of groups and fields from the additional configuration.
	 * 
	 * @private
	 */
	FilterProvider.prototype._applyIndexes = function() {
		var groupLength, i;

		if (!this._aFilterBarViewMetadata) {
			return;
		}

		// sort groups by index
		this._aFilterBarViewMetadata = this._sortByIndex(this._aFilterBarViewMetadata);

		groupLength = this._aFilterBarViewMetadata.length;
		for (i = 0; i < groupLength; i++) {
			// sort fields of a group by index
			if (this._aFilterBarViewMetadata[i].fields) {
				this._aFilterBarViewMetadata[i].fields = this._sortByIndex(this._aFilterBarViewMetadata[i].fields);
			}
		}
	};

	/**
	 * Returns a new Array containing all Elements from the incoming Array and the order was changed considering the indexes
	 * 
	 * @param {Array} aArray - Array of objects having an index property
	 * @returns {Array} sorted array
	 * @private
	 */
	FilterProvider.prototype._sortByIndex = function(aArray) {
		var aFieldsHavingAnIndex, i, length, j, length2, aResult;

		if (!aArray || !aArray.length) {
			return aArray;
		}
		aResult = [];
		aFieldsHavingAnIndex = [];
		length = aArray.length;
		for (i = 0; i < length; i++) {
			if (parseInt(aArray[i].index, 10) || aArray[i].index === 0) {
				if (aFieldsHavingAnIndex.length === 0) {
					aFieldsHavingAnIndex.push(aArray[i]);
				} else {
					length2 = aFieldsHavingAnIndex.length;
					for (j = 0; j < length2; j++) {
						if (aFieldsHavingAnIndex[j].index > aArray[i].index) {
							aFieldsHavingAnIndex.splice(j, 0, aArray[i]);
							break;
						} else if (j + 1 === aFieldsHavingAnIndex.length) {
							aFieldsHavingAnIndex.push(aArray[i]);
							break;
						}
					}
				}
			} else {
				aResult.push(aArray[i]); // fields having no index...
			}
		}

		length = aFieldsHavingAnIndex.length;
		for (i = 0; i < length; i++) {
			if (aFieldsHavingAnIndex[i].index > aResult.length) {
				aResult.push(aFieldsHavingAnIndex[i]);
			} else {
				aResult.splice(aFieldsHavingAnIndex[i].index, 0, aFieldsHavingAnIndex[i]);
			}
		}
		return aResult;
	};

	/**
	 * Updates the view metadata by applying the groupId from the additional configuration.
	 * 
	 * @private
	 */
	FilterProvider.prototype._applyGroupId = function() {
		var groupLength, i, fieldLength, j, oField, oNewParentGroup, k;
		groupLength = this._aFilterBarViewMetadata.length;

		for (i = 0; i < groupLength; i++) {
			if (!this._aFilterBarViewMetadata[i].fields) { // if there are no fields...
				continue;
			}
			fieldLength = this._aFilterBarViewMetadata[i].fields.length;
			for (j = 0; j < fieldLength; j++) {
				oField = this._aFilterBarViewMetadata[i].fields[j];
				if (oField && oField.groupId && oField.groupId !== this._aFilterBarViewMetadata[i].groupName) {
					// Find new parent group
					oNewParentGroup = undefined;
					for (k = 0; k < groupLength; k++) {
						if (this._aFilterBarViewMetadata[k].groupName === oField.groupId) {
							oNewParentGroup = this._aFilterBarViewMetadata[k];
							break;
						}
					}

					// Move field to new parent group
					if (oNewParentGroup) {
						this._aFilterBarViewMetadata[i].fields.splice(j, 1);
						j--;
						fieldLength--;
						oNewParentGroup.fields = oNewParentGroup.fields || [];
						oNewParentGroup.fields.push(oField);
					}
				}
			}
		}
	};

	/**
	 * Creates a group based on the OData metadata
	 * 
	 * @private
	 * @param {object} oODataFilterBarGroup - OData metadata for group
	 * @returns {object} view metadata for group
	 */
	FilterProvider.prototype._createGroupMetadata = function(oODataFilterBarGroup) {
		var oGroupMetadata, oGroupConfiguration;

		// Get additional configuration for groups
		oGroupConfiguration = this._oAdditionalConfiguration.getGroupConfigurationByKey(oODataFilterBarGroup.groupName);

		oGroupMetadata = {};
		oGroupMetadata.groupName = oODataFilterBarGroup.groupName;
		oGroupMetadata.groupLabel = this._getGroupLabel(oODataFilterBarGroup, oGroupConfiguration); // if label is specified in additional
		// configuration,
		// pick this
		// one
		oGroupMetadata.fields = [];
		oGroupMetadata.index = this._getGroupIndex(oGroupConfiguration);

		return oGroupMetadata;
	};

	/**
	 * Creates a group based on the additional configuration (GroupConfiguration)
	 * 
	 * @private
	 * @param {object} oGroupConfiguration - OData metadata for group
	 * @returns {object} view metadata for group
	 */
	FilterProvider.prototype._createGroupMetadataForCustomGroup = function(oGroupConfiguration) {
		var oGroupMetadata;

		oGroupMetadata = {};
		oGroupMetadata.groupName = oGroupConfiguration.key;
		oGroupMetadata.groupLabel = oGroupConfiguration.label;
		// one
		oGroupMetadata.fields = [];
		oGroupMetadata.index = this._getGroupIndex(oGroupConfiguration);

		return oGroupMetadata;
	};

	/**
	 * Creates the control instance based on the OData Metadata and additional configuration
	 * 
	 * @param {object} oFieldViewMetadata - resolved filter view data with OData metadata and control configuration
	 * @returns an instance of the control to be used in the SmartFilterBar
	 * @private
	 */
	FilterProvider.prototype._createControl = function(oFieldViewMetadata) {
		var oControl, oType, bIsInterval = false, oFloatFormatOptions, fClearModel;

		// if a custom control is specified, use it
		if (oFieldViewMetadata.customControl) {
			return oFieldViewMetadata.customControl;
		}

		// Set type to float for decimal fields!
		if (oFieldViewMetadata.type === "Edm.Decimal") {
			if (oFieldViewMetadata.precision || oFieldViewMetadata.scale) {
				oFloatFormatOptions = {};
				if (oFieldViewMetadata.precision) {
					oFloatFormatOptions["maxIntegerDigits"] = parseInt(oFieldViewMetadata.precision, 10);
				}
				if (oFieldViewMetadata.scale) {
					oFloatFormatOptions["maxFractionDigits"] = parseInt(oFieldViewMetadata.scale, 10);
				}
			}

			oType = new Float(oFloatFormatOptions);
		}

		oControl = new oFieldViewMetadata.fControlConstructor();
		if (oFieldViewMetadata.fControlConstructor === DateRangeSelection) {
			oControl.bindProperty('dateValue', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/low");
			oControl.bindProperty('secondDateValue', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/high");
		} else if (oFieldViewMetadata.fControlConstructor === ComboBox) {
			if (oControl.setForceSelection) {
				oControl.setForceSelection(true);
			}
			this._associateValueList(oControl, "items", oFieldViewMetadata);
			oControl.bindProperty('selectedKey', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName);
		} else if (oFieldViewMetadata.fControlConstructor === MultiComboBox) {
			this._associateValueList(oControl, "items", oFieldViewMetadata);
			// Listen to the selection change and update the model accordingly
			oControl.attachSelectionChange(jQuery.proxy(function(oEvt) {
				var oCtrl = oEvt.getSource(), aSelectedItems = null, aKeys = [], iLength;
				aSelectedItems = oCtrl.getSelectedItems();
				if (aSelectedItems) {
					iLength = aSelectedItems.length;
					while (iLength--) {
						aKeys.push({
							key: aSelectedItems[iLength].getKey(),
							text: aSelectedItems[iLength].getText()
						});
					}
				}
				if (this.oModel) {
					this.oModel.setProperty("/" + oFieldViewMetadata.fieldName + "/items", aKeys);
				}
				// Manually trigger the change event on sapUI5 control since it doesn't do this internally on setValue!
				oCtrl.fireChange({
					value: ""
				});
			}, this));
			oControl.bindProperty('value', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/value");
		} else if (oFieldViewMetadata.fControlConstructor === MultiInput) {
			if (oFieldViewMetadata.hasValueHelpDialog) {
				this._associateValueHelpDialog(oControl, oFieldViewMetadata, oFieldViewMetadata.filterRestriction !== sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.multiple, true);
			} else {
				oControl.setShowValueHelp(false);
			}
			//oControl.setEnableMultiLineMode(true);
			oControl.bindProperty('value', {
				path: this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/value",
				type: oType
			});
		} else if (oFieldViewMetadata.fControlConstructor === Input) {
			if (oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.interval) {
				bIsInterval = true;
				// we assume the interval values shall be split by "-"; so bind only to low and resolve this later while creating the filters
				oControl.bindProperty('value', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName + "/low");
				if (!this.oResourceBundle) {
					this.oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");
				}
				if (!this.sIntervalPlaceholder) {
					this.sIntervalPlaceholder = this.oResourceBundle.getText("INTERVAL_PLACEHOLDER_TEXT");
				}
				oControl.setPlaceholder(this.sIntervalPlaceholder);
			} else {
				oControl.bindProperty('value', {
					path: this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName,
					type: oType
				});
			}
			if (oFieldViewMetadata.hasValueHelpDialog) {
				oControl.setShowValueHelp(true);
				this._associateValueHelpDialog(oControl, oFieldViewMetadata, false, false);
			}
		} else if (oFieldViewMetadata.fControlConstructor === DatePicker) {
			oControl.bindProperty('dateValue', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName);
		}

		if (this._oDateFormatSettings && this._oDateFormatSettings.style && oControl instanceof DatePicker) {
			oControl.setDisplayFormat(this._oDateFormatSettings.style);
		}

		if (oFieldViewMetadata.hasTypeAhead) {
			oControl.setShowSuggestion(true);
			oControl.setFilterSuggests(false);
			this._associateValueList(oControl, "suggestionRows", oFieldViewMetadata, true);
		}

		// Convert typed in values to UpperCase for displayFormat = UpperCase
		if (oFieldViewMetadata.displayFormat === "UpperCase" && oControl.attachChange && oControl.setValue) {
			oControl.attachChange(function() {
				var sValue = oControl.getValue();
				if (sValue) {
					oControl.setValue(sValue.toUpperCase());
				}
			});
		}

		// Additional handling for Input and MultiInput
		if (oControl instanceof Input) {
			// Set MaxLength for fields without any ValueListAnnotation or non intervals!
			if (!oFieldViewMetadata.oValueListAnnotation && !bIsInterval && oFieldViewMetadata.maxLength) {
				oControl.setMaxLength(parseInt(oFieldViewMetadata.maxLength, 10));
			}

			// Special handling when users clears the value or enters an invalid one
			if (oType) {
				fClearModel = jQuery.proxy(function(oEvent) {
					var oBindingInfo, oException, sState;
					// Empty Value is valid for filters
					if (oEvent.getParameter("newValue") === "") {
						sState = sap.ui.core.ValueState.None;
						if (oEvent.getParameter("property") === "value") {
							oBindingInfo = oControl.getBindingInfo("value");
							if (oBindingInfo && oBindingInfo.binding) {
								this.oModel.setProperty(oBindingInfo.binding.getPath(), null);
							}
						}
					} else {
						sState = sap.ui.core.ValueState.Error;
						oException = oEvent.getParameter("exception");
						if (oException) {
							if (oControl.setValueStateText) {
								oControl.setValueStateText(oException.message);
							}
						}
					}
					if (oControl && oControl.setValueState) {
						oControl.setValueState(sState);
					}
				}, this);
				oControl.attachParseError(fClearModel);
				oControl.attachFormatError(fClearModel);
				oControl.attachValidationError(fClearModel);
				oControl.attachValidationSuccess(function(oEvent) {
					if (oControl && oControl.setValueState) {
						oControl.setValueState(sap.ui.core.ValueState.None);
					}
				});
			}
		}

		return oControl;
	};

	/**
	 * Creates the control instance based on the OData Metadata and additional configuration
	 * 
	 * @param {object} oFieldViewMetadata - view metadata for the filter field
	 * @returns {function} - the constructor function of the control
	 * @private
	 */
	FilterProvider.prototype._getControlConstructor = function(oFieldViewMetadata) {
		// default to input
		var fControlConstructor = Input, bFilterRestrictionSingle, bFilterRestrictionInterval;

		// if a custom control is specified, use it
		if (oFieldViewMetadata.isCustomFilterField) {
			return;
		}

		bFilterRestrictionSingle = (oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.single);
		bFilterRestrictionInterval = (oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.interval);

		if (oFieldViewMetadata.controlType === sap.ui.comp.smartfilterbar.ControlConfiguration.CONTROLTYPE.date) {
			fControlConstructor = (bFilterRestrictionInterval) ? DateRangeSelection : DatePicker;
			// Filter Restriction is defaulted to auto, reset it to single if it is a date filter
			if (!bFilterRestrictionInterval) {
				oFieldViewMetadata.filterRestriction = sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.single;
			}
			this._aFilterBarDateFieldNames.push(oFieldViewMetadata.fieldName); // Date fields need special handling to always store Date objects
		} else if (oFieldViewMetadata.controlType === sap.ui.comp.smartfilterbar.ControlConfiguration.CONTROLTYPE.dropDownList) {
			fControlConstructor = (bFilterRestrictionSingle) ? ComboBox : MultiComboBox;
			// Filter Restriction is defaulted to auto, reset it to multiple if it is a MultiComboBox
			if (!bFilterRestrictionSingle) {
				oFieldViewMetadata.filterRestriction = sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.multiple;
			}
		} else if (!bFilterRestrictionSingle && !bFilterRestrictionInterval) {
			fControlConstructor = MultiInput;
		}
		return fControlConstructor;
	};

	/**
	 * Associates the control with a ValueHelp Dialog using the details retrieved from the metadata (annotation)
	 * 
	 * @param {object} oControl - The control
	 * @param {object} oFieldViewMetadata - The metadata merged from OData metadata and additional control configuration
	 * @param {boolean} bSupportRanges - Specify if the ValueHelpDialog supports ranges
	 * @param {boolean} bSupportMultiselect - Specify if the ValueHelpDialog supports multi select
	 * @private
	 */
	FilterProvider.prototype._associateValueHelpDialog = function(oControl, oFieldViewMetadata, bSupportRanges, bSupportMultiselect) {
		var oValueHelpDialogProvider;

		oValueHelpDialogProvider = new ValueHelpProvider({
			annotation: oFieldViewMetadata.oValueListAnnotation,
			additionalAnnotations: oFieldViewMetadata.additionalAnnotations,
			control: oControl,
			filterModel: this.oModel,
			filterProvider: this,
			model: this._oParentODataModel,
			preventInitialDataFetchInValueHelpDialog: oFieldViewMetadata.preventInitialDataFetchInValueHelpDialog,
			supportMultiSelect: bSupportMultiselect,
			supportRanges: bSupportRanges,
			isSingleIntervalRange: oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.interval,
			fieldName: oFieldViewMetadata.fieldName,
			type: oFieldViewMetadata.type,
			maxLength: oFieldViewMetadata.maxLength,
			displayFormat: oFieldViewMetadata.displayFormat,
			displayBehaviour: oFieldViewMetadata.displayBehaviour,
			title: oFieldViewMetadata.label
		});
		this._aValueHelpDialogProvider.push(oValueHelpDialogProvider);

		if (bSupportMultiselect) {
			oControl.attachTokenChange(jQuery.proxy(function(oEvt) {
				var aTokens = oEvt.getSource().getTokens(), aItems = [], iLength, oToken = null, oRangeData = null, aRanges = [];
				if (aTokens) {
					iLength = aTokens.length;
					while (iLength--) {
						oToken = aTokens[iLength];
						oRangeData = oToken.data("range");
						// Check if token is a range token
						if (oRangeData) {
							aRanges.push(oRangeData);
						} else {
							// Items array
							aItems.push({
								key: oToken.getKey(),
								text: oToken.getText()
							});
						}
					}
				}
				if (this.oModel) {
					this.oModel.setProperty("/" + oFieldViewMetadata.fieldName + "/items", aItems);
					this.oModel.setProperty("/" + oFieldViewMetadata.fieldName + "/ranges", aRanges);
				}
				// Manually trigger the change event on sapUI5 control since it doesn't do this internally on setValue!
				oControl.fireChange({
					value: ""
				});
			}, this));
		}
	};

	/**
	 * Associates the control with a ValueList using the details retrieved from the metadata (annotation)
	 * 
	 * @param {object} oControl - The control
	 * @param {string} sAggregation - The aggregation in the control to bind to
	 * @param {object} oFieldViewMetadata - The metadata merged from OData metadata and additional control configuration
	 * @param {boolean} bHasTypeAhead - Indicates whether the control also supports TypeAhead aka Suggest
	 * @private
	 */
	FilterProvider.prototype._associateValueList = function(oControl, sAggregation, oFieldViewMetadata, bHasTypeAhead) {
		if (oFieldViewMetadata.oValueListAnnotation) {
			this._aValueListProvider.push(new ValueListProvider({
				control: oControl,
				typeAheadEnabled: bHasTypeAhead,
				aggregation: sAggregation,
				displayFormat: oFieldViewMetadata.displayFormat,
				displayBehaviour: oFieldViewMetadata.displayBehaviour,
				annotation: oFieldViewMetadata.oValueListAnnotation,
				filterModel: this.oModel,
				filterProvider: this,
				model: this._oParentODataModel
			}));
		}
	};

	/**
	 * Calculates additional flags and attributes for a field e.g. whether TypeAhead is switched on
	 * 
	 * @param {object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @returns {object}
	 * @private
	 */
	FilterProvider.prototype._createFieldMetadata = function(oFilterFieldODataMetadata) {
		var oFieldViewMetadata, oControlConfiguration;

		oFilterFieldODataMetadata.fieldName = this._getFieldName(oFilterFieldODataMetadata);

		// Get Additional configuration
		oControlConfiguration = this._oAdditionalConfiguration.getControlConfigurationByKey(oFilterFieldODataMetadata.fieldName);

		oFieldViewMetadata = {};

		oFieldViewMetadata.fullName = oFilterFieldODataMetadata.fullName;
		oFieldViewMetadata.fieldName = oFilterFieldODataMetadata.fieldName;
		oFieldViewMetadata.type = oFilterFieldODataMetadata.type;
		oFieldViewMetadata.name = oFilterFieldODataMetadata.name;
		oFieldViewMetadata.displayFormat = oFilterFieldODataMetadata.displayFormat;
		oFieldViewMetadata.maxLength = oFilterFieldODataMetadata.maxLength;
		oFieldViewMetadata.precision = oFilterFieldODataMetadata.precision;
		oFieldViewMetadata.scale = oFilterFieldODataMetadata.scale;
		oFieldViewMetadata.filterRestriction = this._getFilterRestriction(oFilterFieldODataMetadata, oControlConfiguration);
		this._setAnnotationMetadata(oFieldViewMetadata);
		oFieldViewMetadata.hasValueHelpDialog = this._hasValueHelpDialog(oFieldViewMetadata, oControlConfiguration);
		oFieldViewMetadata.preventInitialDataFetchInValueHelpDialog = oControlConfiguration ? oControlConfiguration.preventInitialDataFetchInValueHelpDialog : true;
		oFieldViewMetadata.controlType = this._getControlType(oFieldViewMetadata, oControlConfiguration);
		oFieldViewMetadata.displayBehaviour = oControlConfiguration ? oControlConfiguration.displayBehaviour : undefined;
		oFieldViewMetadata.isCustomFilterField = !!(oControlConfiguration && oControlConfiguration.customControl);
		oFieldViewMetadata.visibleInAdvancedArea = !!(oControlConfiguration && oControlConfiguration.visibleInAdvancedArea);
		oFieldViewMetadata.label = this._getLabel(oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.quickInfo = oFilterFieldODataMetadata.quickInfo;
		oFieldViewMetadata.isMandatory = this._isMandatory(oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.width = this._getWidth(oControlConfiguration);
		oFieldViewMetadata.isVisible = this._isVisible(oControlConfiguration);
		oFieldViewMetadata.groupId = this._getGroupID(oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.index = this._getIndex(oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.fControlConstructor = this._getControlConstructor(oFieldViewMetadata);
		oFieldViewMetadata.hasTypeAhead = this._hasTypeAhead(oFieldViewMetadata, oFilterFieldODataMetadata, oControlConfiguration);
		oFieldViewMetadata.customControl = oControlConfiguration ? oControlConfiguration.customControl : undefined;
		oFieldViewMetadata.control = this._createControl(oFieldViewMetadata);
		this._applyWidth(oFieldViewMetadata);
		oFieldViewMetadata.defaultFilterValues = oControlConfiguration ? oControlConfiguration.defaultFilterValues : undefined;

		return oFieldViewMetadata;
	};

	/**
	 * Creates the metadata for the basic search field. The basic search is supposed to be used in the ValuehelpDialog
	 * 
	 * @returns {object}
	 * @private
	 */
	FilterProvider.prototype._createBasicSearchFieldMetadata = function() {
		var oFieldViewMetadata;

		oFieldViewMetadata = {};
		oFieldViewMetadata.filterRestriction = sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.single;
		oFieldViewMetadata.name = FilterProvider.BASIC_SEARCH_FIELD_ID;
		oFieldViewMetadata.fieldName = FilterProvider.BASIC_SEARCH_FIELD_ID;
		oFieldViewMetadata.label = undefined;
		oFieldViewMetadata.isMandatory = false;
		oFieldViewMetadata.isVisible = true;
		oFieldViewMetadata.groupId = FilterProvider.BASIC_FILTER_AREA_ID;
		oFieldViewMetadata.index = 0;
		oFieldViewMetadata.control = new SearchField({
			width: "28rem",
			showSearchButton: false
		});
		oFieldViewMetadata.control.bindProperty('value', this.sFilterModelName + ">/" + oFieldViewMetadata.fieldName);

		return oFieldViewMetadata;
	};

	/**
	 * If a width is specified in the additional configruation, it will be applied to the control
	 * 
	 * @private
	 */
	FilterProvider.prototype._applyWidth = function(oFieldViewMetadata) {

		if (oFieldViewMetadata && oFieldViewMetadata.width && oFieldViewMetadata.control && oFieldViewMetadata.control.setWidth && (typeof oFieldViewMetadata.control.setWidth === 'function')) {
			oFieldViewMetadata.control.setWidth(oFieldViewMetadata.width);
		}
	};

	/**
	 * Set any annotation(s) metadata on the control
	 * 
	 * @private
	 */
	FilterProvider.prototype._setAnnotationMetadata = function(oFieldViewMetadata) {
		var mAnnotation = null;
		if (oFieldViewMetadata) {
			mAnnotation = this._oMetadataAnalyser.getValueListAnnotation(oFieldViewMetadata.fullName);
			oFieldViewMetadata.oValueListAnnotation = mAnnotation.primaryValueListAnnotation;
			oFieldViewMetadata.additionalAnnotations = mAnnotation.additionalAnnotations;
		}
	};

	/**
	 * Calculates additional flags and attributes for a field e.g. whether TypeAhead is switched on
	 * 
	 * @param {object} oControlConfiguration - the control configuration for the field
	 * @returns {object}
	 * @private
	 */
	FilterProvider.prototype._createFieldMetadataForCustomFilterFields = function(oControlConfiguration) {
		var oFieldViewMetadata;

		// Custom filter fields are required to have a custom control
		if (!oControlConfiguration || !oControlConfiguration.customControl) {
			return undefined;
		}

		oFieldViewMetadata = {};
		oFieldViewMetadata.name = oControlConfiguration.key;
		oFieldViewMetadata.fieldName = oControlConfiguration.key;
		oFieldViewMetadata.label = oControlConfiguration.label;
		oFieldViewMetadata.visibleInAdvancedArea = !!(oControlConfiguration && oControlConfiguration.visibleInAdvancedArea);
		oFieldViewMetadata.isVisible = this._isVisible(oControlConfiguration);
		oFieldViewMetadata.groupId = oControlConfiguration.groupId;
		oFieldViewMetadata.isMandatory = this._isMandatory(undefined, oControlConfiguration);
		oFieldViewMetadata.index = oControlConfiguration.index;
		oFieldViewMetadata.width = this._getWidth(oControlConfiguration);
		oFieldViewMetadata.control = oControlConfiguration.customControl;
		oFieldViewMetadata.isCustomFilterField = true;
		this._applyWidth(oFieldViewMetadata);

		return oFieldViewMetadata;
	};

	/**
	 * Extends the filter metadata with fieldName attribute which has the entity name for associations
	 * 
	 * @param {object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @returns {string}
	 * @private
	 */
	FilterProvider.prototype._getFieldName = function(oFilterFieldODataMetadata) {
		if (oFilterFieldODataMetadata.entityName === this.sEntityTypeName) {
			return oFilterFieldODataMetadata.name;
		} else {
			return oFilterFieldODataMetadata.entityName + "." + oFilterFieldODataMetadata.name;
		}
	};

	/**
	 * Returns a flag indicating whether the field supports the value help dialog, or not
	 * 
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {boolean}
	 * @private
	 */
	FilterProvider.prototype._hasValueHelpDialog = function(oFieldViewMetadata, oControlConfiguration) {
		var bValueHelpDialog = true;

		if (oControlConfiguration) {
			if (oControlConfiguration.controlType === sap.ui.comp.smartfilterbar.ControlConfiguration.CONTROLTYPE.dropDownList) {
				bValueHelpDialog = false;
			} else if (oControlConfiguration.hasValueHelpDialog !== true) {
				bValueHelpDialog = false;
			}
		}
		if (oFieldViewMetadata && !oFieldViewMetadata.oValueListAnnotation) {
			if (oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.single || oFieldViewMetadata.filterRestriction === sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.multiple) {
				bValueHelpDialog = false;
			}
		}

		return bValueHelpDialog;
	};

	/**
	 * Returns a flag indicating whether the field supports the value help dialog, or not
	 * 
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {boolean}
	 * @private
	 */
	FilterProvider.prototype._isVisible = function(oControlConfiguration) {
		if (oControlConfiguration && oControlConfiguration.isVisible === false) {
			return false;
		}

		return true;
	};

	/**
	 * Returns the width from the control configuration. Undefined if there is no width specified
	 * 
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {string} - width of the filter field
	 * @private
	 */
	FilterProvider.prototype._getWidth = function(oControlConfiguration) {
		if (oControlConfiguration && oControlConfiguration.width) {
			return oControlConfiguration.width;
		}

		return undefined;
	};

	/**
	 * Returns a flag indicating whether the field supports the value help dialog, or not
	 * 
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {boolean}
	 * @private
	 */
	FilterProvider.prototype._isMandatory = function(oFilterFieldODataMetadata, oControlConfiguration) {
		if (oControlConfiguration && oControlConfiguration.mandatory !== sap.ui.comp.smartfilterbar.ControlConfiguration.MANDATORY.auto) {
			return oControlConfiguration.mandatory === sap.ui.comp.smartfilterbar.ControlConfiguration.MANDATORY.mandatory;
		}
		if (oFilterFieldODataMetadata) {
			return oFilterFieldODataMetadata.requiredField;
		}
		return false;
	};

	/**
	 * Returns the effective filter restriction. Possible values can be found in this enum: sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE
	 * 
	 * @param {object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns {string} sFilterRestriction; the effective filter restriction
	 */
	FilterProvider.prototype._getFilterRestriction = function(oFilterFieldODataMetadata, oControlConfiguration) {
		var sFilterRestriction;

		if (oControlConfiguration && oControlConfiguration.filterType && oControlConfiguration.filterType !== sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.auto) {
			sFilterRestriction = oControlConfiguration.filterType;
		} else if (oFilterFieldODataMetadata.filterRestriction === "single-value") {
			sFilterRestriction = sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.single;
		} else if (oFilterFieldODataMetadata.filterRestriction === "multi-value") {
			sFilterRestriction = sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.multiple;
		} else if (oFilterFieldODataMetadata.filterRestriction === "interval") {
			sFilterRestriction = sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.interval;
		} else {
			sFilterRestriction = sap.ui.comp.smartfilterbar.ControlConfiguration.FILTERTYPE.auto;
		}

		return sFilterRestriction;
	};

	/**
	 * Returns the effective control type. Control types can be found in enum: sap.ui.comp.smartfilterbar.ControlConfiguration.CONTROLTYPE
	 * 
	 * @param {object} oFieldViewMetadata - view metadata for the filter field
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns {string} sControlType; the effective control type
	 */
	FilterProvider.prototype._getControlType = function(oFieldViewMetadata, oControlConfiguration) {
		var sControlType;

		if (oControlConfiguration && oControlConfiguration.controlType && oControlConfiguration.controlType !== sap.ui.comp.smartfilterbar.ControlConfiguration.CONTROLTYPE.auto) {
			sControlType = oControlConfiguration.controlType;
		} else if (oFieldViewMetadata.type === "Edm.DateTime" && oFieldViewMetadata.displayFormat === "Date") {
			sControlType = sap.ui.comp.smartfilterbar.ControlConfiguration.CONTROLTYPE.date;
		} else if (oFieldViewMetadata.oValueListAnnotation && oFieldViewMetadata.oValueListAnnotation.semantics === "fixed-values") {
			sControlType = sap.ui.comp.smartfilterbar.ControlConfiguration.CONTROLTYPE.dropDownList;
		} else {
			sControlType = sap.ui.comp.smartfilterbar.ControlConfiguration.CONTROLTYPE.input;
		}
		return sControlType;
	};

	/**
	 * Returns the id of the parent group for a filter field from the additional configuration
	 * 
	 * @param {object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns groupId; the groupId for the configuration
	 */
	FilterProvider.prototype._getGroupID = function(oFilterFieldODataMetadata, oControlConfiguration) {
		if (oControlConfiguration && oControlConfiguration.groupId) {
			return oControlConfiguration.groupId;
		} else if (oFilterFieldODataMetadata && oFilterFieldODataMetadata.requiredField) {
			return this._sBasicFilterAreaID;
		}
		return this._getGroupIDFromFieldGroup(oFilterFieldODataMetadata);
	};

	/**
	 * Returns the id (if found) of the parent group for a filter field from the FieldGroup annotation
	 * 
	 * @param {object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @private
	 * @returns groupId; the groupId for the field (if found)
	 */
	FilterProvider.prototype._getGroupIDFromFieldGroup = function(oFilterFieldODataMetadata) {
		var iLen = 0, oFieldGroupAnnotation = null, sGroupName;
		if (oFilterFieldODataMetadata && this._aFieldGroupAnnotation && this._aFieldGroupAnnotation.length) {
			iLen = this._aFieldGroupAnnotation.length;
			// Loop through the FieldGroup annotation list and check if the field is found somewhere
			while (iLen--) {
				oFieldGroupAnnotation = this._aFieldGroupAnnotation[iLen];
				if (oFieldGroupAnnotation && oFieldGroupAnnotation.fields && oFieldGroupAnnotation.fields.indexOf(oFilterFieldODataMetadata.name) > -1) {
					sGroupName = oFieldGroupAnnotation.groupName;
					break;
				}
			}
		}
		return sGroupName;
	};

	/**
	 * Returns the label of the filter field. OData metadata and additional configuration are used for this
	 * 
	 * @param {object} oFilterFieldODataMetadata - OData metadata
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns label for the filter field
	 */
	FilterProvider.prototype._getLabel = function(oFilterFieldODataMetadata, oControlConfiguration) {

		if (oControlConfiguration && oControlConfiguration.label) {
			return oControlConfiguration.label;
		}
		return this._getLabelFromFieldGroup(oFilterFieldODataMetadata) || oFilterFieldODataMetadata.fieldLabel || oFilterFieldODataMetadata.fieldName;
	};

	/**
	 * Returns the label (if found) of the filter field from the FieldGroup annotation
	 * 
	 * @param {object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @private
	 * @returns label; undefined if field is no part of field group annotation
	 */
	FilterProvider.prototype._getLabelFromFieldGroup = function(oFilterFieldODataMetadata) {
		var iLen = 0, oFieldGroupAnnotation = null, sLabel;
		if (oFilterFieldODataMetadata && this._aFieldGroupAnnotation && this._aFieldGroupAnnotation.length) {
			iLen = this._aFieldGroupAnnotation.length;
			// Loop through the FieldGroup annotation list and check if the field is found somewhere
			while (iLen--) {
				oFieldGroupAnnotation = this._aFieldGroupAnnotation[iLen];
				if (oFieldGroupAnnotation && oFieldGroupAnnotation.fields && oFieldGroupAnnotation.fields.indexOf(oFilterFieldODataMetadata.name) > -1) {
					sLabel = oFieldGroupAnnotation.labels[oFilterFieldODataMetadata.name];
					break;
				}
			}
		}
		return sLabel;
	};

	/**
	 * Returns the index for a filter field from the additional configuration -or- based on FieldGroup annotation
	 * 
	 * @param {object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @private
	 * @returns index; undefined if index is not specified in additional configuration
	 */
	FilterProvider.prototype._getIndex = function(oFilterFieldODataMetadata, oControlConfiguration) {
		if (oControlConfiguration && (oControlConfiguration.index || oControlConfiguration.index === 0)) {
			return oControlConfiguration.index;
		}
		return this._getIndexFromFieldGroup(oFilterFieldODataMetadata);
	};

	/**
	 * Returns the index (if found) of the filter field from the FieldGroup annotation
	 * 
	 * @param {object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @private
	 * @returns index; undefined if field is no part of field group annotation
	 */
	FilterProvider.prototype._getIndexFromFieldGroup = function(oFilterFieldODataMetadata) {
		var iLen = 0, oFieldGroupAnnotation = null, iIndex;
		if (oFilterFieldODataMetadata && this._aFieldGroupAnnotation && this._aFieldGroupAnnotation.length) {
			iLen = this._aFieldGroupAnnotation.length;
			// Loop through the FieldGroup annotation list and check if the field is found somewhere
			while (iLen--) {
				oFieldGroupAnnotation = this._aFieldGroupAnnotation[iLen];
				if (oFieldGroupAnnotation && oFieldGroupAnnotation.fields) {
					iIndex = oFieldGroupAnnotation.fields.indexOf(oFilterFieldODataMetadata.name);
					if (iIndex > -1) {
						break;
					}
					iIndex = undefined;
				}
			}
		}
		return iIndex;
	};

	/**
	 * Returns the index for a filter group from the additional configuration
	 * 
	 * @param {object} oGroupConfiguration - Additional configuration for this filter group
	 * @private
	 * @returns index; undefined if index is not specified in additional configuration
	 */
	FilterProvider.prototype._getGroupIndex = function(oGroupConfiguration) {
		if (oGroupConfiguration && (oGroupConfiguration.index || oGroupConfiguration.index === 0)) {
			return oGroupConfiguration.index;
		}
	};

	/**
	 * Returns the label for a filter group from the additional configuration
	 * 
	 * @param {object} oFilterGroupODataMetadata - OData metadata for the filter group
	 * @param {object} oGroupConfiguration - Additional configuration for this filter group
	 * @private
	 * @returns index; undefined if label is not specified in additional configuration
	 */
	FilterProvider.prototype._getGroupLabel = function(oFilterGroupODataMetadata, oGroupConfiguration) {
		if (oGroupConfiguration && oGroupConfiguration.label) {
			return oGroupConfiguration.label;
		}
		return oFilterGroupODataMetadata.groupLabel || oFilterGroupODataMetadata.groupName;
	};

	/**
	 * Returns a flag indicating whether the field supports TypeAhead (aka. Suggest), or not
	 * 
	 * @param {object} oFilterFieldODataMetadata - OData metadata for the filter field
	 * @param {object} oControlConfiguration - Additional configuration for this filter field
	 * @returns {boolean}
	 * @private
	 */
	FilterProvider.prototype._hasTypeAhead = function(oFieldViewMetadata, oFilterFieldODataMetadata, oControlConfiguration) {
		var bHasTypeAhead;

		bHasTypeAhead = true;
		if (oControlConfiguration) {
			bHasTypeAhead = oControlConfiguration.hasTypeAhead;
		} else if (oFilterFieldODataMetadata.type !== "Edm.String") {
			return false;
		}
		// Disable type ahead for anything other than Input/MultiInput
		if (!(oFieldViewMetadata.fControlConstructor === Input || oFieldViewMetadata.fControlConstructor === MultiInput)) {
			return false;
		}

		return bHasTypeAhead;
	};

	/**
	 * Get the model
	 * 
	 * @returns {Object}
	 * @public
	 */
	FilterProvider.prototype.getModel = function() {
		return this.oModel;
	};

	/**
	 * Get the filterable fields
	 * 
	 * @returns {Array}
	 * @public
	 */
	FilterProvider.prototype.getFilterBarViewMetadata = function() {
		return this._aFilterBarViewMetadata;
	};

	/**
	 * Returns an parameter object which can be used to restrict the query result from OData. This function is required only for the basic search.
	 * 
	 * @returns {object} object containing OData query parameters
	 * @public
	 */
	FilterProvider.prototype.getParameters = function() {
		var oParameter, sBasicSearchText = null;

		if (this.oModel) {
			sBasicSearchText = this.oModel.getProperty("/" + FilterProvider.BASIC_SEARCH_FIELD_ID);
		}

		if (this._sBasicSearchFieldName || sBasicSearchText) {
			oParameter = {
				custom: {
					"search-focus": this._sBasicSearchFieldName,
					"search": sBasicSearchText || ""
				}
			};
		}
		return oParameter;
	};

	/**
	 * Returns an array of filters that can be used to restrict the query result from OData
	 * 
	 * @param {Array} aFieldNames - the names of the fields whose values should be returned (Ex: visible fields)
	 * @returns {Array} array of filters if any
	 * @public
	 */
	FilterProvider.prototype.getFilters = function(aFieldNames) {
		var oData = null;
		if (this.oModel) {
			oData = this.oModel.getData();
		}
		return FilterProvider.generateFilters(aFieldNames, oData, this._oDateFormatSettings);
	};

	/**
	 * Returns the data currently set in the filter data model
	 * 
	 * @returns {object} the json data in the filter bar
	 * @public
	 */
	FilterProvider.prototype.getFilterData = function() {
		return this.oModel ? this.oModel.getData() : null;
	};

	/**
	 * Returns the data currently set in the filter data model as string
	 * 
	 * @returns {string} the string json data in the filter bar
	 * @public
	 */
	FilterProvider.prototype.getFilterDataAsString = function() {
		return this.oModel ? this.oModel.getJSON() : null;
	};

	/**
	 * Returns the filled data currently set in the filter data model
	 * 
	 * @param {Array} aFieldNames - the names of the fields whose values should be returned (Ex: visible fields)
	 * @returns {object} the json data in the filter bar
	 * @public
	 */
	FilterProvider.prototype.getFilledFilterData = function(aFieldNames) {
		var oData, oFilledData = {}, iFieldLength, sField, oValue;
		oData = this.oModel ? this.oModel.getData() : null;
		if (oData && aFieldNames) {
			iFieldLength = aFieldNames.length;
			while (iFieldLength--) {
				sField = aFieldNames[iFieldLength];
				if (sField && sField !== FilterProvider.BASIC_SEARCH_FIELD_ID) {
					oValue = oData[sField];
					if (oValue && oValue.hasOwnProperty("low")) {// interval
						if (oValue.low) {
							oFilledData[sField] = oValue;
						}
					} else if (oValue && oValue.hasOwnProperty("items")) {// unrestricted/multi-value
						if (oValue.value && typeof oValue.value === "string") {
							oValue.value = oValue.value.trim();
						}
						if (oValue.items.length || (oValue.ranges && oValue.ranges.length) || oValue.value) {
							oFilledData[sField] = oValue;
						}
					} else if (oValue) {// Single Value
						if (typeof oValue === "string") {
							oValue = oValue.trim();
						}
						if (oValue) {
							oFilledData[sField] = oValue;
						}
					}
				}
				// Finally fill the Custom data if it exists
				if (iFieldLength === 0) {
					sField = FilterProvider.CUSTOM_FIELDS_MODEL_PROPERTY;
					oValue = oData[sField];
					if (oValue) {
						oFilledData[sField] = oValue;
					}
				}
			}
		}
		// Always return a copy of the original data, since some objects may be referenced elsewhere and could get destroyed (or removed) during
		// usage!
		return jQuery.extend(true, {}, oFilledData);
	};

	/**
	 * Returns the filled data currently set in the filter data model as string
	 * 
	 * @param {Array} aFieldNames - the names of the fields whose values should be returned (Ex: visible fields)
	 * @returns {string} the string json data in the filter bar
	 * @public
	 */
	FilterProvider.prototype.getFilledFilterDataAsString = function(aFieldNames) {
		return JSON.stringify(this.getFilledFilterData(aFieldNames));
	};

	/**
	 * Sets the data in the filter data model
	 * 
	 * @param {object} oJson - the json data in the filter bar
	 * @param {boolean} bReplace - Replace existing filter data
	 * @public
	 */
	FilterProvider.prototype.setFilterData = function(oJson, bReplace) {
		var oData = null, aFieldNames = null, sKey = null;
		if (this.oModel && oJson) {
			if (bReplace) {
				this._createInitialModel(false);
			}
			oData = this._parseFilterData(oJson, bReplace);
			if (oData) {
				this.oModel.setData(oData, true);
				aFieldNames = [];
				for (sKey in oData) {
					aFieldNames.push(sKey);
				}
				this._handleFilterDataUpdate(aFieldNames);
			}
		}
	};

	/**
	 * Sets the data in the filter data model as string
	 * 
	 * @param {string} sJson - the json data in the filter bar
	 * @param {boolean} bReplace - Replace existing filter data
	 * @public
	 */
	FilterProvider.prototype.setFilterDataAsString = function(sJson, bReplace) {
		if (sJson) {
			this.setFilterData(JSON.parse(sJson), bReplace);
		}
	};

	/**
	 * Parse the filter data to handle some formats and not consider all formats
	 * 
	 * @param {object} oJson = the filter data input
	 * @returns {Object} the
	 * @private
	 */
	FilterProvider.prototype._parseFilterData = function(oJson, bReplace) {
		return FilterProvider.parseFilterData(this.oModel.getData(), oJson, this._aFilterBarDateFieldNames, bReplace);
	};

	/**
	 * Called once the FilterData is set via SetFilterData. Handles control update for non binding controls (multi-value)
	 * 
	 * @param {Array} aFieldNames - Array containing name of updated fields
	 * @private
	 */
	FilterProvider.prototype._handleFilterDataUpdate = function(aFieldNames) {
		var i = 0, oFilterFieldMetadata, oData, oFilterData;
		if (this._aFilterBarMultiValueFieldMetadata) {
			i = this._aFilterBarMultiValueFieldMetadata.length;
			while (i--) {
				if (!oData) {
					oData = this.oModel.getData();
				}
				if (oData) {
					oFilterFieldMetadata = this._aFilterBarMultiValueFieldMetadata[i];
					// Only update the value if the field was changed in the handleDataUpate
					if (aFieldNames.indexOf(oFilterFieldMetadata.fieldName) > -1) {
						oFilterData = oData[oFilterFieldMetadata.fieldName];
						if (oFilterData) {
							this._updateMultiValueControl(oFilterFieldMetadata.control, oFilterData.items, oFilterData.ranges);
						}
					}
				}
			}
		}
	};

	/**
	 * Clears the model
	 * 
	 * @public
	 */
	FilterProvider.prototype.clear = function() {
		this._createInitialModel(false);
	};

	/**
	 * Resets the model
	 * 
	 * @public
	 */
	FilterProvider.prototype.reset = function() {
		this._createInitialModel(true);
	};

	// TODO: Move this to a Util
	/**
	 * Static function to generate filter array from the given field name array and Json data object
	 * 
	 * @param {Array} aFieldNames - array of field names
	 * @param {object} oData - the json object data
	 * @returns {Array} array of sap.ui.model.Filter
	 * @private
	 */
	FilterProvider.generateFilters = function(aFieldNames, oData, oDateFormatSettings) {
		var aFilters = [], aArrayFilters = null, oExcludeFilters = null, aExcludeFilters = null, sField = null, oValue = null, oValue1, oValue2, aValue = null, iLen = 0, iFieldLength = 0;
		if (aFieldNames && oData) {
			iFieldLength = aFieldNames.length;
			while (iFieldLength--) {
				sField = aFieldNames[iFieldLength];
				if (sField && sField !== FilterProvider.BASIC_SEARCH_FIELD_ID) {
					oValue = oData[sField];
					if (oValue && oValue.hasOwnProperty("low")) {// The data in the model corresponds to low and high Objects
						if (oValue.low && oValue.high) {
							oValue1 = oValue.low;
							oValue2 = oValue.high;
							if (oDateFormatSettings && oDateFormatSettings.UTC && oValue1 instanceof Date && oValue2 instanceof Date) {
								oValue1 = FilterProvider.getDateInUTCOffset(oValue1);
								oValue2 = FilterProvider.getDateInUTCOffset(oValue2);
							}
							aFilters.push(new Filter(sField.replace(".", "/"), sap.ui.model.FilterOperator.BT, oValue1, oValue2));
						} else if (oValue.low) {
							// since we bind non date interval values only to low; resolve this by splitting "-" into an interval
							aValue = oValue.low.split("-");
							if (aValue && aValue.length === 2) {
								aFilters.push(new Filter(sField.replace(".", "/"), sap.ui.model.FilterOperator.BT, aValue[0], aValue[1]));
							} else {
								// We do not have an interval value --> Use typed in value as a single value filter
								aFilters.push(new Filter(sField.replace(".", "/"), sap.ui.model.FilterOperator.EQ, oValue.low));
							}
						}
					} else if (oValue && oValue.hasOwnProperty("items")) {// The data in the model corresponds to multi-value/range with a typed in
						// value
						aArrayFilters = [];
						aExcludeFilters = [];
						oExcludeFilters = null;
						if (oValue && oValue.hasOwnProperty("ranges")) { // Check if the data is for an unrestricted filter
							aValue = oValue.ranges;
							iLen = aValue.length;
							// Range Filters
							while (iLen--) {
								if (aValue[iLen].exclude) { // Exclude Select Option is not supported entirely except EQ, which can be changed to NE
									if (aValue[iLen].operation === sap.ui.model.FilterOperator.EQ) {
										aExcludeFilters.push(new Filter(sField.replace(".", "/"), sap.ui.model.FilterOperator.NE, aValue[iLen].value1));
									}
								} else {
									aArrayFilters.push(new Filter(sField.replace(".", "/"), aValue[iLen].operation, aValue[iLen].value1, aValue[iLen].value2));
								}
							}
							if (aExcludeFilters.length) {
								oExcludeFilters = new Filter(aExcludeFilters, true);
							}
						}
						aValue = oValue.items;
						iLen = aValue.length;
						// Item filters
						while (iLen--) {
							aArrayFilters.push(new Filter(sField.replace(".", "/"), sap.ui.model.FilterOperator.EQ, aValue[iLen].key));
						}
						if (oValue.value || oValue.value === 0) {
							if (typeof oValue.value === "string") {
								oValue.value = oValue.value.trim();
							}
							if (oValue.value || oValue.value === 0) {
								aArrayFilters.push(new Filter(sField.replace(".", "/"), sap.ui.model.FilterOperator.EQ, oValue.value));
							}
						}

						// OR the array values while creating the filter
						if (aArrayFilters.length) {
							// If Exclude and array (inlcude) filters exists --> use AND between them before pushing to the filter array
							if (oExcludeFilters) {
								aFilters.push(new Filter([
									new Filter(aArrayFilters, false), oExcludeFilters
								], true));
							} else {
								aFilters.push(new Filter(aArrayFilters, false));
							}
						} else if (oExcludeFilters) {
							// Only exclude filters exists --> add to the filter array
							aFilters.push(oExcludeFilters);
						}
					} else if (oValue || oValue === 0) {// Single Value
						if (typeof oValue === "string") {
							oValue = oValue.trim();
						}
						if (oDateFormatSettings && oDateFormatSettings.UTC && oValue instanceof Date) {
							oValue = FilterProvider.getDateInUTCOffset(oValue);
						}
						if (oValue || oValue === 0) {
							aFilters.push(new Filter(sField.replace(".", "/"), sap.ui.model.FilterOperator.EQ, oValue));
						}
					}
				}
			}
		}
		// AND the top level filter attributes if there is more than 1
		return (aFilters.length > 1) ? [
			new Filter(aFilters, true)
		] : aFilters;
	};

	// TODO: Move this to a Util
	/**
	 * Static function to parse and convert json data to be set into the data of the filter model (JsonModel.oData) into proper format
	 * 
	 * @private
	 * @param {Object} oData - The data from the datamodel
	 * @param {Object} oInputJson - the json object data that needs to be convered/parsed
	 * @param {Array} aFilterBarDateFieldNames - the name of the date fields (since we need to convert Date fields to JavaScript Date objects)
	 * @returns {Object} The resolved/parsed/converted data that can be set into the model
	 */
	FilterProvider.parseFilterData = function(oData, oInputJson, aFilterBarDateFieldNames, bReplace) {
		var oResolvedData = {}, sField = null, oValue = null, oNewValue, oJson;
		if (!aFilterBarDateFieldNames) {
			aFilterBarDateFieldNames = [];
		}
		if (oData && oInputJson) {
			oJson = jQuery.extend({}, oInputJson, true);
			for (sField in oJson) {
				if (oData.hasOwnProperty(sField) && sField !== FilterProvider.CUSTOM_FIELDS_MODEL_PROPERTY) {
					oValue = oData[sField];
					oNewValue = oJson[sField];
					if (oValue && oValue.hasOwnProperty("low")) {// interval
						if (oNewValue.low && oNewValue.high) { // Date Range
							oResolvedData[sField] = oNewValue;
							if (!(oNewValue.low instanceof Date)) { // Date needs to be set as a Date Object always!
								oResolvedData[sField].low = new Date(oNewValue.low);
							}
							if (!(oNewValue.high instanceof Date)) {// Date needs to be set as a Date Object always!
								oResolvedData[sField].high = new Date(oNewValue.high);
							}
						} else if (oNewValue.low && !oNewValue.high) {
							oResolvedData[sField] = {
								low: oNewValue.low,
								high: null
							};
						}
					} else if (oValue && oValue.hasOwnProperty("items")) {// unrestricted/multi-value
						if (oNewValue.items || oNewValue.ranges) { // Unrestricted/multi-value
							oResolvedData[sField] = oNewValue;
						} else if (typeof oNewValue === "string" || typeof oNewValue === "number") { // Single Value
							oResolvedData[sField] = {
								value: oNewValue,
								items: []
							};
						}
					} else {// single value
						oResolvedData[sField] = null; // Default to null!
						if (typeof oNewValue === "string" || oNewValue instanceof Date) { // Single Date or string value
							if (typeof oNewValue === "string" && aFilterBarDateFieldNames.indexOf(sField) > -1) { // String input but date expected
								oResolvedData[sField] = new Date(oNewValue);
							} else {
								oResolvedData[sField] = oNewValue;
							}
						} else if (oNewValue && (oNewValue.value || oNewValue.value === 0)) { // Use the types in value from multiValue if any
							oResolvedData[sField] = oNewValue.value;
						} else if (oNewValue && oNewValue.items && oNewValue.items.length) { // use the 1st value in items array if any
							oResolvedData[sField] = oNewValue.items[0].key;
						}
					}
				} else if (bReplace || sField === FilterProvider.CUSTOM_FIELDS_MODEL_PROPERTY) {
					// Value is for _CUSTOM -> add it as it is
					oResolvedData[sField] = oJson[sField];
				}
			}
		}
		return oResolvedData;
	};

	/**
	 * Static function that returns a UTC offset date
	 * 
	 * @private
	 * @param {Object} oDate - The input date object
	 * @returns {Object} The UTC offset date object
	 */
	FilterProvider.getDateInUTCOffset = function(oDate) {
		return new Date(oDate.valueOf() - oDate.getTimezoneOffset() * 60 * 1000);
	};

	// TODO: Move this to a Util
	/**
	 * Static function that returns a formatted expression based on the displayBehaviour. Fallback is to return the Id (sId)
	 * 
	 * @param {string} sDisplayBehaviour - the display behaviour (as defined in: sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR)
	 * @param {string} sId - the Id field name/path in the model
	 * @param {string} sDescription - the Description field name/path in the model
	 * @returns {string} the calulated path based on the displayBehaviour
	 * @private
	 */
	FilterProvider.getFormattedExpressionFromDisplayBehaviour = function(sDisplayBehaviour, sId, sDescription) {
		var sTextBinding = null;

		switch (sDisplayBehaviour) {
			case sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR.descriptionAndId:
				sTextBinding = sDescription + " (" + sId + ")";
				break;
			case sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR.idAndDescription:
				sTextBinding = sId + " (" + sDescription + ")";
				break;
			case sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR.descriptionOnly:
				sTextBinding = sDescription;
				break;
			// fallback to Id in case nothing was specified
			default:
				sTextBinding = sId;
				break;
		}

		return sTextBinding;
	};

	// TODO: Move to a Util
	/**
	 * creates and returns a formatted text for the specified range
	 * 
	 * @private
	 * @param {string} sOperation the operation type sap.ui.model.FilterOperator
	 * @param {string} sValue1 value of the first range field
	 * @param {string} sValue2 value of the second range field
	 * @param {boolean} bExclude indicates if the range is an Exclude range
	 * @returns {string} the range token text
	 */
	FilterProvider.getFormattedRangeText = function(sOperation, sValue1, sValue2, bExclude) {
		var sTokenText = "";
		if (sValue1) {
			switch (sOperation) {
				case sap.ui.model.FilterOperator.EQ:
					sTokenText = "=" + sValue1;
					break;
				case sap.ui.model.FilterOperator.GT:
					sTokenText = ">" + sValue1;
					break;
				case sap.ui.model.FilterOperator.GE:
					sTokenText = ">=" + sValue1;
					break;
				case sap.ui.model.FilterOperator.LT:
					sTokenText = "<" + sValue1;
					break;
				case sap.ui.model.FilterOperator.LE:
					sTokenText = "<=" + sValue1;
					break;
				case sap.ui.model.FilterOperator.Contains:
					sTokenText = "*" + sValue1 + "*";
					break;
				case sap.ui.model.FilterOperator.StartsWith:
					sTokenText = sValue1 + "*";
					break;
				case sap.ui.model.FilterOperator.EndsWith:
					sTokenText = "*" + sValue1;
					break;
				case sap.ui.model.FilterOperator.BT:
					if (sValue2) {
						sTokenText = sValue1 + "..." + sValue2;
					}
					break;
			}
		}

		if (bExclude && sTokenText) {
			sTokenText = "!(" + sTokenText + ")";
		}

		return sTokenText;
	};

	/**
	 * Destroys the object
	 * 
	 * @public
	 */
	FilterProvider.prototype.destroy = function() {
		var i = 0;
		this._aFilterBarViewMetadata = null;
		this._aFilterBarDateFieldNames = null;
		this._aFilterBarMultiValueFieldMetadata = null;
		this._aFieldGroupAnnotation = null;

		if (this._oMetadataAnalyser && this._oMetadataAnalyser.destroy) {
			this._oMetadataAnalyser.destroy();
		}
		this._oMetadataAnalyser = null;

		if (this._aValueHelpDialogProvider) {
			i = this._aValueHelpDialogProvider.length;
			while (i--) {
				this._aValueHelpDialogProvider[i].destroy();
			}
		}
		this._aValueHelpDialogProvider = null;

		if (this._aValueListProvider) {
			i = this._aValueListProvider.length;
			while (i--) {
				this._aValueListProvider[i].destroy();
			}
		}
		this._aValueListProvider = null;

		this.oResourceBundle = null;
		this.sIntervalPlaceholder = null;
		this.sDefaultDropDownDisplayBehaviour = null;
		this.sDefaultTokenDisplayBehaviour = null;
		this._oSmartFilter = null;

		this.bIsDestroyed = true;
	};

	return FilterProvider;

}, /* bExport= */true);
