/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.variants.EditableVariantItem.
sap.ui.define(['jquery.sap.global', 'sap/m/ColumnListItem', 'sap/ui/comp/library'],
	function(jQuery, ColumnListItem, library) {
	"use strict";


	
	/**
	 * Constructor for a new variants/EditableVariantItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Editable Variant List item for the Management Popup
	 * @extends sap.m.ColumnListItem
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.variants.EditableVariantItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var EditableVariantItem = ColumnListItem.extend("sap.ui.comp.variants.EditableVariantItem", /** @lends sap.ui.comp.variants.EditableVariantItem.prototype */ { metadata : {
	
		library : "sap.ui.comp",
		properties : {
	
			/**
			 * Key of the List Item
			 * @since 1.22.0
			 */
			key : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Indicator if a variant is visible for all users.
			 * @since 1.26.0
			 */
			global : {type : "boolean", group : "Misc", defaultValue : null},
	
			/**
			 * ABAP Package the variant is assigned. Used for transport functionality
			 * @since 1.26.0
			 */
			lifecyclePackage : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Identifier of the transport object the variant is assigned to.
			 * @since 1.26.0
			 */
			lifecycleTransportId : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Variant namespace
			 * @since 1.26.0
			 */
			namespace : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Indication if variant can be changed
			 * @since 1.26.0
			 */
			readOnly : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * Flags for a variant to indicate why it might be read-only
			 * @since 1.26.0
			 * @deprecated Since version 1.28. 
			 * AccessOptions have been replaced by labelReadOnly
			 */
			accessOptions : {type : "string", group : "Misc", defaultValue : null, deprecated: true},
	
			/**
			 * Indicates if the variant label can be changed
			 * @since 1.28.0
			 */
			labelReadOnly : {type : "boolean", group : "Misc", defaultValue : false}
		}
	}});
	

	return EditableVariantItem;

}, /* bExport= */ true);
