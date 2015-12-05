/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

/* -----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ----------------------------------------------------------------------------------- */

/**
 * Initialization Code and shared classes of library sap.ui.vbm (1.28.0)
 */
jQuery.sap.declare("sap.ui.vbm.library");
jQuery.sap.require("sap.ui.core.Core");
/**
 * SAP UI library: sap.ui.vbm
 *
 * @namespace
 * @name sap.ui.vbm
 * @public
 */


// library dependencies
jQuery.sap.require("sap.ui.core.library");
jQuery.sap.require("sap.ui.commons.library");

// delegate further initialization of this library to the Core
sap.ui.getCore().initLibrary({
	name : "sap.ui.vbm",
	dependencies : ["sap.ui.core","sap.ui.commons"],
	types: [],
	interfaces: [],
	controls: [
		"sap.ui.vbm.AnalyticMap",
		"sap.ui.vbm.GeoMap",
		"sap.ui.vbm.VBI"
	],
	elements: [
		"sap.ui.vbm.Area",
		"sap.ui.vbm.Areas",
		"sap.ui.vbm.Box",
		"sap.ui.vbm.Boxes",
		"sap.ui.vbm.Circle",
		"sap.ui.vbm.Circles",
		"sap.ui.vbm.Container",
		"sap.ui.vbm.Containers",
		"sap.ui.vbm.DragSource",
		"sap.ui.vbm.DropTarget",
		"sap.ui.vbm.GeoCircle",
		"sap.ui.vbm.GeoCircles",
		"sap.ui.vbm.Legend",
		"sap.ui.vbm.LegendItem",
		"sap.ui.vbm.Pie",
		"sap.ui.vbm.PieItem",
		"sap.ui.vbm.Pies",
		"sap.ui.vbm.Region",
		"sap.ui.vbm.Resource",
		"sap.ui.vbm.Route",
		"sap.ui.vbm.Routes",
		"sap.ui.vbm.Spot",
		"sap.ui.vbm.Spots",
		"sap.ui.vbm.VoAggregation",
		"sap.ui.vbm.VoBase"
	],
	version: "1.28.0"
});
