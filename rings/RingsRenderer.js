(function() {
    "use strict";

    $.sap.declare("com.rings.RingsRenderer");
    /**
     * @class Rings renderer.
     * @static
     */
    com.rings.RingsRenderer = {};

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager}
     *            oRm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control}
     *            oControl an object representation of the control that should be rendered
     */
    com.rings.RingsRenderer.render = function(oRm, oControl) {
        // write the HTML for the holder into the render manager
        // write the HTML for the concentricRings into the render manager
        oRm.write("<div");
        oRm.writeControlData(oControl);
        oRm.addClass("concentric");
        oRm.writeStyles();
        oRm.writeClasses();
        oRm.write(">");
        oRm.write("</div>");
    };

    /*
     * UI Rendering methods
     */
    com.rings.RingsRenderer.setup = function (id,data, w, h) {
        var that = this;

        this.selector = "#"+id;
        this.ringsCtrl = sap.ui.getCore().byId(id);
        $.extend(this,this.ringsCtrl.ringSettings);
        var isHorizontal = w > h && false; // if width is more than height , the chart should split horizontally between the rings and legends ; For now we are not using the horizontal layout.

        // calculating pixel values from rem units
        var iArcThickness = this.ringsCtrl.getArcThickness() * this.remBase;
        this.width = w * this.remBase;
        this.height = h * this.remBase;

        this.valueLabelsBoxSize = this.valueLabelsBoxSize * this.remBase;
        this.ringsPadding = this.ringsPadding * this.remBase;
        this.ringsSpacing = this.ringsSpacing *  this.remBase;
        this.legendSelectionCircleSpacing = this.legendSelectionCircleSpacing *  this.remBase;
        this.legendsPadding = this.legendsPadding *  this.remBase;
        this.valueLabelsSizeL = this.valueLabelsSizeL *  this.remBase;
        this.valueLabelsSizeS = this.valueLabelsSizeS *  this.remBase;
        this.legendTextSpace = this.legendTextSpace *  this.remBase;
        this.legendsLetterLabelSize = this.legendsLetterLabelSize *  this.remBase;
        this.legendDotRadius = this.legendDotRadius *  this.remBase;
        this.legendsLabelSize = this.legendsLabelSize *  this.remBase;
        this.legendsTitleSize = this.legendsTitleSize *  this.remBase;
        this.legendsTitleSpace = this.legendsTitleSpace * this.remBase;
        this.legendAreaWidth = this.legendAreaWidth * this.remBase;

        var iDataCount = data.length;
        this.iChartRadius = ( (iArcThickness+this.ringsSpacing) * iDataCount ) + this.valueLabelsBoxSize/2;
        var chartWMidpoint;
        if(this.isPhone || this.smallWidthScreen) {
            chartWMidpoint = this.iChartRadius;
            that.legendTextSpace = this.iChartRadius * 2 / 3;
        }
        else {
            chartWMidpoint = this.width/2;//Use if you want to (almost) center align the rings
            that.legendTextSpace = this.iChartRadius;
        }

        var chartHMidpoint = this.height / 2;

        var chartMidpoint = isHorizontal ? chartHMidpoint : chartWMidpoint ;

        var chart = d3.select(this.selector)
            .append("svg:svg")
            .attr("class", "chart")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("svg:g")
            .attr("class", "concentricchart")
            .attr("transform", "translate(" + (chartWMidpoint) + "," + chartHMidpoint + ")");

        var iRingsCenterX =  isHorizontal? (this.iChartRadius - chartWMidpoint + this.ringsPadding) : 0;
        var iRingsCenterY =  isHorizontal? 0 : (this.iChartRadius - chartHMidpoint + this.ringsPadding);

        var value_group = chart.append("svg:g")
            .attr("class", "value_group")
            .attr("transform", "translate(" + 0 + "," + (iRingsCenterY - this.valueLabelsBoxSize/4) + ")");


        var path_group = chart.append("svg:g")
            .attr("class", "path_group")
            .attr("width", w)
            .attr("height", 3 * this.height / 4)
            .attr("transform", "translate(" + (iRingsCenterX) + "," + (iRingsCenterY) + ")");

        var path_labels_group = chart.append("svg:g")
            .attr("class", "arc_labels_group")
            .attr("transform", "translate(" + (iRingsCenterX) + "," + (iRingsCenterY) + ")");

        var spaceRemainingH =  (this.height - this.iChartRadius * 2) - (isHorizontal ? 0 : this.ringsPadding);
        var spaceRemainingW = (this.width - this.iChartRadius * 2) - (isHorizontal ? this.ringsPadding : 0 );


        var legendDotRadius = this.legendDotRadius;
        var legendsPadding = legendDotRadius + this.legendSelectionCircleSpacing ;
        var legendsX,legendsY,legend_group;

        // calculate the amount of vertical/horizontal space required to show all legends
        if(!isHorizontal || true){
            var legendHeight = legendDotRadius * 2 + this.legendSelectionCircleSpacing * 2;
            var vSpaceReqd = this.legendsInOneCol * legendHeight + this.legendsTitleSpace;

            legendsX = iRingsCenterX -  this.iChartRadius + legendsPadding;

            // 2 rem top padding;
            legendsY = iRingsCenterY + this.iChartRadius + 2 *  this.remBase;

            legend_group = chart.append("svg:g")
                .attr("class", "legend_group")
                .attr("height", this.height / 4)
                .attr("transform", "translate(" + (legendsX) + "," + (legendsY) + ")");
        }
        else {
            // for horizontal layout , center and place legends ( it is impossible to predict the space taken as width will depend on label length )
            //@TODO find a better way to layout horizontally , maybe use an ellipsis
            legendsX = iRingsCenterX +  this.iChartRadius + legendsPadding + spaceRemainingW/2;
            legendsY = 0;
            legend_group = chart.append("svg:g")
                .attr("class", "legend_group")
                .attr("height", this.height / 4)
                .attr("transform", "translate(" + (legendsX) + "," + (legendsY) + ")");
        }


        this.generateArcs(this.selector, data , isHorizontal, {"spaceRemainingH": spaceRemainingH, "spaceRemainingW": spaceRemainingW});
    };

    com.rings.RingsRenderer.update = function (id, data , width , height) {
        var clone = jQuery.extend(true, {}, data);
        if(!this.ringsCtrl){
            this.ringsCtrl = sap.ui.getCore().byId(id);
        }
        this.removeAll();
        var preparedData = this.ringsCtrl.setData(clone);
        this.setup(id,preparedData, width, height);
        this.ringsCtrl.oldData = preparedData;
    };

    com.rings.RingsRenderer.generateArcs = function (selector, data , isHorizontal, spaceRemaining ) {
        var that = this;

        var chart = d3.select(this.selector);

        //append previous value to it.
        $.each(data, function (index, value) {
            if (that.ringsCtrl.oldData && that.ringsCtrl.oldData[index] != undefined) {
                data[index]["previousEndAngle"] = that.ringsCtrl.oldData[index].endAngle;
            }
            else {
                data[index]["previousEndAngle"] = 0;
            }
        });

        var thickness = this.ringsCtrl.getArcThickness() * this.remBase;

        var ir = this.iChartRadius;


        var path_group = d3.select(this.selector + ' .path_group');

        var arcpaths = path_group.selectAll("path")
            .data(data);

        //According to ,"reference arc" which surrounds the concentric rings as a circle

        path_group.append("svg:path")
            .attr("class", "refArc")
            .style("fill", function (d) {
                return that.lightGreyColor;
            })
            .style("stroke",that.lightGreyColor)
            .style("stroke-width", 2)
            .transition()
            .ease("circle")
            .duration(1500)
            .attrTween("d", function () {
                var startPos = {"startAngle": 0, "endAngle": 2 * Math.PI};
                var endPos = {"startAngle": 0, "endAngle": 2 * Math.PI};
                var i = d3.interpolate(startPos, endPos);
                return d3.svg.arc()
                    .innerRadius(function (d) {
                        return that.getRadiusRing(ir - 2,that.ringsCtrl.getArcThickness()*that.remBase, that.ringsSpacing, 0);
                    })
                    .outerRadius(function (d) {
                        return that.getRadiusRing(ir,that.ringsCtrl.getArcThickness()*that.remBase, that.ringsSpacing, 0);
                    })
                    .startAngle(function (d, i) {
                        return endPos.startAngle;
                    })
                    .endAngle(function (d, i) {
                        return endPos.endAngle;
                    });
            });

        arcpaths.enter().append("svg:path")
            .attr("class", function (d, i) {
                return selector.slice(1)+"__Segment"+i;
            })
            .style("fill", function (d, i) {
                return "";
            })
            .transition()
            .ease("circle")
            .duration(750)
            .attrTween("d", function (d) {
                return that.arcTween(that,d, thickness, ir);
            });

        arcpaths.transition()
            .ease("circle")
            .style("fill", function (d, i) {
                return i==0? that.darkBlueColor:that.lightBlueColor;
            })
            .duration(750)
            .attrTween("d", function (d) {
                return that.arcTween(that,d, thickness, ir);
            });

        arcpaths.exit().transition()
            .ease("circle")
            .duration(750)
            .attrTween("d", function (d) {
                return that.arcTween(that,d, thickness, ir);
            })
            .remove();

        that.drawArcLabels(chart,data);

        //draw labels
        that.drawLabel(chart, data, 0);

        that.buildLegend(chart, data, {
            "ir": ir,
            "height": this.height,
            "thickness": thickness,
            "isHorizontal": isHorizontal,
            "spaceRemaining": spaceRemaining
        });

    };

    com.rings.RingsRenderer.drawArcLabels = function(chart,data) {
        var that = this;
        var thickness = this.ringsCtrl.getArcThickness() * this.remBase;
        var ringsSpacing = this.ringsSpacing;
        var arc_label_radius = thickness/2;
        var arc_label_text_size = thickness;

        var ir = this.iChartRadius;

        var arc_label_group = d3.select(this.selector + ' .arc_labels_group');

        var arc_label_circles = arc_label_group.selectAll("circle").data(data);

        arc_label_circles.enter().append("svg:circle")
            .attr("class", "arc_label_circle")
            .attr("r", arc_label_radius)
            .attr("width", arc_label_radius * 2 )
            .attr("height", arc_label_radius * 2)
            //.attr("cx",-arc_label_radius)
            .attr("cy", function(d,i){
                return -(ir - (i * (thickness + ringsSpacing )))+ arc_label_radius;
            })
            .style("fill", this.lightGreyColor)
            .style("stroke","#ffffff")
            .style("stroke-linecap","round")
            .style("stroke-width", 1);

        arc_label_circles.exit().remove();

        //draw arc label text

        var arc_label_text = arc_label_group.selectAll("text.arclabeltext")
            .data(data);

        arc_label_text.enter().append("svg:text")
            .attr("class", function(d,i){
                return "arclabeltext arclabels"+i;
            })
            .attr("dx",function(d,i) {
                return -arc_label_text_size/3;
            })
            .attr("dy", function (d, i) {
                return -(ir - (i * (thickness + ringsSpacing )))+ arc_label_radius + arc_label_text_size/3; //arc_label_text_size/3 is an alignment factor. No idea why , but this particular factor just works !
            })
            .attr("text-anchor", function (d) {
                return "start";
            })
            .style("fill", function(d,i){
                return that.darkBlueColor;
            })
            .style("font-size",arc_label_text_size+"px")
            .style("font-weight","bold")
            .style("pointer-events","none")
            .text(function (d) {
                if(d[that.leaveTypeFieldName] && d[that.leaveTypeFieldName].length >= 1) {
                    return d[that.leaveTypeFieldName][0];
                }
            });

        arc_label_text.exit().remove();
    };

    com.rings.RingsRenderer.arcTween = function (that,b, thickness, ir, reanimate) {

        var prev = JSON.parse(JSON.stringify(b));
        if(!reanimate) {
            prev.endAngle = b.previousEndAngle;
        }
        else {
            prev.endAngle = 0;
        }
        var i = d3.interpolate(prev, b);

        return function (t) {
            return that.getArc(thickness, ir, that.ringsSpacing)(i(t));
        };
    };

    com.rings.RingsRenderer.drawLabel = function (chart, data, index) {
        $(this.selector + ' .value_group').empty();

        var that = this;
        var totalData = 0;
        var iLargeFontSize = this.valueLabelsSizeL;
        var iSmallFontSize = this.valueLabelsSizeS;
        var iLFontStartPoint = -(iLargeFontSize / 2);
        var iSFontStartPoint = (iSmallFontSize / 2);
        var labelsBoxSize = this.valueLabelsBoxSize;

        var counts = data.length;

        if (index >= 0 && index < counts) {
            var vLabel = {"value" : data[index][this.leaveRemainingFieldName] , "total" : data[index][this.totalLeaveFieldName]};

            var value_group = d3.select(this.selector + ' .value_group');
            var valueLabels = value_group.selectAll("text.value").data($.makeArray(vLabel));

            var valueLabel = valueLabels.enter().append("svg:text").attr("height",labelsBoxSize+"px").attr("width",labelsBoxSize+"px").attr("x",0).attr("y",0);

            valueLabel
            .append("svg:tspan")
            .attr("class", "actualValue")
            .attr("x",0)
            .attr("dy","10px")
            .style("font-size", iLargeFontSize+"px")
            .style("fill",that.darkBlueColor)
            .attr("text-anchor","middle")
            .attr("transform", function (d) {
                return "translate(" + 0 + "," + iLFontStartPoint + ")";
            })
            .text(function (d) {
                return Math.round(d.value) + "";
            });

            valueLabel
            .append("svg:tspan")
            .attr("x",0)
            .attr("dy","20px")
            .attr("class", "totalValue")
            .style("font-size", iSmallFontSize+"px")
            .style("fill",that.darkBlueColor)
            .attr("text-anchor","middle")
            .text(function (d) {
                return "of " + Math.round(d.total)  + " units";
            });

            valueLabel
            .append("svg:tspan")
            .attr("x",0)
            .attr("dy","20px")
            .attr("class", "totalValue")
            .style("font-size", iSmallFontSize+"px")
            .style("fill",that.darkBlueColor)
            .attr("text-anchor","middle")
            .text(function (d) {
                return "available";
            });

            valueLabels
                .exit()
                .remove();
        }
    };

    com.rings.RingsRenderer.buildLegend = function (chart, data, labelData) {
        var that = $.extend({}, this);

        $(this.selector + ' .legend_group').empty();

        // Draw the title of the legends section
        if(that.ringsCtrl.getLegendsTitle()) {
            var legends_group = d3.select(this.selector + ' .legend_group');
            var legendsTitleSize = this.legendsTitleSize;

            legends_group.append("svg:text")
                .attr("class", "legends_title")
                .attr("dx",(this.iChartRadius))
                .attr("text-anchor","middle")
                .attr("dominant-baseline","middle")
                .style("fill", that.darkGreyColor)
                .style("font-size", legendsTitleSize + "px")
                .style("font-weight", "bold")
                .text(function () {
                    return that.ringsCtrl.getLegendsTitle();
                });
        }

        var legendDotRadius = this.legendDotRadius;
        var legendSelectionCircleSpacing = this.legendSelectionCircleSpacing;
        var selectedLegendOuterRadius = legendDotRadius + legendSelectionCircleSpacing;
        var legendsLabelSize = this.legendsLabelSize;

        var _legendClicked = function(d,index) {
                that.drawLabel(chart, data, index);
                d3.select(that.selector + ' .legend_group .selectedLegend')
                    .attr("cy", function () {
                        return that.legendsTitleSpace + (selectedLegendOuterRadius * 2 + that.legendsPadding) * (index % 3);
                    })
                    .attr("cx", function(d,i) {
                        return ((selectedLegendOuterRadius + that.legendsPadding + that.legendTextSpace ) * (index>=3 ? 1 : 0) ) ;
                    });

                d3.select(that.selector + ' .legend_group').selectAll("text")
                    .style("font-weight","normal");

                // Reset all legends
                d3.select(that.selector + ' .legend_group .labels'+index)
                    .style("font-weight","bold");
                var legendCircleLabelSelector = "#" + that.ringsCtrl.getId() +" .legendlabels";
                var legendCircleSelector = "#" + that.ringsCtrl.getId() +" .legendcircle";
                d3.select(that.selector + ' .path_group').selectAll("path").style("fill",that.lightGreyColor);
                d3.selectAll(legendCircleLabelSelector).style("fill",that.darkBlueColor);
                d3.selectAll(legendCircleSelector).style("fill",that.lightGreyColor);

                //Apply styles to selected legends
                var legendCircleLabelHighlightedSelector = "#" + that.ringsCtrl.getId() +" .legendlabels" + index;
                var legendCircleHighlightedSelector = "#" + that.ringsCtrl.getId() +" .legendcircle" + index;

                d3.select(legendCircleHighlightedSelector).style("fill",that.darkBlueColor);
                d3.select(legendCircleLabelHighlightedSelector).style("fill","#ffffff");

                var arcSelector = "." + that.ringsCtrl.getId() + "__Segment" + index;

                d3.select(arcSelector).style("fill",that.darkBlueColor);

                d3.select(arcSelector)
                    .transition()
                    .ease("elastic")
                    .duration(750)
                    .attrTween("d", function (d) {
                        return that.arcTween(that, d, that.ringsCtrl.getArcThickness()*that.remBase, that.iChartRadius);
                    });

                // bubble up the "legendClicked" event to be handled by the parent view
                that.ringsCtrl.fireEvent("legendClicked",{"leaveType" : d["originalLabel"]});
        }; // Event hadler for if legend is clicked

        //draw legends
        var legend_group = d3.select(this.selector + ' .legend_group');
        var legend_area = legend_group.selectAll("g").data(data);

        // Creating a fixed area for legends
        legend_area.enter().append("svg:g")
            .attr("class", "legend_area")
            .attr("transform", function(d,i) {
                var legendX = ((selectedLegendOuterRadius + that.legendsPadding + that.legendTextSpace ) * (i>=3 ? 1 : 0) ) - 1;
                var legendY = that.legendsTitleSpace + (selectedLegendOuterRadius * 2 + that.legendsPadding) * (i%3) - 1;
                return "translate(" + (legendX) + "," + (legendY) + ")";
            });

        // Add legend dots
        legend_area.append("svg:circle")
            .attr("class", function(d,i){
                return "legendcircle legendcircle"+i;
            })
            .attr("cy", function (d, i) {
                return 1 ;
            })
            .attr("cx", function(d,i) {
                return 1 ;
            })
            .attr("r", legendDotRadius)
            .attr("width", legendDotRadius * 2)
            .attr("height", legendDotRadius * 2)
            .style("fill", function (d,i) {
                return i==0 ? that.darkBlueColor : that.lightGreyColor;
            })
            .style("stroke", function (d) {
                return that.lightGreyColor;
            })
            .style("pointer-events","none")
            .style("stroke-width", 1);

        // Add the labels inside the legend dots
        legend_area.append("svg:text")
            .attr("class", function(d,i){
                return "legendlabels legendlabels"+i;
            })
            .attr("dx",function(d,i) {
                return - that.legendsLetterLabelSize/3 ;
            })
            .attr("dy", function (d, i) {
                return that.legendsLetterLabelSize/3; //that.legendsLetterLabelSize/3 is an alignment factor. No idea why , but this particular factor just works !
            })
            .attr("text-anchor", function (d) {
                return "start";
            })
            .style("fill", function(d,i){
                return i==0 ? "white" : that.darkBlueColor;
            })
            .style("font-size",that.legendsLetterLabelSize+"px")
            .style("font-weight","bold")
            .style("pointer-events","none")
            .text(function (d) {
                if(d[that.leaveTypeFieldName] && d[that.leaveTypeFieldName].length >= 1) {
                    return d[that.leaveTypeFieldName][0];
                }
            });

        // Text for legend names - eg "Annual Leave"
        legend_area.append("svg:text")
            .attr("dx", function(d,i) {
                return selectedLegendOuterRadius + that.legendsPadding ;
            })
            .attr("class", function(d,i){
                return "labels labels"+i;
            })
            .attr("dy", function (d, i) {
                return that.legendsLetterLabelSize/3;
            })
            .attr("text-anchor", function (d) {
                return "start";
            })
            .on("click",
                function (d, index) {
                    _legendClicked(d,index);
                }
            )
            .style("cursor","pointer")
            .style("fill", that.darkBlueColor)
            .style("font-size",legendsLabelSize+"px")
            .style("pointer-events","none")
            .style("font-weight",function(d,index){
                if(index==0) return "bold";
                else return "normal";
            })
            .text(function (d) {
                return d[that.leaveTypeFieldName];
            });

        // A transparent rectangle encloseing each legend to capture click events
        legend_area.append("svg:rect")
            .attr("height", selectedLegendOuterRadius * 2+ 2)
            .attr("width", this.legendTextSpace)
            .attr("x", -selectedLegendOuterRadius)
            .attr("y",-selectedLegendOuterRadius)
            .style("cursor","pointer")
            .style("fill", "transparent")
            .on("click",
                function (d, index) {
                    _legendClicked(d,index);
                });

        // Pre - select the top left legend
        legend_group.append("svg:circle")
            .attr("class", "selectedLegend")
            .attr("r", selectedLegendOuterRadius)
            .attr("width", selectedLegendOuterRadius * 2 )
            .attr("height", selectedLegendOuterRadius * 2)
            .attr("cy", that.legendsTitleSpace)
            .style("stroke-linecap", "round")
            .style("fill", "none")
            .style("stroke",that.darkBlueColor)
            .style("stroke-width", 1);

        legend_area.exit().remove();
    };

    com.rings.RingsRenderer.getRadiusRing = function (ir, thickness, ringsSpacing, i) {
        return ir - (i * (thickness +ringsSpacing ));
    };

    com.rings.RingsRenderer.getArc = function (thickness, ir, ringsSpacing) {
        var that = this;

        var arc = d3.svg.arc()
            .innerRadius(function (d) {
                return that.getRadiusRing(ir - thickness, thickness, ringsSpacing, d.index);
            })
            .outerRadius(function (d) {
                return that.getRadiusRing(ir ,thickness, ringsSpacing, d.index);
            })
            .startAngle(function (d, i) {
                return d.startAngle;
            })
            .endAngle(function (d, i) {
                return d.endAngle;
            });
        return arc;
    };

    com.rings.RingsRenderer.refreshRings = function() {

    };

    com.rings.RingsRenderer.removeAll = function() {
    //@TODO remove all content
    }
}());