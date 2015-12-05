/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/m/Dialog","sap/m/FlexBox","sap/m/FlexItemData","sap/m/Text","sap/m/Button","sap/m/DialogType","sap/ui/core/mvc/XMLView","sap/ui/comp/smartform/SmartForm","sap/ui/comp/smartform/Group","sap/ui/comp/smartform/GroupElement","sap/ui/comp/odata/FieldSelector","sap/ui/fl/Utils","sap/ui/model/json/JSONModel","sap/ui/fl/FlexControllerFactory","sap/m/MessageBox","sap/ui/comp/transport/TransportSelection","sap/ui/fl/Transports","sap/ui/fl/registry/Settings"],function(q,D,F,a,T,B,b,X,S,c,d,e,f,J,g,M,h,l,m){"use strict";var n=function(){this._oOriginalDataModelForDialog=null;};n.prototype.init=function(s){this._oSmartForm=s;this._oDialogContent=null;this._textResources=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");this._oDialog=this._createDialog();var t=false;if(t===false){this._oDialog.setTitle(this._textResources.getText("FORM_PERS_DIALOG_TITLE"));this._oDialogContent=this._createDialogContent();this._oDialog.addContent(this._oDialogContent);}else{this._oDialog.setType(b.Message);this._oDialog.setTitle(this._textResources.getText("FORM_PERS_DIALOG_ERR_TITLE"));this._showMergeErrorMessage();}this._createButtons();};n.prototype._createDialog=function(){var o;o=new D("smartFormPersDialog",{contentWidth:"60%",contentHeight:"60%",verticalScrolling:false,horizontalScrolling:false});return o;};n.prototype._createButtons=function(){var o=new B(this._oDialog.getId()+'-OkButton');o.setText(this._textResources.getText("FORM_PERS_DIALOG_OK"));o.attachPress(this._dialogOkClicked.bind(this));this._oDialog.addButton(o);var C=new B(this._oDialog.getId()+'-CancelButton');C.setText(this._textResources.getText("FORM_PERS_DIALOG_CANCEL"));C.attachPress({sAction:"cancel"},this._closeDialog,this);this._oDialog.addButton(C);var i=new B();i.setText(this._textResources.getText("FORM_PERS_DIALOG_RESET"));i.attachPress({sAction:"discard"},this._confirmDiscardAllChanges,this);this._oDialog.addButton(i);var t=this;var j=this._getFlexController();m.getInstance(j.getComponentName()).then(function(s){if(!s.isProductiveSystem()){var k=new B();k.setText(t._textResources.getText("FORM_PERS_DIALOG_TRANSPORT"));k.attachPress({sAction:"transport"},t._confirmTransportAllChanges,t);if(t._oDialog){t._oDialog.addButton(k);}}});};n.prototype._showTransportErrorMessage=function(E){return this._showErrorMessage(E,"FORM_PERS_TRANSPORT_ERROR_TITLE","FORM_PERS_TRANSPORT_ERROR_MESSAGE");};n.prototype._openTransportSelection=function(C){var t=this;return new Promise(function(r,i){var o=function(R){if(R&&R.getParameters){var s=R.getParameters().selectedTransport;var p=R.getParameters().selectedPackage;var k=R.getParameters().dialog;var u={transport:s,packageName:p,fromDialog:k};r(u);}else{r({});}};var E=function(k){t._showTransportErrorMessage(k).then(function(){i(k);});};var O={};if(C){O["package"]=C.getPackage();O.namespace=C.getNamespace();O.name=C.getId();O.type=C.getDefinition().fileType;}var j=new sap.ui.comp.transport.TransportSelection();j.selectTransport(O,o,E,false,t._oSmartForm);});};n.prototype._dialogOkClicked=function(){var C=this._getChangeDataFromDialog();if(C.length===0){this._closeDialog();return new Promise(function(r,i){r({});});}var t=this;return t._createAndApplyChanges(C).then(function(){t._closeDialog();});};n.prototype._createAndApplyChanges=function(C){return Promise.resolve().then(function(){var o;o=this._getFlexController();function v(i){return i&&i.selector&&i.selector.id;}try{C.filter(v).forEach(function(i){var j=this._getControlById(i.selector.id);o.createAndApplyChange(i,j);}.bind(this));}finally{return o.saveAll();}}.bind(this));};n.prototype._getControlById=function(C){return sap.ui.getCore().byId(C);};n.prototype._getFlexController=function(){return g.createForControl(this._oSmartForm);};n.prototype._createDialogContent=function(){var i,j,C;if(!this._oSmartForm){return undefined;}j=this._createModelFromSmartForm(this._oSmartForm);j.isMoveDownButtonEnabled=false;j.isMoveUpButtonEnabled=false;j.isMoveBottomButtonEnabled=false;j.isMoveTopButtonEnabled=false;this._oOriginalDataModelForDialog=JSON.parse(JSON.stringify(j));this._oModel=new J();this._oModel.setData(j);i=new sap.ui.comp.smartform.flexibility.DialogContent(this._oDialog.getId()+'-Content');i.setModel(this._oModel);var v=f.getViewForControl(this._oSmartForm);i.setViewId(v.createId(""));C=f.getComponentClassName(this._oSmartForm);var I=this._getIgnoredFields(this._oSmartForm);i.initialiseODataFieldSelector(this._oSmartForm.getModel(),this._oSmartForm.getEntityType(),C,I);return i;};n.prototype._getIgnoredFields=function(s){if(s){var C=s.getIgnoredFields();if(C){var i=C.split(",");return i;}}return[];};n.prototype._createChangeSpecificDataFromDialogModel=function(j,k){var C=[],o;var p={};this._createNodeMap(j,p);var r={};this._createNodeMap(k,r);var i,I,N,s,t;var u=Object.keys(p);for(i=0;i<u.length;i++){I=u[i];if(r[I]&&r[I].node){N=p[I].node;s=r[I].node;if(N.label&&s.label&&N.label!==s.label){o=this._createLabelChange(I,s.label,s.type);if(o&&o.selector&&o.selector.id){C.push(o);}}if((N.isVisible&&!s.isVisible)||(!N.isVisible&&s.isVisible)){if(s.isVisible){t=true;}else{t=false;}C.push(this._createVisibilityChange(I,t));}}}var P={};for(i=0;i<k.length;i++){this._check4AddChanges(k[i],p,C,P);}for(i=0;i<k.length;i++){this._check4InterMoveChanges(k[i],r,p,C,P);this._check4IntraMoveChanges(k[i],r,p,C,P);}return C;};n.prototype._check4AddChanges=function(p,o,C,P){if(p&&p.id&&p.children){var i,s=0,I,j,k;j=p.id;if(o[j]&&o[j].node){var r=o[j].node;if(!P){P={};}P[j]={};P[j].index={};for(i=0;i<r.children.length;i++){k=r.children[i];I=k.id;P[j].index[I]=i;}}for(i=0;i<p.children.length;i++){k=p.children[i];if(k.id){I=k.id;if(!o[I]){var t=this._createAddChange(j,k,i);if(t&&t.selector&&t.selector.id){C.push(t);s++;if(!k.isVisible){C.push(this._createVisibilityChange(I,false));}}}else if(s>0&&P[j].index[I]!==undefined){P[j].index[I]=P[j].index[I]+s;}this._check4AddChanges(k,o,C,P);}}}};n.prototype._check4InterMoveChanges=function(p,o,r,C,P){if(p&&p.id&&p.children){var i,I,s,t,u=[],v={},w,x={};s=p.id;var L=p.children.length;for(i=0;i<L;i++){w=p.children[i];if(w.id){I=w.id;if(r[I]&&r[I].index!==undefined){if(!r[I].index[s]&&r[I].index[s]!==0){var j,y=[];y=Object.keys(r[I].index);for(j=0;j<y.length;j++){t=y[j];if(!v[t]){v[t]=[];}v[t].push({"id":I,"index":o[I].index[s]});var z,A=[],E,k;if(P[t].index[I]!==undefined){E=P[t].index[I];delete P[t].index[I];A=Object.keys(P[t].index);for(k=0;k<A.length;k++){z=A[k];if(P[t].index[z]>E){P[t].index[z]--;}}}if(P[s]){E=o[I].index[s];A=Object.keys(P[s].index);for(k=0;k<A.length;k++){z=A[k];if(P[s].index[z]>=E){P[s].index[z]++;}}P[s].index[I]=E;}}}}this._check4InterMoveChanges(w,o,r,C,P);}}if(v){u=Object.keys(v);for(i=0;i<u.length;i++){t=u[i];x=this._createMoveChange(t,p.type,v[t],p.id);if(x&&x.selector&&x.selector.id){C.push(x);}}}}};n.prototype._check4IntraMoveChanges=function(p,o,j,C,P){if(p&&p.id&&p.children){var i,I,s,k=[],r,t={};s=p.id;var L=p.children.length;for(i=0;i<L;i++){r=p.children[i];if(r.id){I=r.id;if(j[I]&&j[I].index!==undefined){if(j[I].index[s]!==undefined&&j[I].index[s]!==i){if(P[s].index[I]!==undefined&&P[s].index[I]!==i){k.push({"id":I,"index":o[I].index[s]});}}}this._check4IntraMoveChanges(r,o,j,C,P);}}if(k.length>0){t=this._createMoveChange(s,p.type,k,"");if(t&&t.selector&&t.selector.id){C.push(t);}}}};n.prototype._createAddChange=function(i,N,I){var A={};A.selector={};A.selector.id=i;A.index=I;A.newControlId=N.id;switch(N.type){case"form":A={};break;case"group":A.changeType="addGroup";if(!N.label){A.groupLabel="";}else{A.groupLabel=N.label;}break;case"field":A.changeType="addField";if(!N.label){A.fieldLabel="";}else{A.fieldLabel=N.label;}if(!N.fieldValue){A.fieldValue="";}else{A.fieldValue=N.fieldValue;}if(!N.valueProperty){A.valueProperty="";}else{A.valueProperty=N.valueProperty;}if(!N.jsType){A.jsType="";}else{A.jsType=N.jsType;}break;default:A={};break;}return A;};n.prototype._createLabelChange=function(i,L,t){var o={};o.selector={};o.selector.id=i;switch(t){case"form":o={};break;case"group":o.changeType="renameGroup";o.groupLabel=L;break;case"field":o.changeType="renameField";o.fieldLabel=L;break;default:o={};break;}return o;};n.prototype._createMoveChange=function(i,t,I,s){var o={};o.selector={};o.selector.id=i;switch(t){case"form":o.changeType="moveGroups";o.moveGroups=I;break;case"group":o.changeType="moveFields";o.moveFields=I;break;default:o={};break;}if(s){o.targetId=s;}return o;};n.prototype._createVisibilityChange=function(i,I){var v={};v.selector={};v.selector.id=i;if(I===true){v.changeType="unhideControl";}else{v.changeType="hideControl";}return v;};n.prototype._createNodeMap=function(j,N,p){if(!N){throw new Error("Node map instance must be provided");}if(!j||!j.length){return;}var o,I;var i,L=j.length;for(i=0;i<L;i++){o=j[i];if(o&&o.id){I=o.id;if(!N[I]){N[I]={};N[I].node=o;}if(p&&p.id){if(!N[I].index){N[I].index={};}N[I].index[p.id]=i;}if(o.children){this._createNodeMap(o.children,N,o);}}}};n.prototype.show=function(){this._oDialog.open();};n.prototype._showMergeErrorMessage=function(){var o=new F();o.setDirection("Column");o.setAlignItems("Start");var i=new T();i.setText(this._textResources.getText("FORM_PERS_DIALOG_ERR_DESC"));i.setLayoutData(new a({order:1,growFactor:1}));var j=new T();j.setText(this._textResources.getText("FORM_PERS_DIALOG_ERR_HINT"));j.setLayoutData(new a({order:1,growFactor:1}));o.addItem(i);o.addItem(j);this._oDialog.addContent(o);};n.prototype._closeDialog=function(){if(this._oDialogContent){this._oDialogContent.destroy();this._oDialogContent=null;}if(this._oDialog){this._oDialog.close();this._oDialog.destroy();}this._oDialog=null;};n.prototype._createSmartFormControlMap=function(s){var C=[];var k;if(s){k=s.getId();C[k]=s;var G=s.getGroups();if(G){for(var i=0;i<G.length;i++){var o=G[i];if(o){k=o.getId();C[k]=o;var p=o.getGroupElements();if(p){for(var j=0;j<p.length;j++){var r=p[j];if(r){k=r.getId();C[k]=r;}}}}}}}return C;};n.prototype._showDiscardSuccessMessage=function(){var t=this;var s=function(){t._closeDialog();};var i=this._textResources.getText("FORM_PERS_DISCARD_SUCCESS_MESSAGE");var j=this._textResources.getText("FORM_PERS_DISCARD_SUCCESS_TITLE");M.show(i,{icon:M.Icon.SUCCESS,title:j,onClose:s});};n.prototype._showTransportSuccessMessage=function(){var t=this;var s=function(){t._closeDialog();};var i=this._textResources.getText("FORM_PERS_TRANSPORT_SUCCESS_MESSAGE");var j=this._textResources.getText("FORM_PERS_TRANSPORT_SUCCESS_TITLE");M.show(i,{icon:M.Icon.SUCCESS,title:j,onClose:s});};n.prototype._showTransportInapplicableMessage=function(){var t=this;var s=function(){t._closeDialog();};var i=this._textResources.getText("FORM_PERS_TRANSPORT_INAPPLICABLE_MESSAGE");var j=this._textResources.getText("FORM_PERS_TRANSPORT_INAPPLICABLE_TITLE");M.show(i,{icon:M.Icon.INFORMATION,title:j,onClose:s});};n.prototype._showDiscardErrorMessage=function(E){var i=[E];if(E.message){i=[E.message];}var s=this._textResources.getText("FORM_PERS_DISCARD_ERROR_MESSAGE",i);var t=this._textResources.getText("FORM_PERS_DISCARD_ERROR_TITLE");M.show(s,{icon:M.Icon.ERROR,title:t});};n.prototype._showApplySaveChangesErrorMessage=function(E){return this._showErrorMessage(E,"FORM_PERS_APPLYSAVE_ERROR_TITLE","FORM_PERS_APPLYSAVE_ERROR_MESSAGE");};n.prototype._showErrorMessage=function(E,t,s){return new Promise(function(r){if(E.sId===''||E.sId==='cancel'){r();}else{var i=[E.message||E];var j=this._textResources.getText(s,i);var k=this._textResources.getText(t);M.show(j,{icon:M.Icon.ERROR,title:k,onClose:r});}}.bind(this));};n.prototype._filterChangesForSmartForm=function(C,s){var r=[];var j=this._createSmartFormControlMap(s);for(var i=0;i<C.length;i++){var o=C[i];var k=o.getSelector().id;if(j[k]){r.push(o);}}return r;};n.prototype._setTransports=function(C,i,t,j){var k=this;if(i>=0){var o=C[i];if(j===true){o.setRequest(t);i--;return k._setTransports(C,i,t,j);}else{return k._openTransportSelection(o).then(function(p){o.setRequest(p.transport);if(p.fromDialog===true){t=p.transport;j=true;}i--;return k._setTransports(C,i,t,j);});}}else{return Promise.resolve();}};n.prototype._deleteChanges=function(C,s){var t=this;var i=this._filterChangesForSmartForm(C,s);var o=t._getFlexController();var j=i.length-1;return this._setTransports(i,j).then(function(){return o.discardChanges(i);}).then(function(){t._showDiscardSuccessMessage();})["catch"](function(E){t._showDiscardErrorMessage(E);});};n.prototype._confirmDiscardAllChanges=function(){var t=this;var C=function(A){if(A==="OK"){var o=t._getFlexController();o.getComponentChanges().then(function(j){var k=t._convertToChangeArray(j);q.proxy(t._deleteChanges,t,k,t._oSmartForm).call();})["catch"](function(E){q.proxy(t._showDiscardErrorMessage,t,E).call();});}};var s=this._textResources.getText("FORM_PERS_RESET_MESSAGE");var i=this._textResources.getText("FORM_PERS_RESET_TITLE");M.confirm(s,{title:i,onClose:C});};n.prototype._confirmTransportAllChanges=function(){var C=this._getChangeDataFromDialog();var t=this;t._getAllLocalChanges().then(function(A){if(A&&C&&A.length+C.length===0){t._showTransportInapplicableMessage();return Promise.resolve();}else{t._createAndApplyChanges(C).then(function(){return t._openTransportSelection();},function(E){t._closeDialog();f.log.error("SmartForm changes could not be applied or saved: "+E);t._showApplySaveChangesErrorMessage(E);}).then(function(o){if(o&&o.transport&&o.packageName!=="$TMP"){return t._transportAllLocalChanges(o);}else{return Promise.resolve();}},function(E){t._showTransportErrorMessage(E);});}});};n.prototype._getChangeDataFromDialog=function(){var o,C;o=this._oModel.getData();C=this._createChangeSpecificDataFromDialogModel([this._oOriginalDataModelForDialog],[o]);return C;};n.prototype._getAllLocalChanges=function(){var t=this;return t._getFlexController().getComponentChanges().then(function(C){var A=t._convertToChangeArray(C);return t._filterChangesForSmartForm(A,t._oSmartForm);});};n.prototype._transportAllLocalChanges=function(t){var i=this;return i._getAllLocalChanges().then(function(A){var j=i._convertToChangeTransportData(A);var o=new l();var k={};k.transportId=t.transport;k.changeIds=j;return o.makeChangesTransportable(k).then(function(){A.forEach(function(C){if(C.getPackage()==='$TMP'){var p=C.getDefinition();p.packageName='';C.setResponse(p);}});}).then(function(){i._showTransportSuccessMessage();return Promise.resolve();});});};n.prototype._convertToChangeTransportData=function(L){var t=[];var j=L.length;for(var i=0;i<j;i++){var C=L[i];var o={};o.namespace=C.getNamespace();o.fileName=C.getId();o.fileType=C.getDefinition().fileType;t.push(o);}return t;};n.prototype._convertToChangeArray=function(C){var j=C;if(!q.isArray(C)){j=[];var k=Object.keys(C);for(var i=0;i<k.length;i++){j.push(C[k[i]]);}}return j;};n.prototype._createModelFromSmartForm=function(s){var j,o,i,p,r,t,k,u;if(s){j=this._getModelNodeForSmartForm(s);o=s.getGroups();if(o){for(i=0;i<o.length;i++){p=o[i];if(!f.checkControlId(p)){continue;}r=this._getModelNodeForSmartGroup(p);j.children.push(r);if(p){t=p.getGroupElements();if(t){for(k=0;k<t.length;k++){if(!f.checkControlId(t[k])){continue;}u=this._getModelNodeForSmartGroupElement(t[k]);r.children.push(u);}}}}}}return j;};n.prototype._getModelNodeForSmartForm=function(s){var r={};r.id=s.getId();r.label=s.getTitle();r.isVisible=s.getVisible();r.type="form";r.children=[];return r;};n.prototype._getModelNodeForSmartGroup=function(s){var r={};r.id=s.getId();r.label=s.getLabel();r.isVisible=s.getVisible();r.type="group";r.children=[];return r;};n.prototype._getModelNodeForSmartGroupElement=function(G){var r={};r.id=G.getId();r.label=G.getLabelText();r.isVisible=G.getVisible();r.type="field";return r;};return n;},true);