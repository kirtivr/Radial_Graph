/**
 * element_common.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
tinyMCEPopup.requireLangPack();
function initCommonAttributes(e){var f=document.forms[0],d=tinyMCEPopup.editor.dom;setFormValue('title',d.getAttrib(e,'title'));setFormValue('id',d.getAttrib(e,'id'));selectByValue(f,'class',d.getAttrib(e,'class'),true);setFormValue('style',d.getAttrib(e,'style'));selectByValue(f,'dir',d.getAttrib(e,'dir'));setFormValue('lang',d.getAttrib(e,'lang'));setFormValue('onfocus',d.getAttrib(e,'onfocus'));setFormValue('onblur',d.getAttrib(e,'onblur'));setFormValue('onclick',d.getAttrib(e,'onclick'));setFormValue('ondblclick',d.getAttrib(e,'ondblclick'));setFormValue('onmousedown',d.getAttrib(e,'onmousedown'));setFormValue('onmouseup',d.getAttrib(e,'onmouseup'));setFormValue('onmouseover',d.getAttrib(e,'onmouseover'));setFormValue('onmousemove',d.getAttrib(e,'onmousemove'));setFormValue('onmouseout',d.getAttrib(e,'onmouseout'));setFormValue('onkeypress',d.getAttrib(e,'onkeypress'));setFormValue('onkeydown',d.getAttrib(e,'onkeydown'));setFormValue('onkeyup',d.getAttrib(e,'onkeyup'));}
function setFormValue(n,v){if(document.forms[0].elements[n])document.forms[0].elements[n].value=v;}
function insertDateTime(i){document.getElementById(i).value=getDateTime(new Date(),"%Y-%m-%dT%H:%M:%S");}
function getDateTime(d,f){f=f.replace("%D","%m/%d/%y");f=f.replace("%r","%I:%M:%S %p");f=f.replace("%Y",""+d.getFullYear());f=f.replace("%y",""+d.getYear());f=f.replace("%m",addZeros(d.getMonth()+1,2));f=f.replace("%d",addZeros(d.getDate(),2));f=f.replace("%H",""+addZeros(d.getHours(),2));f=f.replace("%M",""+addZeros(d.getMinutes(),2));f=f.replace("%S",""+addZeros(d.getSeconds(),2));f=f.replace("%I",""+((d.getHours()+11)%12+1));f=f.replace("%p",""+(d.getHours()<12?"AM":"PM"));f=f.replace("%%","%");return f;}
function addZeros(v,l){var i;v=""+v;if(v.length<l){for(i=0;i<(l-v.length);i++)v="0"+v;}return v;}
function selectByValue(f,a,v,b,c){if(!f||!f.elements[a])return;var s=f.elements[a];var d=false;for(var i=0;i<s.options.length;i++){var o=s.options[i];if(o.value==v||(c&&o.value.toLowerCase()==v.toLowerCase())){o.selected=true;d=true;}else o.selected=false;}if(!d&&b&&v!=''){var o=new Option('Value: '+v,v);o.selected=true;s.options[s.options.length]=o;}return d;}
function setAttrib(e,a,v){var f=document.forms[0];var b=f.elements[a.toLowerCase()];tinyMCEPopup.editor.dom.setAttrib(e,a,v||b.value);}
function setAllCommonAttribs(e){setAttrib(e,'title');setAttrib(e,'id');setAttrib(e,'class');setAttrib(e,'style');setAttrib(e,'dir');setAttrib(e,'lang');}
SXE={currentAction:"insert",inst:tinyMCEPopup.editor,updateElement:null};SXE.focusElement=SXE.inst.selection.getNode();
SXE.initElementDialog=function(e){addClassesToList('class','xhtmlxtras_styles');TinyMCE_EditableSelects.init();e=e.toLowerCase();var a=SXE.inst.dom.getParent(SXE.focusElement,e.toUpperCase());if(a!=null&&a.nodeName.toUpperCase()==e.toUpperCase()){SXE.currentAction="update";}if(SXE.currentAction=="update"){initCommonAttributes(a);SXE.updateElement=a;}document.forms[0].insert.value=tinyMCEPopup.getLang(SXE.currentAction,'Insert',true);};
SXE.insertElement=function(e){var a=SXE.inst.dom.getParent(SXE.focusElement,e.toUpperCase()),h,t;if(a==null){var s=SXE.inst.selection.getContent();if(s.length>0){t=e;insertInlineElement(e);var b=tinymce.grep(SXE.inst.dom.select(e));for(var i=0;i<b.length;i++){var a=b[i];if(SXE.inst.dom.getAttrib(a,'data-mce-new')){a.id='';a.setAttribute('id','');a.removeAttribute('id');a.removeAttribute('data-mce-new');setAllCommonAttribs(a);}}}}else{setAllCommonAttribs(a);}SXE.inst.nodeChanged();tinyMCEPopup.execCommand('mceEndUndoLevel');};
SXE.removeElement=function(e){e=e.toLowerCase();elm=SXE.inst.dom.getParent(SXE.focusElement,e.toUpperCase());if(elm&&elm.nodeName.toUpperCase()==e.toUpperCase()){tinyMCE.execCommand('mceRemoveNode',false,elm);SXE.inst.nodeChanged();tinyMCEPopup.execCommand('mceEndUndoLevel');}};
SXE.showRemoveButton=function(){document.getElementById("remove").style.display='';};
SXE.containsClass=function(e,c){return(e.className.indexOf(c)>-1)?true:false;};
SXE.removeClass=function(e,c){if(e.className==null||e.className==""||!SXE.containsClass(e,c)){return true;}var a=e.className.split(" ");var n="";for(var x=0,b=a.length;x<b;x++){if(a[x]!=c){n+=(a[x]+" ");}}e.className=n.substring(0,n.length-1);};
SXE.addClass=function(e,c){if(!SXE.containsClass(e,c))e.className?e.className+=" "+c:e.className=c;return true;};
function insertInlineElement(e){var a=tinyMCEPopup.editor,d=a.dom;a.getDoc().execCommand('FontName',false,'mceinline');tinymce.each(d.select('span,font'),function(n){if(n.style.fontFamily=='mceinline'||n.face=='mceinline')d.replace(d.create(e,{'data-mce-new':1}),n,1);});}