/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["jquery.sap.global", "sap/ui/base/Object"],
	function(jQuery, Object) {
	"use strict";

/**
 * Abstract MessageParser class
 * 
 * @abstract
 */
var MessageParser = Object.extend("sap.ui.core.message.MessageParser", {
	metadata: {
		publicMethods: [ "parse", "setProcessor" ]
	},

	constructor: function() {
		this._processor = null;
	}
});

////////////////////////////////////////// Public Methods //////////////////////////////////////////

/**
 * This method is used by the model to register itself as MessageProcessor for this parser
 * 
 * @param {sap.ui.message.MessageProcessor} oProcessor - The MessageProcessor that can be used to fire events
 * @return {sap.ui.message.MessagePaser} Instance reference for method chaining
 * @protected
 */
MessageParser.prototype.setProcessor = function(oProcessor) {
	this._processor = oProcessor;
	return this;
};

/**
 * Returns the registered processor on which the events for message handling can be fired
 * 
 * @return {sap.ui.message.MessageProcessor} The currently set MessageProcessor or null if none is set
 * @protected
 */
MessageParser.prototype.getProcessor = function() {
	return this._processor;
};


/**
 * @abstract
 */
MessageParser.prototype.parse = function(oResponse) {
	jQuery.sap.log.error(
		"MessageParser: parse-method must be implemented in the specific parser class. Messages " +
		"have been ignored."
	);
};


////////////////////////////////////////// onEvent Methods /////////////////////////////////////////
////////////////////////////////////////// Private Methods /////////////////////////////////////////
///////////////////////////////////////// Hidden Functions /////////////////////////////////////////
//////////////////////////////////////// Overridden Methods ////////////////////////////////////////

return MessageParser;

});
