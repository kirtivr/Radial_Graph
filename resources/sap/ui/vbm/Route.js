/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.vbm.Route");jQuery.sap.require("sap.ui.vbm.library");jQuery.sap.require("sap.ui.vbm.VoBase");sap.ui.vbm.VoBase.extend("sap.ui.vbm.Route",{metadata:{publicMethods:["openDetailWindow","openContextMenu"],library:"sap.ui.vbm",properties:{"position":{type:"string",group:"Misc",defaultValue:null},"color":{type:"string",group:"Misc",defaultValue:'RGB(0;0;0)'},"start":{type:"string",group:"Misc",defaultValue:'0'},"end":{type:"string",group:"Misc",defaultValue:'0'},"linewidth":{type:"string",group:"Misc",defaultValue:'5'},"dotcolor":{type:"string",group:"Misc",defaultValue:'RGB(0;0;0)'},"dotbordercolor":{type:"string",group:"Misc",defaultValue:'RGB(0;0;0)'},"dotwidth":{type:"string",group:"Misc",defaultValue:'0'}},aggregations:{"dragSource":{type:"sap.ui.vbm.DragSource",multiple:true,singularName:"dragSource"},"dropTarget":{type:"sap.ui.vbm.DropTarget",multiple:true,singularName:"dropTarget"}},events:{"click":{},"contextMenu":{},"drop":{}}}});sap.ui.vbm.Route.M_EVENTS={'click':'click','contextMenu':'contextMenu','drop':'drop'};
sap.ui.vbm.Route.prototype.openDetailWindow=function(c,o,a){this.oParent.openDetailWindow(this,{caption:c,offsetX:o,offsetY:a});};
sap.ui.vbm.Route.prototype.openContextMenu=function(m){this.oParent.openContextMenu(this,m);};