﻿/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */

sap.ui.define([
	"jquery.sap.global", "sap/ui/fl/changeHandler/RemoveField", "sap/ui/fl/changeHandler/RemoveGroup", "sap/ui/fl/changeHandler/RenameField", "sap/ui/fl/changeHandler/RenameGroup", "sap/ui/fl/changeHandler/AddField", "sap/ui/fl/changeHandler/AddGroup", "sap/ui/fl/changeHandler/OrderFields", "sap/ui/fl/changeHandler/OrderGroups", "sap/ui/fl/changeHandler/HideControl", "sap/ui/fl/changeHandler/UnhideControl", "sap/ui/fl/changeHandler/MoveFields", "sap/ui/fl/changeHandler/MoveGroups"
], function(jQuery, RemoveField, RemoveGroup, RenameField, RenameGroup, AddField, AddGroup, OrderFields, OrderGroups, HideControl, UnhideControl, MoveFields, MoveGroups) {
	"use strict";

	/**
	 * Object containing standard changes like labelChange. Structure is like this: <code> { "labelChange":{"changeType":"labelChange", "changeHandler":sap.ui.fl.changeHandler.LabelChange}} </code>
	 * @constructor	 	  
	 * @alias sap.ui.fl.registry.SimpleChanges
	 *
	 * @author SAP SE
	 * @version 1.28.1
	 * @experimental Since 1.27.0
	 *
	 */
	var SimpleChanges = {
		removeField: {
			changeType: "removeField",
			changeHandler: RemoveField
		},
		removeGroup: {
			changeType: "removeGroup",
			changeHandler: RemoveGroup
		},
		renameField: {
			changeType: "renameField",
			changeHandler: RenameField
		},
		renameGroup: {
			changeType: "renameGroup",
			changeHandler: RenameGroup
		},
		addField: {
			changeType: "addField",
			changeHandler: AddField
		},
		addGroup: {
			changeType: "addGroup",
			changeHandler: AddGroup
		},
		orderFields: {
			changeType: "orderFields",
			changeHandler: OrderFields
		},
		orderGroups: {
			changeType: "orderGroups",
			changeHandler: OrderGroups
		},
		hideControl: {
			changeType: "hideControl",
			changeHandler: HideControl
		},
		unhideControl: {
			changeType: "unhideControl",
			changeHandler: UnhideControl
		},
		moveFields: {
			changeType: "moveFields",
			changeHandler: MoveFields
		},
		moveGroups: {
			changeType: "moveGroups",
			changeHandler: MoveGroups
		}
	};

	return SimpleChanges;

}, true);
