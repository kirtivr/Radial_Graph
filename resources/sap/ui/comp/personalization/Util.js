/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2015 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/base/Object'],function(B){"use strict";var U={copy:function(o){if(o instanceof Array){return jQuery.extend(true,[],o);}return jQuery.extend(true,{},o);},sort:function(k,A){var r=this.copy(A);r.sort(function(a,b){var t=a[k].toLocaleLowerCase();var T=b[k].toLocaleLowerCase();if(t<T){return-1;}if(t>T){return 1;}return 0;});return r;},semanticEqual:function(i,I){if(!i||!I){return false;}for(var p in i){if(I[p]===undefined||i[p]!==I[p]){return false;}}return true;},hasChangedType:function(c){for(var t in c){if(c[t]===sap.ui.comp.personalization.Controller.ChangeType.ModelChanged||c[t]===sap.ui.comp.personalization.Controller.ChangeType.TableChanged){return true;}}return false;},isTrueForAll:function(o){for(var t in o){if(o[t]===false){return false;}}return true;},getColumn:function(c,C){var r=null;C.some(function(o){if(this.getColumnKey(o)===c){r=o;return true;}},this);return r;},getIndexByKey:function(m,c){var I=-1;m.some(function(M,i){if(M.columnKey===c){I=i;return true;}});return I;},getColumnKey:function(c){return this._getCustomProperty(c,"columnKey")||c.getId();},getColumnType:function(c){return this._getCustomProperty(c,"type");},isGroupable:function(c){if(c.getLeadingProperty&&c.getLeadingProperty()){if(this._getCustomProperty(c,"aggregationRole")!=="measure"){return true;}}if(this._getCustomProperty(c,"leadingProperty")){if(this._getCustomProperty(c,"aggregationRole")!=="measure"){return true;}}if(c instanceof sap.ui.table.Column){return c.getParent().getEnableGrouping();}return false;},isSortable:function(c){if(c.getSortProperty){if(c.getSortProperty()){return true;}}if(this._getCustomProperty(c,"sortProperty")){return true;}return false;},isFilterable:function(c){if(c.getFilterProperty){if(c.getFilterProperty()){return true;}}if(this._getCustomProperty(c,"filterProperty")){return true;}return false;},isConsistent:function(c){if(!c||!c.length){return true;}var C=true;var p=sap.ui.comp.personalization.Util.getColumnKey(c[0])!==c[0].getId();c.some(function(o){var P=sap.ui.comp.personalization.Util.getColumnKey(o)!==o.getId();if(P!==p){C=false;return true;}});return C;},getArrayElementByKey:function(k,K,a){if(!a||!a.length){return null;}var e=null;a.some(function(E){if(E[k]!==undefined&&E[k]===K){e=E;return true;}});return e;},_getCustomProperty:function(c,p){var C=this._getCustomData(c);if(!C||!p){return null;}return C[p];},_getCustomData:function(c){if(!c){return null;}var C=c.data("p13nData");if(typeof C==="string"){try{C=JSON.parse(C);c.data("p13nData",C);}catch(e){}}return C;}};return U;},true);
