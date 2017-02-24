var width = d3.select("#comparisonChart")[0][0].clientWidth;
var marginComparison = {top: (parseInt(d3.select('body').style('width'), 10)/10), right: (parseInt(d3.select('body').style('width'), 10)/20), bottom: (parseInt(d3.select('body').style('width'), 10)/5), left: (parseInt(d3.select('body').style('width'), 10)/20)},
    widthComparison = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right-300,
    heightComparison = parseInt(d3.select('body').style('height'), 10) - margin.top - margin.bottom-200;

var x0Comparison = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1Comparison = d3.scale.ordinal();

var yComparison = d3.scale.linear()
    .range([heightComparison, 0]);

//defining color range
var colorRange = d3.scale.category20c();
var color = d3.scale.ordinal()
    .range(colorRange.range());

var xAxisComparison = d3.svg.axis()
    .scale(x0Comparison)
    .orient("bottom");

var yAxisComparison = d3.svg.axis()
    .scale(yComparison)
    .orient("left")
    .tickFormat(d3.format(".2s"));


// Adds the svg canvas
var svgComparison = d3.select("#comparisonChart").append("svg")
    .attr("width", widthComparison + marginComparison.left + marginComparison.right)
    .attr("height", heightComparison + marginComparison.top + marginComparison.bottom)
    .append("g")
    .attr("transform", "translate(" + marginComparison.left + "," + marginComparison.top + ")");


dataset = [
    {label:"10 years", "Group 1":0.128, "Group 2":0.488, "Group 3": 0.060, "Group 4":0.369},
    {label:"15 years", "Group 1":0.217, "Group 2":0.555, "Group 3":0.178, "Group 4":0.474}
];


var options = d3.keys(dataset[0]).filter(function(key) { return key !== "label"; });

dataset.forEach(function(d) {
    d.valores = options.map(function(name) { return {name: name, value: +d[name]}; });
});

x0Comparison.domain(dataset.map(function(d) { return d.label; }));
x1Comparison.domain(options).rangeRoundBands([0, x0Comparison.rangeBand()]);
// yComparison.domain([0, d3.max(dataset, function(d) {return d3.max(d.valores, function(d) { return d.value; }); })]);
yComparison.domain([0, 1]);

svgComparison.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightComparison + ")")
    .call(xAxisComparison);

svgComparison.append("g")
    .attr("class", "y axis")
    .call(yAxisComparison)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 7)
    .attr("dy", ".99em")
    .style("text-anchor", "end")
    .text("Cumulative prob. of death, prostate cancer (95% CI)");

var bar = svgComparison.selectAll(".bar")
    .data(dataset)
    .enter().append("g")
    .attr("class", "rect")
    .attr("transform", function(d) {return "translate(" + x0Comparison(d.label) + ",0)"; });

bar.selectAll("rect")
    .data(function(d) { return d.valores; })
    .enter().append("rect")
    .attr("width", x1Comparison.rangeBand())
    .attr("x", function(d) {return x1Comparison(d.name); })
    .attr("y", function(d) { return yComparison(d.value); })
    .attr("value", function(d){return d.name;})
    .attr("height", function(d) { return heightComparison - yComparison(d.value); })
    .style("fill", function(d) { return color(d.name); });


var legendComparison = svgComparison.selectAll(".legendComparison")
    .data(options.slice())
    .enter().append("g")
    .attr("class", "legendComparison")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legendComparison.append("rect")
    .attr("x", widthComparison - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

legendComparison.append("text")
    .attr("x", widthComparison - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });
