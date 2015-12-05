(function() {
    "use strict";

    jQuery.sap.declare("com.rings.Rings");
    jQuery.sap.require("sap.ui.core.Control");
    jQuery.sap.require("sap.ui.core.ResizeHandler");
    jQuery.sap.require("sap.ui.Device");
    jQuery.sap.require("com.util.d3");

    /**
     * Constructor for a new Rings control.
     */

    com.rings.Rings = {};

    sap.ui.core.Control.extend("com.rings.Rings", {
         metadata : {

            // ---- object ----

            // ---- control specific ----
             properties : {
                 "arcThickness" : {type : "float", group : "Misc", defaultValue : 0.75},//in REM Units
                 "height": {type : "int", group : "Misc", defaultValue : 48}, //width and height are in REM Units , it is not recommended to adjust them. But if you're feeling lucky , go for it .
                 "width": {type : "int", group : "Misc", defaultValue : 26},
                 "arcData" : {type:"object",multiple:false},
                 "arcAnimated" : {type:"boolean", multiple : false, defaultValue : true},
                 "legendsTitle" : {type:"string", multiple: false}
             },
             events : {
                 "legendClicked" : {}
             }
         }
    });

    /*
     *   Lifecycle methods
     */
    com.rings.Rings.prototype.init =  function () {
        this.firstRender = true;

        var viewport = {
            width  : $(window).width(),
            height : $(window).height()
        };

        // These settings are .. fragile ! Be careful before you dare mess with them.
        this.ringSettings = {   // Below sizes are in "rem" units
            "legendDotRadius" : 1,
            "remBase" : sap.ui.Device.system.phone ? 14 : ($('html').css('font-size') ? parseInt($('html').css('font-size'),10) : 16),
            "valueLabelsBoxSize" : 6.25,
            "ringsPadding" : 0.3125,
            "ringsSpacing" : 0.3125,
            "legendSelectionCircleSpacing" : 0.25,
            "legendsPadding" : 0.3125,
            "valueLabelsSizeL" : 1.625,
            "valueLabelsSizeS" : 1,
            "legendsLetterLabelSize" : 1,
            "legendsInOneCol" : 3,
            "legendsLabelSize" : 0.9,
            "legendsTitleSize" : 1.3,
            "legendsTitleSpace" : 3,
            "lightGreyColor" : "#e9eaeb",
            "lightBlueColor" : "#d0dced",
            "darkBlueColor" : "#2181bb",
            "darkGreyColor" : "#707070",
            "isPhone" : sap.ui.Device.system.phone,
            "isIE" : sap.ui.Device.browser.BROWSER.INTERNET_EXPLORER === sap.ui.Device.browser.name,
            "isTablet" : sap.ui.Device.system.tablet,
            "smallWidthScreen" : false,
            "leaveTypeFieldName" : "DATA_LABEL", // Modifiable
            "leaveRemainingFieldName" : "DATA_VALUE", // Modifiable
            "totalLeaveFieldName" : "DATA_TOTAL" // Modifiable
        };

        // If given rings width is greater that device width , set the width of control to device width.
        var givenWidth = this.getWidth() * this.ringSettings.remBase ;
        if(givenWidth > viewport.width) {
            this.setWidth(Math.floor(viewport.width / this.ringSettings.remBase));
            this.ringSettings.smallWidthScreen = true;
        }

        var that = this;
        // Add resize handler to this control
        sap.ui.core.ResizeHandler.register(this,function(){
            that.firstRender = false;
            that.onAfterRendering();
        });
    };

    com.rings.Rings.prototype.onAfterRendering = function() {
        if(!$.isEmptyObject(this.getArcData()) && this.firstRender){
            this.firstRender = false;
            // we convert the data from an array format to an object format so we can deep copy in an easier way
            var oDataObj = {segments:this.getArcData()};
            var clone = jQuery.extend(true, {}, oDataObj);

            if(!this.getId()){
                this.setId($.sap.uid());
            }
            var id = this.getId();
            var preparedData = this.setData(clone);

            this.getRenderer().setup(id,preparedData, this.getWidth(), this.getHeight());
            this.fireEvent("legendClicked",{"leaveType" : preparedData[0]["originalLabel"]});
        }
    };

    /*
     * Setters , Getters
     */
    com.rings.Rings.prototype.setData = function (data) {
        var diameter = 2 * Math.PI * this.radius;
        var segmentData = data.segments;
        var that = this;

        $.each(segmentData, function (ri, value) {
            var segmentValue = value[that.ringSettings.leaveRemainingFieldName];
            var segmentTotal = value[that.ringSettings.totalLeaveFieldName];
            var fraction = segmentValue / segmentTotal;

            var arcBatchLength = fraction * 2 * Math.PI;
            var arcPartition = arcBatchLength;

            var startAngle = 0;
            var endAngle = startAngle + arcPartition;

            segmentData[ri]["startAngle"] = startAngle;
            segmentData[ri]["endAngle"] = endAngle;
        });

        // sort incoming data in descending order. Outer most ring should have the greatest end angle.
        this.qsort(segmentData,0,segmentData.length - 1);

        // set index of segments based on their end Angle (descending)
        $.each(segmentData, function (ri, value) {
            segmentData[ri]["index"] = ri;
        });

        // remove the last word from each leave type ..for example Annual Leave becomes Annual
        $.each(segmentData, function (ri, value) {
            // If number of words in string >= 2 then remove the last word
            var sLeaveTypeText = segmentData[ri][that.ringSettings.leaveTypeFieldName];
            var sBrokenLeaveTypeText = sLeaveTypeText.split(" ");
            var numWords = sBrokenLeaveTypeText.length;
            var lastWordIndex = numWords - 1;
            var sNewLeaveTypeText = "";
            if(numWords >= 2) {
                $.each(sBrokenLeaveTypeText , function(iIdx, sLeavePart){
                   if(iIdx >= lastWordIndex) return false;
                   else {
                    sNewLeaveTypeText = sNewLeaveTypeText + sLeavePart ;
                   }
                });
            }
            else {
                sNewLeaveTypeText = sLeaveTypeText;
            }
            segmentData[ri]["originalLabel"] = sLeaveTypeText;
            segmentData[ri][that.ringSettings.leaveTypeFieldName] = sNewLeaveTypeText;
        });

        return segmentData;
    };

    com.rings.Rings.prototype.setArcData = function(data){
        if(data && !$.isEmptyObject(data)) {
            this.setProperty("arcData",data);
            // control is to be re-rendered
            this.firstRender = true;
            this.rerender();
        }
    };

    /*
     * Event Handling methods
     */

    /* Helper methods */
    com.rings.Rings.prototype.qsort = function(data, startIndex, endIndex) {
        var partitionIndex = startIndex;

        // sort left and right partitions
        if(endIndex > startIndex) {
            var splitIndex = this.partition(data, startIndex, endIndex, partitionIndex);
            this.qsort(data, startIndex, splitIndex - 1);
            this.qsort(data, splitIndex + 1, endIndex);
        }
    };

    com.rings.Rings.prototype.partition = function(data, sIndex, eIndex, pIndex) {
        var i = sIndex, j = eIndex, temp;
        while(j>i &&  (i<eIndex && j>sIndex)){
            while(data[i]["endAngle"] >= data[pIndex]["endAngle"] && (i<eIndex)) i++;
            while(data[j]["endAngle"] < data[pIndex]["endAngle"] && (j>sIndex)) j--;
            if(i>=j)break;
            temp = data[i];
            data[i] = data[j];
            data[j] = temp;
        }
        if(j!= sIndex) {
            temp = data[j];
            data[j] = data[pIndex];
            data[pIndex] = temp;
        }
        return j;
    };

}());








