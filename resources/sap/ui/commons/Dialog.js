/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/Popup'],function(q,l,C,P){"use strict";var D=C.extend("sap.ui.commons.Dialog",{metadata:{interfaces:["sap.ui.core.PopupInterface"],library:"sap.ui.commons",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},scrollLeft:{type:"int",group:"Behavior",defaultValue:0},scrollTop:{type:"int",group:"Behavior",defaultValue:0},title:{type:"string",group:"Misc",defaultValue:''},applyContentPadding:{type:"boolean",group:"Appearance",defaultValue:true},showCloseButton:{type:"boolean",group:"Behavior",defaultValue:true},resizable:{type:"boolean",group:"Behavior",defaultValue:true},minWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},minHeight:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},maxWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},maxHeight:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},contentBorderDesign:{type:"sap.ui.commons.enums.BorderDesign",group:"Appearance",defaultValue:sap.ui.commons.enums.BorderDesign.None},modal:{type:"boolean",group:"Misc",defaultValue:false},accessibleRole:{type:"sap.ui.core.AccessibleRole",group:"Accessibility",defaultValue:sap.ui.core.AccessibleRole.Dialog},keepInWindow:{type:"boolean",group:"Behavior",defaultValue:false},autoClose:{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"content",aggregations:{buttons:{type:"sap.ui.core.Control",multiple:true,singularName:"button"},content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}},associations:{defaultButton:{type:"sap.ui.commons.Button",multiple:false},initialFocus:{type:"sap.ui.core.Control",multiple:false}},events:{closed:{parameters:{width:{type:"int"},height:{type:"int"},top:{type:"int"},left:{type:"int"}}}}}});D.prototype.init=function(){this.oPopup=new P(this,true,true);var e=P.Dock;this.oPopup.setPosition(e.CenterCenter,e.CenterCenter,window);this._minWidth=64;this._minHeight=48;this.allowTextSelection(false);this._mParameters={};this._mParameters.that=this;this._mParameters.firstFocusable=this.getId()+"-fhfe";this._mParameters.lastFocusable=this.getId()+"-fhee";};D.prototype.setInitialFocus=function(i){if(i!=null&&typeof i!="string"){i=i.getId();}this.oPopup.setInitialFocusId(i);this.setAssociation("initialFocus",i,true);};D.prototype.onAfterRendering=function(){var $=this.$("cont");if(!D._isSizeSet(this.getWidth())&&!D._isSizeSet(this.getMaxWidth())){$.children().each(function(i,b){if(q.trim(this.style.width)=="100%"){this.style.width="auto";}});}if(!!sap.ui.Device.browser.internet_explorer&&(sap.ui.Device.browser.version==9||sap.ui.Device.browser.version==10)&&($.length>0)){var e=$[0];if(sap.ui.getCore().getConfiguration().getRTL()&&!D._isSizeSet(this.getWidth())){if(e.ownerDocument&&e.ownerDocument.defaultView&&e.ownerDocument.defaultView.getComputedStyle){var w=e.ownerDocument.defaultView.getComputedStyle(e).getPropertyValue("width");if(w){var W=parseFloat(w,10);if(W%1==0.5){$[0].style.width=(W+0.01)+"px";}}}}}if(!D._isSizeSet(this.getHeight())&&D._isSizeSet(this.getMinHeight())){var f=this.getDomRef("footer");var a=f.offsetTop+f.offsetHeight;var d=this.getDomRef().offsetHeight;if(a<d){this.$().removeClass("sapUiDlgFlexHeight");}}var _=this.getMinSize();this._minWidth=_.width;this._minHeight=_.height;};D.prototype.onclick=function(e){switch(e.target.id){case this.getId()+"-close":this.close();e.preventDefault();break;}return false;};D.prototype.open=function(){if(!this.oPopup){q.sap.log.fatal("This dialog instance has been destroyed already");}else if(!this._bOpen){this._oPreviousFocus=P.getCurrentFocusInfo();this.oPopup.attachEvent("opened",this.handleOpened,this);this.oPopup.attachEvent("closed",this.handleClosed,this);this.oPopup.setModal(this.getModal());this.oPopup.setAutoClose(this.getAutoClose());this.oPopup.open(400);this._bOpen=true;}};D.prototype._handleOpened=function(){this.$().show();var i=this.getInitialFocus(),f;if(i&&(f=sap.ui.getCore().getControl(i))){f.focus();this._bInitialFocusSet=true;}else{i=this.getDefaultButton();if(i&&(f=sap.ui.getCore().getControl(i))&&f.getParent()===this){f.focus();this._bInitialFocusSet=true;}else if(this.getButtons().length>0){this.getButtons()[0].focus();this._bInitialFocusSet=true;}else if(this.getContent().length>0){this.getContent()[0].focus();this._bInitialFocusSet=true;}}};D.prototype.handleOpened=function(){this.oPopup.detachEvent("opened",this.handleOpened,this);if(sap.ui.Device.browser.internet_explorer&&sap.ui.Device.browser.version===11){q.sap.clearDelayedCall(this._delayedCallId);this._delayedCallId=q.sap.delayedCall(0,this,this._handleOpened);}else{this._handleOpened();}};D.prototype.close=function(){if(!this._bOpen){return;}var r=this.$().rect();this._bOpen=false;this._bInitialFocusSet=false;if(this.oPopup.isOpen()){this.oPopup.close(400);}q.sap.delayedCall(400,this,"restorePreviousFocus");q.each(r,function(k,v){r[k]=parseInt(v,10);});this._oRect=r;};D.prototype.handleClosed=function(){this.oPopup.detachEvent("closed",this.handleClosed,this);this.fireClosed(this._oRect);this.close();this.$().hide();};D.prototype.restorePreviousFocus=function(){P.applyFocusInfo(this._oPreviousFocus);};D.prototype.setTitle=function(t){this.setProperty("title",t,true);this.$("lbl").text(t);return this;};D.prototype.exit=function(){var w=this.isOpen();this.close();this.oPopup.detachEvent("opened",this.handleOpened,this);this.oPopup.detachEvent("closed",this.handleClosed,this);this.oPopup.destroy();if(w){this.fireClosed(this._oRect);}this.oPopup=null;delete this._mParameters;};D._isSizeSet=function(c){return(c&&!(c=="auto")&&!(c=="inherit"));};D.prototype.onsapescape=function(e){this.close();e.preventDefault();e.stopPropagation();};D.prototype.onsapenter=function(e){var f,i=this.getDefaultButton();if(i&&(f=sap.ui.getCore().byId(i))&&q.contains(this.getDomRef(),f.getDomRef())){if(f instanceof sap.ui.commons.Button){f.onclick(e);}}e.preventDefault();e.stopPropagation();};D.prototype.onfocusin=function(e){this.sLastRelevantNavigation=null;if(!this._bInitialFocusSet){return;}this._mParameters.event=e;this._mParameters.$FocusablesContent=q(":sapFocusable",this.$("cont"));this._mParameters.$FocusablesFooter=q(":sapFocusable",this.$("footer"));this.oPopup.focusTabChain(this._mParameters);};D.prototype.restoreFocus=function(){if(this.oRestoreFocusInfo&&this.oPopup.bOpen){var c=sap.ui.getCore().getControl(this.oRestoreFocusInfo.sFocusId);if(c){c.applyFocusInfo(this.oRestoreFocusInfo.oFocusInfo);}}};D.prototype.onselectstart=function(e){if(!q.sap.containsOrEquals(this.getDomRef("cont"),e.target)){e.preventDefault();e.stopPropagation();}};D.prototype.getMinSize=function(){var d=q.sap.domById(this.sId),t=q.sap.domById(this.sId+"-hdr"),f=q.sap.domById(this.sId+"-footer"),h=0,w=0,a=0;var F=q(f).children("DIV").get(0);w=F.offsetWidth;var b=0;b+=q(f).outerWidth(false)-q(f).width();b+=q(d).outerWidth(false)-q(d).width();if(b<=20){b=20;}w+=b;if(isNaN(w)||w<100){w=100;}h=t.offsetHeight;a=f.offsetHeight;return{width:w,height:h+a+36};};D.prototype.isOpen=function(){return this.oPopup.isOpen();};D.prototype.getOpenState=function(){return this.oPopup.getOpenState();};D.prototype.getEnabled=function(){var e=this.getOpenState();return e===sap.ui.core.OpenState.OPENING||e===sap.ui.core.OpenState.OPEN;};D.prototype.ondragstart=function(e){if(this.sDragMode=="resize"||this.sDragMode=="move"){e.preventDefault();e.stopPropagation();}};D.prototype.onmousedown=function(e){var s=e.target,i=this.getId();this._bRtlMode=sap.ui.getCore().getConfiguration().getRTL();if(q.sap.containsOrEquals(this.getDomRef("hdr"),s)){if(s.id!=(i+"-close")){this.sDragMode="move";this._RootWidth=this.getDomRef().offsetWidth;this._RootHeight=this.getDomRef().offsetHeight;}}else if(s.id==i+"-grip"){this.sDragMode="resize";var d=this.getDomRef();var w=d.offsetWidth+"px";d.style.width=w;var h=d.offsetHeight+"px";d.style.height=h;q(d).removeClass("sapUiDlgFlexHeight sapUiDlgFlexWidth");this.setProperty("width",w,true);this.setProperty("height",h,true);}if(this.sDragMode==null){return;}var a=document.activeElement;if(a&&a.id){var c=q.sap.byId(a.id).control(0);if(c){this.oRestoreFocusInfo={sFocusId:c.getId(),oFocusInfo:c.getFocusInfo()};}}this.startDragX=e.screenX;this.startDragY=e.screenY;this.originalRectangle=this.$().rect();q(window.document).bind("selectstart",q.proxy(this.ondragstart,this));q(window.document).bind("mousemove",q.proxy(this.handleMove,this));q(window.document).bind("mouseup",q.proxy(this.handleMouseUp,this));var o=D._findSameDomainParentWinDoc();if(o){q(o).bind("selectstart",q.proxy(this.ondragstart,this));q(o).bind("mousemove",q.proxy(this.handleMove,this));q(o).bind("mouseup",q.proxy(this.handleMouseUp,this));}};D._findSameDomainParentWinDoc=function(){var o=null;try{var w=window;while(w.parent&&(w.parent!=w)){if(w.parent.document){o=w.parent.document;w=w.parent;}}}catch(e){}return o;};D.prototype.handleMove=function(e){if(!this.sDragMode){return;}e=e||window.event;if(this.sDragMode=="resize"){var d=e.screenX-this.startDragX;var a=e.screenY-this.startDragY;var w=(this._bRtlMode?this.originalRectangle.width-d:this.originalRectangle.width+d);var h=this.originalRectangle.height+a;w=Math.max(w,this._minWidth);h=Math.max(h,this._minHeight);var o=this.getDomRef();o.style.width=w+"px";o.style.height=h+"px";w=this.getDomRef().offsetWidth;h=this.getDomRef().offsetHeight;o.style.width=w+"px";o.style.height=h+"px";this.setProperty("width",w+"px",true);this.setProperty("height",h+"px",true);}else if(this.sDragMode=="move"){var L=this.originalRectangle.left+e.screenX-this.startDragX;var t=this.originalRectangle.top+e.screenY-this.startDragY;t=Math.max(t,0);if(this._bRtlMode||this._keepInWindow()){L=Math.min(L,document.documentElement.clientWidth-this._RootWidth);}if(!this._bRtlMode||this._keepInWindow()){L=Math.max(L,0);}if(this._keepInWindow()){t=Math.min(t,document.documentElement.clientHeight-this._RootHeight);}this.oPopup.setPosition(P.Dock.LeftTop,{left:L,top:t});}e.cancelBubble=true;return false;};D.prototype._keepInWindow=function(){return this.getKeepInWindow()||this.getModal();};D.prototype.handleMouseUp=function(e){if(this.sDragMode==null){return;}q(window.document).unbind("selectstart",this.ondragstart);q(window.document).unbind("mousemove",this.handleMove);q(window.document).unbind("mouseup",this.handleMouseUp);var o=D._findSameDomainParentWinDoc();if(o){q(o).unbind("selectstart",this.ondragstart);q(o).unbind("mousemove",this.handleMove);q(o).unbind("mouseup",this.handleMouseUp);}if(!!sap.ui.Device.browser.webkit){sap.ui.core.RenderManager.forceRepaint(this.getId());}this.restoreFocus();this.sDragMode=null;};D.setAutoClose=function(a){this.oPopup.setAutoClose(a);};D.getAutoClose=function(){this.oPopup.getAutoClose();};return D;},true);
