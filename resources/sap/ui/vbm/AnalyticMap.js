/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.vbm.AnalyticMap");jQuery.sap.require("sap.ui.vbm.library");jQuery.sap.require("sap.ui.vbm.GeoMap");sap.ui.vbm.GeoMap.extend("sap.ui.vbm.AnalyticMap",{metadata:{publicMethods:["zoomToRegions","getRegionsInfo"],library:"sap.ui.vbm",properties:{"legendVisible":{type:"boolean",group:"Misc",defaultValue:true}},aggregations:{"regions":{type:"sap.ui.vbm.Region",multiple:true,singularName:"region"}},events:{"regionClick":{},"regionContextMenu":{}}}});sap.ui.vbm.AnalyticMap.M_EVENTS={'regionClick':'regionClick','regionContextMenu':'regionContextMenu'};sap.ui.vbm.AnalyticMap.DefaultABAPGeoJSONURL="/sap/bc/vbi/geojson/L0.json";sap.ui.vbm.AnalyticMap.DefaultGeoJSONURL="media/analyticmap/L0.json";sap.ui.vbm.AnalyticMap.DefaultRegionColor="RGB(213,218,221)";sap.ui.vbm.AnalyticMap.DefaultRegionColorBorder="RGB(255,255,255)";jQuery.sap.require("sap.ui.core.theming.Parameters");
sap.ui.vbm.AnalyticMap.prototype.exit=function(){sap.ui.vbm.GeoMap.prototype.exit.apply(this,arguments);this.detachEvent('submit',sap.ui.vbm.AnalyticMap.prototype.onAnalyticsSubmit,this);};
sap.ui.vbm.AnalyticMap.prototype.resize=function(e){sap.ui.vbm.GeoMap.prototype.resize.apply(this,arguments);};
sap.ui.vbm.AnalyticMap.prototype.onAfterRendering=function(){sap.ui.vbm.VBI.prototype.onAfterRendering.apply(this,arguments);};
sap.ui.vbm.AnalyticMap.prototype.destroyRegions=function(){this.m_bRegionsDirty=true;this.destroyAggregation("regions");};
sap.ui.vbm.AnalyticMap.prototype.addRegion=function(o){this.m_bRegionsDirty=true;this.addAggregation("regions",o);};
sap.ui.vbm.AnalyticMap.prototype.removeRegion=function(o){this.m_bRegionsDirty=true;this.removeAggregation("regions");};
sap.ui.vbm.AnalyticMap.prototype.removeAllRegions=function(o){this.m_bRegionsDirty=true;this.removeAllAggregation("regions");};
sap.ui.vbm.AnalyticMap.prototype.destroyLegend=function(){this.m_bLegendDirty=true;this.destroyAggregation("legend");};
sap.ui.vbm.AnalyticMap.prototype.setLegend=function(o){this.m_bLegendDirty=true;this.setAggregation("legend",o);};
sap.ui.vbm.AnalyticMap.prototype.onAnalyticsSubmit=function(e){var d=JSON.parse(e.mParameters.data);var p,o,c,l="Regions".length;switch(d.Action.name){case"RGN_CONTEXTMENU":c=d.Action.instance.slice(l+1,l+3);p={code:c};if(o=this.FindRegionInAggregation(c))o.fireContextMenu(p);this.fireRegionContextMenu(p);break;case"RGN_CLICK":c=d.Action.instance.slice(l+1,l+3);p={code:c};if(o=this.FindRegionInAggregation(c))o.fireClick(p);this.fireRegionClick(p);break;};};
sap.ui.vbm.AnalyticMap.prototype.init=function(){sap.ui.vbm.GeoMap.prototype.init.apply(this,arguments);this.m_bRegionsDirty=false;this.m_bLegendDirty=false;this.m_bThemingDirty=true;this.attachEvent('submit',sap.ui.vbm.AnalyticMap.prototype.onAnalyticsSubmit,this);var a=this.CreateRegions();};
sap.ui.vbm.AnalyticMap.prototype.CreateRegions=function(){var c=this.m_ColC=sap.ui.vbm.AnalyticMap.DefaultRegionColor;var a=this.m_ColCB=sap.ui.vbm.AnalyticMap.DefaultRegionColorBorder;this.m_oSetRegions={"SAPVB":{"Data":{"Set":[{"type":"N","name":"Regions","N":{"name":"Regions","E":[]}}]}}};function R(w,z,A,B,C,D,F){this.K=w;this.P="";this.T=D;this.C=B;this.CB=C;this.G=F;for(var n=0,G=z.length;n<G;++n){if(n)this.P+=";";this.P+=z[n];}};delete R.prototype.constructor;var d=null,p=null;p=sap.ui.vbm.AnalyticMap.GeoJSONURL;if(!d&&p)d=jQuery.sap.syncGetJSON(p).data;p=sap.ui.vbm.AnalyticMap.DefaultABAPGeoJSONURL;if(!d&&sap.ui.vbm.AnalyticMap.DefaultABAPGeoJSONURL){var u=URI(p);u.addQuery("sap-language",sap.ui.getCore().getConfiguration().getLanguage());d=jQuery.sap.syncGetJSON(p=u.toString()).data;}p=sap.ui.resource("sap.ui.vbm",sap.ui.vbm.AnalyticMap.DefaultGeoJSONURL);if(!d&&p)d=jQuery.sap.syncGetJSON(p).data;if(!d){alert("The path or the GeoJSON file at location "+p+" or "+sap.ui.vbm.AnalyticMap.DefaultABAPGeoJSONURL+" is invalid.\r\nPlease contact your Administrator.");return;}var E=this.m_oSetRegions.SAPVB.Data.Set[0].N.E=[];this.m_RegionApplicationTable=E;this.m_RegionBox=[];this.m_Names=[];this.m_Properties=[];var m,b,e,g;var v,h,i=d.features,t='';for(var n=0,j=i.length;n<j;++n){v=[];var f=i[n];if(f.id2=="AQ")continue;t=(f.properties&&f.properties.name)?f.properties.name:"";this.m_Names[f.id2]=t;this.m_Properties[f.id2]=f.properties;switch(f.geometry.type){case"Polygon":e=Number.MAX_VALUE;g=-Number.MAX_VALUE;m=Number.MAX_VALUE;b=-Number.MAX_VALUE;var k=f.geometry.coordinates[0];for(var l=0,o=k.length,q,x,y;l<o;++l){q=k[l];if((x=q[0])<m)m=x;if(x>b)b=x;if((y=q[1])<e)e=y;if(y>g)g=y;v.push(x,y,"0");}E.push(new R(f.id2,v,f.geometry.type,c,a,t,f.id2));this.m_RegionBox[f.id2]=[m,b,e,g];break;case"MultiPolygon":h=[];for(var r=0,s=f.geometry.coordinates.length,q;r<s;++r){e=Number.MAX_VALUE;g=-Number.MAX_VALUE;m=Number.MAX_VALUE;b=-Number.MAX_VALUE;var k=f.geometry.coordinates[r][0];v=[];for(var l=0,o=k.length,x,y;l<o;++l){q=k[l];q=k[l];if((x=q[0])<m)m=x;if(x>b)b=x;if((y=q[1])<e)e=y;if(y>g)g=y;v.push(x,y,"0");}h.push([m,b,e,g]);E.push(new R(f.id2+"_"+r,v,f.geometry.type,c,a,t,f.id2));}this.m_RegionBox[f.id2]=window.VBI.MathLib.GetSurroundingBox(h);break;case"Point":break;default:break;}}return this.m_oSetRegions;};
sap.ui.vbm.AnalyticMap.prototype.getAnalyticTemplateObject=function(){return{"id":"Region","type":"{00100000-2012-0004-B001-F311DE491C77}","entity.bind":"Regions.Entity","datasource":"Regions","posarray.bind":"Regions.PosList","color.bind":"Regions.Color","colorBorder.bind":"Regions.BorderColor","tooltip.bind":"Regions.ToolTip","hotDeltaColor":"RGBA(240,171,0,128)"};};
sap.ui.vbm.AnalyticMap.prototype.getAnalyticTypeObject=function(){return{"name":"Regions","key":"Key","A":[{"name":"Key","alias":"K","type":"string"},{"name":"PosList","alias":"P","type":"vectorarray"},{"name":"ToolTip","alias":"T","type":"string"},{"name":"Color","alias":"C","type":"color"},{"name":"BorderColor","alias":"CB","type":"color"},{"name":"Entity","alias":"G","type":"string"}]};};
sap.ui.vbm.AnalyticMap.prototype.getAnalyticDataObject=function(){var a=[];jQuery.extend(true,a,this.m_RegionApplicationTable);if(!a)return;var p=[];var C=this.getRegions();for(var n=0,l=C?C.length:0,i;n<l;++n){i=C[n];p[i.mProperties.code]=i;}var L=false;for(var n=0,l=a.length,b,i,t;n<l;++n){i=a[n];if(L)if(i.P)delete i.P;if(b=p[i.K.slice(0,2)]){if(t=b.mProperties.color){var c;if(c=/^rgba\(([\d]+)[,;]([\d]+)[,;]([\d]+)[,;]([\d]+|[\d]*.[\d]+)\)/.exec(t))i.C="RGBA("+c[1]+","+c[2]+","+c[3]+","+parseInt(c[4]*255)+")";}if(t=b.getTooltip())i.T=t;}}return{"name":"Regions","type":"N","E":a};};
sap.ui.vbm.AnalyticMap.prototype.getAnalyticActionArray=function(a){var i=this.getId();a.push({"id":i+"1","name":"RGN_CLICK","refScene":"MainScene","refVO":"Region","refEvent":"Click"});a.push({"id":i+"2","name":"RGN_CONTEXTMENU","refScene":"MainScene","refVO":"Region","refEvent":"ContextMenu"});return a;};
sap.ui.vbm.AnalyticMap.prototype.FindRegionInAggregation=function(c){var C=this.getRegions();if(C){for(var n=0,l=C.length;n<l;++n)if(C[n].mProperties.code==c)return C[n];}return null;};
sap.ui.vbm.AnalyticMap.prototype.Update=function(){var a=this.UpdateAnalyticMap();return this.MinimizeApp(a);};
sap.ui.vbm.AnalyticMap.prototype.UpdateAnalyticMap=function(){var g=sap.ui.vbm.GeoMap.prototype.UpdateGeoMapData.apply(this,arguments);if(this.m_bThemingDirty)this.applyTheming(this.m_RegionApplicationTable);var o=this.getAnalyticTemplateObject();var a=this.getAnalyticTypeObject();var d=this.getAnalyticDataObject();var t;(t=g)&&(t=t.SAPVB)&&(t=t.Scenes)&&(t=t.Set)&&(t=t.SceneGeo)&&(t=t.VO)&&t.splice(0,0,o);(t=g)&&(t=t.SAPVB)&&(t=t.DataTypes)&&(t=t.Set)&&(t=t.N)&&t.splice(0,0,a);(t=g)&&(t=t.SAPVB)&&(t=t.Actions)&&(t=t.Set)&&(t=t.Action)&&this.getAnalyticActionArray(t);if(d)(t=g)&&(t=t.SAPVB)&&(t=t.Data||(t.Data={}))&&(t=t.Set||(t.Set={}))&&(t=t.N||(t.N=[]))&&t.splice(0,0,d);if(!this.getMapConfiguration())(t=g)&&(t=t.SAPVB)&&(t=t.Scenes)&&(t=t.Set)&&(t=t.SceneGeo)&&(t.refMapLayerStack)&&(t.refMapLayerStack="");return g;};
sap.ui.vbm.AnalyticMap.prototype.invalidate=function(s){if(s instanceof sap.ui.vbm.Region)this.m_bRegionsDirty=true;sap.ui.vbm.GeoMap.prototype.invalidate.apply(this,arguments);};
sap.ui.vbm.AnalyticMap.prototype.zoomToRegions=function(c,a){if(a==undefined)a=0.9999;var b=[];for(var n=0,l=c.length;n<l;++n){var r=this.m_RegionBox[c[n]];if(r!=undefined)b.push(r);}if(!b.length)return;var s=null;if(s=this.m_VBIContext.GetMainScene())s.ZoomToAreas(b,a);};
sap.ui.vbm.AnalyticMap.prototype.getRegionsInfo=function(c){var r=[];var a,B;for(var n=0,l=c.length;n<l;++n){a=c[n];r[a]={};r[a].BBox=this.m_RegionBox[a];r[a].Midpoint=[(this.m_RegionBox[a][0]+this.m_RegionBox[a][1])/2,(this.m_RegionBox[a][2]+this.m_RegionBox[a][3])/2];r[a].Name=this.m_Names[a];r[a].Properties=this.m_Properties[a];}return r;};
sap.ui.vbm.AnalyticMap.prototype.onThemeChanged=function(e){this.m_bThemingDirty=true;this.invalidate();};
sap.ui.vbm.AnalyticMap.prototype.applyTheming=function(r){if(sap.ui.core.theming&&sap.ui.core.theming.Parameters){var c=sap.ui.vbm.AnalyticMap.DefaultRegionColor=sap.ui.core.theming.Parameters.get("sapUiChartPaletteSequentialNeutralLight3");var C=sap.ui.vbm.AnalyticMap.DefaultRegionColorBorder=sap.ui.core.theming.Parameters.get("sapUiChartBackgroundColor");if(this.getPlugin()){var a=window.VBI.Types.string2rgba(c);c=a[4]===1?"RGBA("+a[0]+";"+a[1]+";"+a[2]+";"+parseInt(a[3]*255)+")":"RGB("+a[0]+";"+a[1]+";"+a[2]+")";a=window.VBI.Types.string2rgba(C);C=a[4]===1?"RGBA("+a[0]+";"+a[1]+";"+a[2]+";"+parseInt(a[3]*255)+")":"RGB("+a[0]+";"+a[1]+";"+a[2]+")";}if(c!=this.m_ColC||C!=this.m_ColCB){for(var i=0;i<r.length;++i){if(r[i].C===this.m_ColC)r[i].C=c;if(r[i].CB===this.m_ColCB)r[i].CB=C;}this.m_ColC=c;this.m_ColCB=C;}this.m_bThemingDirty=false;}};
