/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create('tinymce.plugins.AutoResizePlugin',{init:function(e,u){var t=this,o=0;if(e.getParam('fullscreen_is_enabled'))return;function r(){var a,d=e.getDoc(),b=d.body,c=d.documentElement,D=tinymce.DOM,f=t.autoresize_min_height,m;m=tinymce.isIE?b.scrollHeight:(tinymce.isWebKit&&b.clientHeight==0?0:b.offsetHeight);if(m>t.autoresize_min_height)f=m;if(t.autoresize_max_height&&m>t.autoresize_max_height){f=t.autoresize_max_height;b.style.overflowY="auto";c.style.overflowY="auto";}else{b.style.overflowY="hidden";c.style.overflowY="hidden";b.scrollTop=0;}if(f!==o){a=f-o;D.setStyle(D.get(e.id+'_ifr'),'height',f+'px');o=f;if(tinymce.isWebKit&&a<0)r();}};t.editor=e;t.autoresize_min_height=parseInt(e.getParam('autoresize_min_height',e.getElement().offsetHeight));t.autoresize_max_height=parseInt(e.getParam('autoresize_max_height',0));e.onInit.add(function(e){e.dom.setStyle(e.getBody(),'paddingBottom',e.getParam('autoresize_bottom_margin',50)+'px');});e.onChange.add(r);e.onSetContent.add(r);e.onPaste.add(r);e.onKeyUp.add(r);e.onPostRender.add(r);if(e.getParam('autoresize_on_init',true)){e.onLoad.add(r);e.onLoadContent.add(r);}e.addCommand('mceAutoResize',r);},getInfo:function(){return{longname:'Auto Resize',author:'Moxiecode Systems AB',authorurl:'http://tinymce.moxiecode.com',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/autoresize',version:tinymce.majorVersion+"."+tinymce.minorVersion};}});tinymce.PluginManager.add('autoresize',tinymce.plugins.AutoResizePlugin);})();