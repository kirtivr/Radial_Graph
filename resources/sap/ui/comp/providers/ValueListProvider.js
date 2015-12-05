/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(['jquery.sap.global','sap/m/Column','sap/m/ColumnListItem','sap/m/Text','sap/m/Token','./BaseValueListProvider','sap/ui/core/Item','sap/ui/model/Filter','sap/ui/model/Sorter','sap/ui/model/json/JSONModel'],function(q,C,a,T,b,B,I,F,S,J){"use strict";var V=function(p){if(p){this.sAggregationName=p.aggregation;this.bTypeAheadEnabled=p.typeAheadEnabled;}B.apply(this,arguments);if(this.sValueListEntitySetName&&this.sKey){this._onInitialise();}};V.prototype=q.sap.newObject(B.prototype);V.prototype._onInitialise=function(){var e;if(!this.bTypeAheadEnabled){this._oTemplate=new I({key:"{"+this.sKey+"}",text:this._getDDLBTextBindingPath()});if(this.sDDLBDisplayBehaviour===sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR.idOnly||this.sDDLBDisplayBehaviour===sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR.idAndDescription){this._oSorter=new S(this.sKey);}else{this._oSorter=new S(this.sDescription);}e={onAfterRendering:function(){this.oControl.removeEventDelegate(e,this);this._fetchData();}};this.oControl.addEventDelegate(e,this);}else{if(this.oControl.attachSuggest){this._fSuggest=q.proxy(function(E){this.oControl=E.getSource();if(!this.oTemplate||!this.oControl.data("_hassuggestionTemplate")){this._createSuggestionTemplate();}var s=E.getParameter("suggestValue");this._fetchData(s);},this);this.oControl.attachSuggest(this._fSuggest);this.oControl.setMaxSuggestionWidth("90%");this._handleSelect();}}};V.prototype._createSuggestionTemplate=function(){var i=0,l=0,t;this._oTemplate=new a();if(this._aCols){this.oControl.removeAllSuggestionColumns();l=this._aCols.length;for(i=0;i<l;i++){this.oControl.addSuggestionColumn(new C({header:new T({wrapping:false,text:this._aCols[i].label,tooltip:this._aCols[i].label}),width:this._aCols[i].width}));t=null;if(this._aCols[i].type==="string"){t={path:this._aCols[i].template};}this._oTemplate.addCell(new T({wrapping:false,text:{path:this._aCols[i].template,type:this._aCols[i].oType},tooltip:t}));}}this.oControl.data("_hassuggestionTemplate",true);};V.prototype._getDDLBTextBindingPath=function(){var k="{"+this.sKey+"}",d="{"+this.sDescription+"}";return sap.ui.comp.smartfilterbar.FilterProvider.getFormattedExpressionFromDisplayBehaviour(this.sDDLBDisplayBehaviour,k,d);};V.prototype._handleSelect=function(){var h=q.proxy(function(d,c){var k,t,o;if(d){k=d[this.sKey];t=d[this.sDescription];this._calculateAndSetFilterOutputData([d]);}if(k){if(this.oControl.addToken){t=sap.ui.comp.smartfilterbar.FilterProvider.getFormattedExpressionFromDisplayBehaviour(this.sTokenDisplayBehaviour,k,t);o=new b({key:k,text:t,tooltip:t});o.data("row",d);if(c){c(o);}delete this.oControl.__sValidationText;}else{this.oControl.setValue(k);this.oControl.fireChange({value:k,validated:true});}}},this);if(this.oControl.addValidator){this._fValidator=q.proxy(function(d){var r=d.suggestionObject,D,i=d.text,f=[];if(r){D=this.oODataModel.getData(r.getBindingContextPath());h(D,d.asyncCallback);}else if(i){i=q.sap.encodeURL(i.toUpperCase());if(this.oControl.__sValidationText!==i){this.oControl.__sValidationText=i;this.oControl.__bValidatingToken=true;this._calculateFilterInputData();if(this.mFilterInputData&&this.aFilterField){f=sap.ui.comp.smartfilterbar.FilterProvider.generateFilters(this.aFilterField,this.mFilterInputData);}f.push(new F(this.sKey,sap.ui.model.FilterOperator.EQ,i));this.oODataModel.read(this.sValueListEntitySetName,{filters:f,success:q.proxy(function(R,c){var o=R;if(R){if(R.results&&R.results.length===1){o=R.results[0];}if(o&&o[this.sKey]){h(o,d.asyncCallback);}}delete this.oControl.__bValidatingToken;},this)});}}},this);this.oControl.addValidator(this._fValidator);}else if(this.oControl.attachSuggestionItemSelected){this._fSuggestionItemSelected=q.proxy(function(e){var r=e.getParameter("selectedRow"),d;if(r){d=r.getModel().getData(r.getBindingContextPath());h(d);}},this);this.oControl.attachSuggestionItemSelected(this._fSuggestionItemSelected);}};V.prototype._fetchData=function(s){var p={},f=[],l,e;if(this.bTypeAheadEnabled){if(s&&this.sDisplayFormat==="UpperCase"){s=s.toUpperCase();}if(this.bSupportBasicSearch){p["custom"]={"search-focus":this.sKey,"search":s};}this._calculateFilterInputData();if(this.mFilterInputData&&this.aFilterField){f=sap.ui.comp.smartfilterbar.FilterProvider.generateFilters(this.aFilterField,this.mFilterInputData);}if(!this.bSupportBasicSearch){f.push(new F(this.sKey,sap.ui.model.FilterOperator.StartsWith,s));}l=10;e={dataReceived:q.proxy(function(E){var o=E.getSource(),i;if(o){i=o.getLength();if(i&&i<=l){this.oControl.setShowTableSuggestionValueHelp(false);}else{this.oControl.setShowTableSuggestionValueHelp(true);}}},this)};}if(this.aSelect&&this.aSelect.length){p["select"]=this.aSelect.toString();}this.oControl.bindAggregation(this.sAggregationName,{path:"/"+this.sValueListEntitySetName,length:l,parameters:p,filters:f,sorter:this._oSorter,events:e,template:this._oTemplate});};V.prototype.destroy=function(){if(this.oControl){if(this.oControl.detachSuggest){this.oControl.detachSuggest(this._fSuggest);this._fSuggest=null;}if(this.oControl.removeValidator){this.oControl.removeValidator(this._fValidator);this._fValidator=null;}else if(this.oControl.detachSuggestionItemSelected){this.oControl.detachSuggestionItemSelected(this._fSuggestionItemSelected);this._fSuggestionItemSelected=null;}this.oControl.unbindAggregation(this.sAggregationName);if(this.oControl.removeAllSuggestionColumns){this.oControl.removeAllSuggestionColumns();}this.oControl.data("_hassuggestionTemplate",false);delete this.oControl.__sValidationText;delete this.oControl.__bValidatingToken;}B.prototype.destroy.apply(this,arguments);if(this.oJsonModel){this.oJsonModel.destroy();this.oJsonModel=null;}this._oTemplate=null;this.sAggregationName=null;this.bTypeAheadEnabled=null;this._oSorter=null;};return V;},true);
