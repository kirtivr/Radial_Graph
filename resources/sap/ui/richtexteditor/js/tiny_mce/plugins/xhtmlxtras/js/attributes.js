/**
 * attributes.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

function init(){tinyMCEPopup.resizeToInnerSize();var i=tinyMCEPopup.editor;var d=i.dom;var e=i.selection.getNode();var f=document.forms[0];var o=d.getAttrib(e,'onclick');setFormValue('title',d.getAttrib(e,'title'));setFormValue('id',d.getAttrib(e,'id'));setFormValue('style',d.getAttrib(e,"style"));setFormValue('dir',d.getAttrib(e,'dir'));setFormValue('lang',d.getAttrib(e,'lang'));setFormValue('tabindex',d.getAttrib(e,'tabindex',typeof(e.tabindex)!="undefined"?e.tabindex:""));setFormValue('accesskey',d.getAttrib(e,'accesskey',typeof(e.accesskey)!="undefined"?e.accesskey:""));setFormValue('onfocus',d.getAttrib(e,'onfocus'));setFormValue('onblur',d.getAttrib(e,'onblur'));setFormValue('onclick',o);setFormValue('ondblclick',d.getAttrib(e,'ondblclick'));setFormValue('onmousedown',d.getAttrib(e,'onmousedown'));setFormValue('onmouseup',d.getAttrib(e,'onmouseup'));setFormValue('onmouseover',d.getAttrib(e,'onmouseover'));setFormValue('onmousemove',d.getAttrib(e,'onmousemove'));setFormValue('onmouseout',d.getAttrib(e,'onmouseout'));setFormValue('onkeypress',d.getAttrib(e,'onkeypress'));setFormValue('onkeydown',d.getAttrib(e,'onkeydown'));setFormValue('onkeyup',d.getAttrib(e,'onkeyup'));className=d.getAttrib(e,'class');addClassesToList('classlist','advlink_styles');selectByValue(f,'classlist',className,true);TinyMCE_EditableSelects.init();}
function setFormValue(n,v){if(v&&document.forms[0].elements[n]){document.forms[0].elements[n].value=v;}}
function insertAction(){var i=tinyMCEPopup.editor;var e=i.selection.getNode();setAllAttribs(e);tinyMCEPopup.execCommand("mceEndUndoLevel");tinyMCEPopup.close();}
function setAttrib(e,a,v){var f=document.forms[0];var b=f.elements[a.toLowerCase()];var i=tinyMCEPopup.editor;var d=i.dom;if(typeof(v)=="undefined"||v==null){v="";if(b)v=b.value;}d.setAttrib(e,a.toLowerCase(),v);}
function setAllAttribs(e){var f=document.forms[0];setAttrib(e,'title');setAttrib(e,'id');setAttrib(e,'style');setAttrib(e,'class',getSelectValue(f,'classlist'));setAttrib(e,'dir');setAttrib(e,'lang');setAttrib(e,'tabindex');setAttrib(e,'accesskey');setAttrib(e,'onfocus');setAttrib(e,'onblur');setAttrib(e,'onclick');setAttrib(e,'ondblclick');setAttrib(e,'onmousedown');setAttrib(e,'onmouseup');setAttrib(e,'onmouseover');setAttrib(e,'onmousemove');setAttrib(e,'onmouseout');setAttrib(e,'onkeypress');setAttrib(e,'onkeydown');setAttrib(e,'onkeyup');}
function insertAttribute(){tinyMCEPopup.close();}
tinyMCEPopup.onInit.add(init);tinyMCEPopup.requireLangPack();
