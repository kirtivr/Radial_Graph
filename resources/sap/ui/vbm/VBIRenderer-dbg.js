/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.ui.vbm.VBIRenderer");

/**
 * @class VBI renderer. 
 * @static
 */
sap.ui.vbm.VBIRenderer = {
};


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 * 
 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
 */
sap.ui.vbm.VBIRenderer.render = function(oRm, oControl)
{ 
   // console.log( "sap.ui.vbm.VBIRenderer.render.....\r\n");

   // write the HTML into the render manager
   oRm.write("<div align='center'");
   oRm.writeControlData(oControl);
   oRm.addClass("vbi-main");
   oRm.writeClasses();
   oRm.addStyle("width", oControl.getWidth());
   oRm.addStyle("height", oControl.getHeight());

   oRm.writeStyles();
   oRm.write(">"); // span element

   if( oControl.getPlugin() )
   {
      var id = oControl.getId();
      
         
   
         
   
      if (oControl.$oldContent.length === 0) {
         // for IE 11 do the regexp test........................................//
         if( (navigator.appName == "Microsoft Internet Explorer") || /(trident)\/[\w.]+;.*rv:([\w.]+)/i.test( navigator.userAgent) )         
         {
            // write the object tag
            oRm.write( "<object id='VBI" + id + "'" + " data-sap-ui-preserve='" + id +"' CLASSID='CLSID:00100000-2011-0070-2000-FC7214A1CD7B' " + 
                           "width='"   + oControl.getWidth()   + "' " +
                           "height='"  + oControl.getHeight()  + "' " + 
                           
                           ">" );
   
            // set a link to the native installer...............................//
            oRm.write( "<a href='http://scn.sap.com/community/visual-business' > Get the Visual Business PlugIn.</a>" );
   
            oRm.write( "</object>" );
   
         } else
         {
            // write the embed tag
            oRm.write( "<embed id='VBI" + id + "'" + " data-sap-ui-preserve='" + id +"' type='application/x-visualbusiness' " + 
                           "width='"   + oControl.getWidth()   + "' " +
                           "height='"  + oControl.getHeight()  + "' " + ">" );
   
         }
         // render the information for using the native plugin
         }
   } 

   oRm.write("</div>");

   // the config is not loaded here any more, due the set config will be.....//
   // called, then queueing or execution will take place.....................//
};

