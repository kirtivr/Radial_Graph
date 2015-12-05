/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/library","sap/ui/core/message/MessageParser","sap/ui/core/message/Message"],function(q,c,M,a){"use strict";var s={"error":sap.ui.core.MessageType.Error,"warning":sap.ui.core.MessageType.Warning,"success":sap.ui.core.MessageType.Success,"info":sap.ui.core.MessageType.Information};var O=M.extend("sap.ui.model.odata.ODataMessageParser",{metadata:{publicMethods:["parse","setProcessor","getHeaderField","setHeaderField"]},constructor:function(S,m){M.apply(this);this._serviceUrl=S;this._metadata=m;this._processor=null;this._headerField="sap-message";this._lastMessages=[];}});O.prototype.getHeaderField=function(){return this._headerField;};O.prototype.setHeaderField=function(f){this._headerField=f;return this;};O.prototype.parse=function(r,R,G,C){var m=[];if(r.statusCode>=200&&r.statusCode<300){this._parseHeader(m,r);}else if(r.statusCode>=400&&r.statusCode<600){this._parseBody(m,r);}else{q.sap.log.warning("No rule to parse OData response with status "+r.statusCode+" for messages");}if(m.length>0){if(!this._processor){this._outputMesages(m);}this._propagateMessages(m,r,R,G,C);}};O.prototype._propagateMessages=function(m,r,R,G,C){var i,t;var A=q.extend({"":true},G,C);t=m[0].getTarget();if(t){var e=this._metadata._getEntitySetByPath(t);if(e){A[e.name]=true;}}for(i=0;i<m.length;++i){t=m[i].getTarget();if(!A[t]){q.sap.log.error("Service returned messages for entities that were not requested. "+"This might lead to wrong message processing and loss of messages");A[t]=true;}}var d=[];var k=[];for(i=0;i<this._lastMessages.length;++i){t=this._lastMessages[i].getTarget();if(A[t]){d.push(this._lastMessages[i]);}else{k.push(this._lastMessages[i]);}}this.getProcessor().fireMessageChange({oldMessages:d,newMessages:m});this._lastMessages=k.concat(m);};O.prototype._createMessage=function(m,i){var t=m["@sap.severity"]?m["@sap.severity"]:m["severity"];t=s[t]?s[t]:t;var C=m.code?m.code:"";var T=typeof m["message"]==="object"&&m["message"]["value"]?m["message"]["value"]:m["message"];var d=m.target?m.target:"";d=d.substr(0,1)==="/"?d.substr(1):d;return new a({type:t,code:C,message:T,target:d,processor:this._processor,technical:i});};O.prototype._parseHeader=function(m,r){var f=this.getHeaderField();if(!r.headers||!r.headers[f]){return;}var d=r.headers[f];var S=null;try{S=JSON.parse(d);m.push(this._createMessage(S));if(S.details&&q.isArray(S.details)){for(var i=0;i<S.details.length;++i){m.push(this._createMessage(S.details[i]));}}}catch(e){q.sap.log.error("The message string returned by the back-end could not be parsed");return;}};O.prototype._parseBody=function(m,r){var C=g(r);if(C.indexOf("xml")>-1){this._parseBodyXML(m,r,C);}else{this._parseBodyJSON(m,r);}};O.prototype._parseBodyXML=function(d,r,C){try{var D=new DOMParser();var o=D.parseFromString(r.body,C);var p="//*[local-name()='error'] | "+"//*[local-name()='errordetails']/*[local-name()='errordetail'] | "+"//*[local-name()='details']/*[local-name()='error']";var X=b();var N=X.selectNodes(o,p);for(var i=0;i<N.length;++i){var e=X.nextNode(N,i);var E={};E["severity"]=sap.ui.core.MessageType.Error;for(var n=0;n<e.childNodes.length;++n){var f=e.childNodes[n];var h=f.nodeName;if(h==="errordetails"||h==="details"||h==="innererror"){continue;}if(h==="message"&&f.hasChildNodes()&&f.firstChild.nodeType!==window.Node.TEXT_NODE){for(var m=0;m<f.childNodes.length;++m){if(f.childNodes[m].nodeName==="value"){E["message"]=X.getNodeText(f.childNodes[m]);}}}else{E[f.nodeName]=X.getNodeText(f);}}d.push(this._createMessage(E,true));}}catch(j){q.sap.log.error("Error message returned by server could not be parsed");}};O.prototype._parseBodyJSON=function(m,r){try{var e=JSON.parse(r.body);var E;if(e["error"]){E=e["error"];}else{E=e["odata.error"];}if(!E){q.sap.log.error("Error message returned by server did not contain error-field");return;}E["severity"]=sap.ui.core.MessageType.Error;m.push(this._createMessage(E,true));var f=null;if(q.isArray(E.details)){f=E.details;}else if(E.innererror&&q.isArray(E.innererror.errordetails)){f=E.innererror.errordetails;}else{f=[];}for(var i=0;i<f.length;++i){m.push(this._createMessage(f[i],true));}}catch(d){q.sap.log.error("Error message returned by server could not be parsed");}};O.prototype._outputMesages=function(m){for(var i=0;i<m.length;++i){var o="[OData Message] "+m.getMessage()+" - "+m.getDexcription()+" ("+m.getTarget()+")";switch(m[i].getSeverity()){case"error":q.sap.log.error(o);break;case"warning":q.sap.log.warning(o);break;case"success":q.sap.log.debug(o);break;case"info":default:q.sap.log.info(o);break;}}};function g(r){if(r&&r.headers){for(var h in r.headers){if(h.toLowerCase()==="content-type"){return r.headers[h];}}}return false;}var x=null;function b(){if(x===null){x={};if(sap.ui.Device.browser.msie){x={selectNodes:function(S,p){return S.selectNodes(p);},nextNode:function(n){return n.nextNode();},getNodeText:function(n){return n.text;}};}else{x={selectNodes:function(S,p){var d=S.evaluate(p,S,null,7,null);d.length=d.snapshotLength;return d;},nextNode:function(n,i){return n.snapshotItem(i);},getNodeText:function(n){return n.textContent;}};}}return x;}return O;});