/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */

// Provides control sap.ui.comp.navpopover.LinkData.
sap.ui.define(['jquery.sap.global', 'sap/ui/comp/library', 'sap/ui/core/Element'],
	function(jQuery, library, Element) {
	"use strict";


	
	/**
	 * Constructor for a new navpopover/LinkData.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Stores display text together with a navigation target hyperlink.
	 * @extends sap.ui.core.Element
	 *
	 * @author Benjamin Spieler
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.comp.navpopover.LinkData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var LinkData = Element.extend("sap.ui.comp.navpopover.LinkData", /** @lends sap.ui.comp.navpopover.LinkData.prototype */ { metadata : {
	
		library : "sap.ui.comp",
		properties : {
	
			/**
			 * Text which can be displayed on the UI
			 * @since 1.28.0
			 */
			text : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Destination link for a navigation operation.
			 * @since 1.28.0
			 */
			href : {type : "string", group : "Misc", defaultValue : null}
		}
	}});
	

	return LinkData;

}, /* bExport= */ true);
