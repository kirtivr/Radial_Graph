/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.vbm.VoBase");jQuery.sap.require("sap.ui.vbm.library");jQuery.sap.require("sap.ui.core.Element");sap.ui.core.Element.extend("sap.ui.vbm.VoBase",{metadata:{library:"sap.ui.vbm",properties:{"hotScale":{type:"string",group:"Misc",defaultValue:'1.1;1.1;1.0'},"hotDeltaColor":{type:"string",group:"Misc",defaultValue:'RHLSA(0;1.0;1.0;1.0)'},"selectColor":{type:"string",group:"Misc",defaultValue:'RHLSA(0.0;1.0;1.0;1.0)'},"fxsize":{type:"string",group:"Misc",defaultValue:'true'},"fxdir":{type:"string",group:"Misc",defaultValue:'true'},"entity":{type:"string",group:"Misc",defaultValue:null},"labelText":{type:"string",group:"Misc",defaultValue:null},"labelBgColor":{type:"string",group:"Misc",defaultValue:'RGB(255;255;255)'},"labelPos":{type:"string",group:"Misc",defaultValue:null},"changable":{type:"boolean",group:"Misc",defaultValue:false},"dragData":{type:"string",group:"Misc",defaultValue:null}},events:{"click":{},"contextMenu":{},"handleMoved":{},"handleContextMenu":{},"handleClick":{}}}});sap.ui.vbm.VoBase.M_EVENTS={'click':'click','contextMenu':'contextMenu','handleMoved':'handleMoved','handleContextMenu':'handleContextMenu','handleClick':'handleClick'};