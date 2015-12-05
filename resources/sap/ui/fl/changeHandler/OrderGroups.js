/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2014-2015 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','./Base','sap/ui/fl/Utils'],function(q,B,F){"use strict";var O=function(){};O.prototype=q.sap.newObject(B.prototype);O.prototype.applyChange=function(c,C){if(!c){throw new Error("No change instance");}var o=c.getDefinition();if(!o.selector||!o.content||!o.content.orderGroups||o.content.orderGroups.length===0||Object.keys(o.selector).length!==1){throw new Error("Change format invalid");}if(!C||!C.getGroups){throw new Error("No control instance or wrong control instance supplied");}var g=C.getGroups();var G=g.length;var k=o.content.orderGroups;var K=k.length;var a={},b={};var s;var i;for(i=0;i<G;i++){b=g[i];if(!b.getId()){return;}s=b.getId();a[s]=b;}if(G>0){C.removeAllGroups();}for(i=0;i<G;i++){s=k[i];if(a[s]){C.insertGroup(a[s],i);a[s]=null;}}i=K;q.each(a,function(d,e){if(e!==null){i+=1;C.insertGroup(e,i);}});};O.prototype.completeChangeContent=function(c,s){var C=c.getDefinition();if(s.orderGroups){if(!C.content){C.content={};}if(!C.content.orderGroups){C.content.orderGroups={};}C.content.orderGroups=s.orderGroups;}else{throw new Error("oSpecificChangeInfo.orderGroups attribute required");}};return O;},true);
