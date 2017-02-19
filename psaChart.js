// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%d-%b-%y").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });
    
// Adds the svg canvas
var svg = d3.select("#psaChart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");


svg.append("text")
    .attr("x", (width / 2))             
    .attr("y", 0 + 10)
    .attr("text-anchor", "middle")  
    .style("font-size", "12px") 
    .style("text-decoration", "underline")  
    .text("PSA Chart");

// Get the data
d3.csv("dummyData.csv", function(error, data) {
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.value = +d.value;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data))

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter()
      .append("circle")
        .attr("data-legend", function(d) { return d.type; })
        .attr("data-legend-pos", function(d, i) { return i; })
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.value); })
        .style("fill", function(d) {
            switch(d.type){
                case "psa": return "red";
                case "biopsy": return "blue";
                case "surgery": return "black";
            }
        });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    var padding = 20,
    legx = width-100 + padding,
    legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + legx + ", 0)")
        .style("font-size", "12px")
        .call(d3.legend);

});