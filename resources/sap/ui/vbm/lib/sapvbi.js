(function(){var i=(typeof VBI=="object")||window.VBI;if(i)return;window.VBI={m_bIsMyChromeTest:(/chrome/gi).test(navigator.appVersion),m_bIsIDevice:(/iphone|ipad/gi).test(navigator.appVersion),m_bIsAndroid:(/android/gi).test(navigator.appVersion),m_bIsMobile:(/iphone|ipad|android|BB|blackberry|playbook/gi).test(navigator.appVersion),m_bIsPhone:jQuery.device.is.phone,m_ctrlKey:false,m_shiftKey:false,m_dwRefKeyboardHook:0,GetGeoLocationService:function(){if(this.GeoLocationService)return this.GeoLocationService;this.GeoLocationService=new VBI.GeoLocation();return this.GeoLocationService;},Events:function(){var c={};var h=c.hasOwnProperty;return{subscribe:function(a,b){if(!h.call(c,a))c[a]=[];var n=c[a].push(b)-1;return{unsubscribe:function(){delete c[a][n];}};},fire:function(a,d){if(!h.call(c,a))return;c[a].forEach(function(a){a(d||{});});}};},m_Log:"",m_bTrace:(function(){var e=document.getElementById('VBITrace');return(e!=null)?true:false;})(),Trace:function(t){if(typeof console!="undefined")console.log(t+"\r\n");var a=document.getElementById('VBITrace');if(a==null)return;VBI.m_Log=VBI.m_Log+t+"<br>";a.innerHTML=VBI.m_Log;},RegisterKeyboardHook:function(){++window.VBI.m_dwRefKeyboardHook;if(window.VBI.m_dwRefKeyboardHook>1)return;window.VBI.onkeydown=function(e){if(e.keyCode==16)VBI.m_shiftKey=true;else if(e.keyCode==17)VBI.m_ctrlKey=true;};window.VBI.onkeyup=function(e){if(e.keyCode==16)VBI.m_shiftKey=false;else if(e.keyCode==17)VBI.m_ctrlKey=false;};document.addEventListener('keydown',window.VBI.onkeydown);document.addEventListener('keyup',window.VBI.onkeyup);},UnRegisterKeyboardHook:function(){--window.VBI.m_dwRefKeyboardHook;if(window.VBI.m_dwRefKeyboardHook>0)return;document.removeEventListener('keydown',window.VBI.onkeydown);document.removeEventListener('keyup',window.VBI.onkeyup);window.VBI.onkeydown=null;window.VBI.onkeyup=null;}};var V=["saputilities","sapvbicontext","sapdataprovider","sapresources","sapgeomath","sapmaplayer","sapmapprovider","sapmapmanager","sapvobase","sapevents","sapscene","sapwindow","sapactions","sapautomations","sapgeolocation","sapgeotool","sapscale","sapnavigation","sapvbmenu","sapprojection","sapvbcluster","sapparsing","sapconfig"];for(var n=0,l=V.length;n<l;++n)jQuery.sap.require("sap.ui.vbm.lib."+V[n]);})();
