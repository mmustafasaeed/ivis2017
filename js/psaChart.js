drawPsaChart();

function drawPsaChart() {

    var svgContainerSelection = d3.select("#psaChartMain");
    var margin = {top: 30, right: 20, bottom: 30, left: 50};
    var width = svgContainerSelection[0][0].clientWidth;
    var height = 300;
    var iconHeight = 20;
    var iconWidth = 20;
    var eventMap = [{"type":"psa"},{"type":"biopsy"},{"type":"surgery"}];
    var dateFormat = d3.time.format("%d %b %Y");

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg
        .axis().scale(x)
        .orient("bottom")
        .ticks(5)
        .tickFormat(dateFormat);

    var yAxis = d3.svg
        .axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var valueline = d3.svg
        .line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.psa_total); });

    var svg = svgContainerSelection
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.select("#psaChartTooltip")
        .append('div')
        .attr('class', 'tip')
        .html('Many interesting details<br> Like psa fot value <br> Surgery referral dates and so on')
        .style('border', '1px solid steelblue')
        .style('padding', '5px')
        .style('position', 'absolute')
        .style('display', 'none')
        .on('mouseover', function(d, i) {
            tip.transition().duration(0);
        })
        .on('mouseout', function(d, i) {
            tip.style('display', 'none');
        });
        
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 + 10)
        .attr("text-anchor", "middle")  
        .style("font-size", "12px") 
        .style("text-decoration", "underline")  
        .text("PSA Chart");

    d3.json("jsonData.json", function(error, data) {
        var psaDots = [];
        var otherDots = [];
        
        data.forEach(function(d) {
            d.date = new Date(d.date* 1000);
            if(d.type == "psa") {
                d.psa_total = +d.psa_total;            
            }
        });

        for (var i = 0; i < data.length; i++) {
            if (data[i].type =="psa") {
                psaDots.push(data[i]);
            }
            else {
                otherDots.push(data[i]);
            }
        }

        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.psa_total; })]);

        svg.append("path")
                .attr("class", "line")
                .attr("d", valueline(psaDots))
                .attr("id","psaLine");

        svg.selectAll("dot")
            .data(data)
            .enter()
            .append("image")
            .attr("xlink:href", function(d) {
                var imagesDir = "../images/";
                switch(d.type){
                    case "psa": return imagesDir + "circle.svg";
                    case "biopsy": return imagesDir + "triangle.svg";
                    case "surgery": return imagesDir + "rect.svg";
                } 
            })
            .attr("width", iconWidth)
            .attr("height", iconHeight)
            .attr("x", function(d) { return x(d.date) - iconWidth/2; })
            .attr("y", function(d) { if (d.type != "psa") {
                    return findYatX(x(d.date), document.getElementById("psaLine"))[1];
               } else {
                    return y(d.psa_total) - iconHeight/2; }})
            .style("fill", function(d) {
                switch(d.type){
                    case "psa": return "red";
                    case "biopsy": return "yellow";
                    case "surgery": return "black";
                }
            })
           .on('mouseover', function(d, i) {
                tip.transition().duration(0);
                tip.style('top', y(d.y) - 20);
                tip.style('left', x(d.x));
                tip.style('display', 'block');
            })
            .on('mouseout', function(d, i) {
                tip.transition()
                    .delay(250)
                    .style('display', 'none');
            });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    });

    var legendPadding = 60;

    var legend = svg.selectAll(".legend")
        .data(eventMap)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("image")
        .attr("xlink:href", function(d) {
            var imagesDir = "../images/";
            switch(d.type) {
                case "psa": return imagesDir + "circle.svg";
                case "biopsy": return imagesDir + "triangle.svg";
                case "surgery": return imagesDir + "rect.svg";
            } 
        })
        .attr("x", function(d) { return width - iconWidth - legendPadding; })
        .attr("y", function(d) { return 20;})
        .attr("width", iconWidth)
        .attr("height", iconHeight);

    legend.append("text")
        .attr("x", width - iconWidth/2)
        .attr("y", 20 + iconHeight/2)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.type;});

    var tempLen = 0;
    function findYatX(x, linePath) {
        function getXY(len) {
            var point = linePath.getPointAtLength(len);
            return [point.x, point.y];
        }
        var curlen = tempLen;
        while (getXY(curlen)[0] < x) { curlen += 0.01; }
        tempLen = curlen;
        return getXY(curlen);
    }
}