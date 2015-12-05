﻿//...........................................................................//
// configuration object......................................................//

// Author: Martina Gozlinski


VBI.Configurations = function()
{
   var configurations = {};

   configurations.m_configdata = [];

   configurations.clear = function()
   {
      // clear instances and data............................................//
      configurations.m_configdata = [];
   };

   // load the configuraionts specified in the application area...............//

   configurations.load = function( dat, ctx )
   {
      // load the json delta data............................................//
      if( dat.Set )
      {
         
         configurations.clear();

         var res = dat.Set.P;
         if( jQuery.type( res ) == 'object' )
         {
            configurations.m_configdata[ res.name ] = res.value;
         }  else
         if( jQuery.type( res ) == 'array' )
         {
            // load from array...............................................//
            for( var nJ = 0, len = res.length; nJ < len; ++nJ )
               configurations.m_configdata[ res[nJ].name ] = res[nJ].value;
         }
      }
   };

   configurations.GetData = function( name )
   {
      return configurations.m_configdata[ name ];
   };
   
   
   return configurations;
};



