/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create('tinymce.plugins.Nonbreaking',{init:function(a,u){var t=this;t.editor=a;a.addCommand('mceNonBreaking',function(){a.execCommand('mceInsertContent',false,(a.plugins.visualchars&&a.plugins.visualchars.state)?'<span data-mce-bogus="1" class="mceItemHidden mceItemNbsp">&nbsp;</span>':'&nbsp;');});a.addButton('nonbreaking',{title:'nonbreaking.nonbreaking_desc',cmd:'mceNonBreaking'});if(a.getParam('nonbreaking_force_tab')){a.onKeyDown.add(function(a,e){if(e.keyCode==9){e.preventDefault();a.execCommand('mceNonBreaking');a.execCommand('mceNonBreaking');a.execCommand('mceNonBreaking');}});}},getInfo:function(){return{longname:'Nonbreaking space',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/nonbreaking',version:tinymce.majorVersion+"."+tinymce.minorVersion};}});tinymce.PluginManager.add('nonbreaking',tinymce.plugins.Nonbreaking);})();
