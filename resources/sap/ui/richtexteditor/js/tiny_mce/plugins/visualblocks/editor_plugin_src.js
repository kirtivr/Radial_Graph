/**
 * editor_plugin_src.js
 *
 * Copyright 2012, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create('tinymce.plugins.VisualBlocks',{init:function(e,u){var c;if(!window.NodeList){return;}e.addCommand('mceVisualBlocks',function(){var d=e.dom,l;if(!c){c=d.uniqueId();l=d.create('link',{id:c,rel:'stylesheet',href:u+'/css/visualblocks.css'});e.getDoc().getElementsByTagName('head')[0].appendChild(l);}else{l=d.get(c);l.disabled=!l.disabled;}e.controlManager.setActive('visualblocks',!l.disabled);});e.addButton('visualblocks',{title:'visualblocks.desc',cmd:'mceVisualBlocks'});e.onInit.add(function(){if(e.settings.visualblocks_default_state){e.execCommand('mceVisualBlocks',false,null,{skip_focus:true});}});},getInfo:function(){return{longname:'Visual blocks',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/visualblocks',version:tinymce.majorVersion+"."+tinymce.minorVersion};}});tinymce.PluginManager.add('visualblocks',tinymce.plugins.VisualBlocks);})();