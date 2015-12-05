/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/m/CustomListItem','sap/m/Link','sap/m/MessageBox','sap/m/Popover','sap/ui/comp/library','sap/ui/core/Title','sap/ui/layout/form/SimpleForm'],function(q,C,L,M,P,l,T,S){"use strict";var N=P.extend("sap.ui.comp.navpopover.NavigationPopover",{metadata:{library:"sap.ui.comp",properties:{title:{type:"string",group:"Misc",defaultValue:null},semanticObjectName:{type:"string",group:"Misc",defaultValue:null},semanticAttributes:{type:"object",group:"Misc",defaultValue:null},appStateKey:{type:"string",group:"Misc",defaultValue:null},mainNavigationId:{type:"string",group:"Misc",defaultValue:null}},aggregations:{availableActions:{type:"sap.ui.comp.navpopover.LinkData",multiple:true,singularName:"availableAction"},mainNavigation:{type:"sap.ui.comp.navpopover.LinkData",multiple:false},ownNavigation:{type:"sap.ui.comp.navpopover.LinkData",multiple:false}},associations:{source:{type:"sap.ui.core.Control",multiple:false},extraContent:{type:"sap.ui.core.Control",multiple:false},component:{type:"sap.ui.core.Element",multiple:false}},events:{targetsObtained:{},navigate:{}}}});N.prototype.init=function(){P.prototype.init.call(this);this.addStyleClass("navigationPopover");this.setContentWidth("380px");this.setHorizontalScrolling(false);this.setPlacement("Horizontal");this._oHeaderForm=new S({maxContainerCols:1,visible:true});this._oMainNavigationText=new T();this._oMainNavigationLink=new L();this._oMainNavigationLink.attachPress(q.proxy(this._onLinkPress,this));this._oHeaderForm.addContent(this._oMainNavigationText);this._oHeaderForm.addContent(this._oMainNavigationLink);this._oForm=new S({maxContainerCols:1,visible:false});this._oNavigationList=new sap.m.List({showSeparators:"None"});this._oForm.addContent(new T({text:sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_LINKLIST_TEXT")}));this._oForm.addContent(this._oNavigationList);this.addContent(this._oHeaderForm);this.addContent(this._oForm);};N.prototype.addAvailableAction=function(o){this.addAggregation("availableActions",o);};N.prototype._createLinks=function(){var i;var o;var v;var h;var a;var c=this._getComponent();var x=this._getNavigationService();this._oNavigationList.removeAllItems();v=this.getMainNavigationId();if(!v){var s=this._getSourceControl();if(s){v=s.getSemanticObjectValue();}}this._oMainNavigationText.setText(v);var m=this.getMainNavigation();if(m){h=m.getHref();if(h){this._oHeaderForm.removeStyleClass("navpopoversmallheader");this._oMainNavigationLink.setText(m.getText());if(x){h=x.hrefForExternal({target:{shellHash:h}},c);}this._oMainNavigationLink.setHref(h);this._oMainNavigationLink.setVisible(true);}else{this._oHeaderForm.addStyleClass("navpopoversmallheader");this._oMainNavigationLink.setText("");this._oMainNavigationLink.setVisible(false);}}var A=this.getAvailableActions();if(A){for(i=0;i<A.length;i++){o=new L();a=A[i];if(a){o.setText(a.getText());o.attachPress(q.proxy(this._onLinkPress,this));h=a.getHref();if(x){h=x.hrefForExternal({target:{shellHash:h}},c);}o.setHref(h);}this._oNavigationList.addItem(new C({content:o}));}}this._setListVisibility();};N.prototype.insertAvailableAction=function(o,i){this.insertAggregation("availableActions",o,i);};N.prototype.removeAvailableAction=function(o){var i;if(typeof(o)==="number"){i=o;}else{i=this.getAvailableActions().indexOf(o);}if(i>=0){this._oNavigationList.removeItem(i);}var r=this.removeAggregation("availableActions",o);this._setListVisibility();return r;};N.prototype.removeAllAvailableActions=function(){this._oNavigationList.removeAllItems();this.removeAllAggregation("availableActions");this._setListVisibility();};N.prototype._setListVisibility=function(){var a=this.getAvailableActions().length;this._oForm.setVisible(a>0);};N.prototype._onLinkPress=function(e){var s=e.getSource();this.fireNavigate({text:s.getText(),href:s.getHref()});};N.prototype.setSemanticObjectName=function(s){this.setProperty("semanticObjectName",s);this.removeAllAvailableActions();this.setMainNavigation(null);};N.prototype._getNavigationService=function(){return sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("CrossApplicationNavigation");};N.prototype._getUrlService=function(){return sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService("URLParsing");};N.prototype.retrieveNavTargets=function(){var s=this.getSemanticObjectName();var m=this.getSemanticAttributes();var a=this.getAppStateKey();this._retrieveNavTargets(s,m,a);};N.prototype._retrieveNavTargets=function(s,m,a){var t=this;this.setMainNavigation(null);this.removeAllAvailableActions();var x=this._getNavigationService();if(!x){q.sap.log.error("Service 'CrossApplicationNavigation' could not be obtained");this.fireTargetsObtained();return;}var I=false;var c=this._getComponent();var p=x.getSemanticObjectLinks(s,m,I,c,a);p.fail(q.proxy(function(){q.sap.log.error("'getSemanticObjectLinks' failed");},this));p.done(q.proxy(function(b){var i,d,e;var u,o;var f;var h=false;if(b&&b.length){u=t._getUrlService();var g=x.hrefForExternal();for(i=0;i<b.length;i++){d=b[i].intent;e=b[i].text;f=new sap.ui.comp.navpopover.LinkData({text:e,href:d});if(d.indexOf(g)===0){this.setOwnNavigation(f);continue;}o=u.parseShellHash(d);if(o.action&&(o.action==='displayFactSheet')&&!h){f.setText(sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_FACTSHEET"));t.setMainNavigation(f);h=true;}else{t.addAvailableAction(f);}}}t.fireTargetsObtained();},this));};N.prototype._getComponent=function(){var c=this.getComponent();if(typeof c==="string"){c=sap.ui.getCore().getComponent(c);}return c;};N.prototype.show=function(){var s=this._getSourceControl();if(!s){q.sap.log.error("no source assigned");return;}var m=this.getMainNavigation();var a=this.getAvailableActions();if(!(m&&(m.getHref()))&&!(a&&(a.length>0))){q.sap.log.error("no navigation targets found");M.show(sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_DETAILS_NAV_NOT_POSSIBLE"),{icon:M.Icon.ERROR,title:sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("POPOVER_MSG_NAV_NOT_POSSIBLE"),styleClass:(this.$()&&this.$().closest(".sapUiSizeCompact").length)?"sapUiSizeCompact":""});return;}this._createLinks();this.openBy(s);};N.prototype._getSourceControl=function(){var s=null;var c=this.getSource();if(c){s=sap.ui.getCore().getControl(c);}return s;};N.prototype.setExtraContent=function(c){var o=this.getExtraContent();if(o&&c&&o===c.getId()){return;}if(o){var O=sap.ui.getCore().getControl(o);this.removeContent(O);}this.setAssociation("extraContent",c);if(c){this.insertContent(c,1);}};return N;},true);
