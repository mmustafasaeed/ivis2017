//Process: input dataNode (person)
//         retrieve treatments (object: treatments)
//         draw graph
//
//Implement: make graph scrollable
//              set timedomain
//              
//           styling of graph 
//           
//------------------------------------------------------------------------------------------------------------------------------------------------------>

d3.gantt = function() {
    var FIT_TIME_DOMAIN_MODE = "fit";
    var FIXED_TIME_DOMAIN_MODE = "fixed";

    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");

    var margin = {
    top : 20,
    right : 40,
    bottom : 20,
    left : 150
    };
    var timeDomainStart = d3.time.day.offset(new Date(),-3);
    var timeDomainEnd = d3.time.hour.offset(new Date(),+3);
    var timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
    var taskTypes = [];
    var taskStatus = [];
    var height = document.body.clientHeight - margin.top - margin.bottom-5;
    var width = document.body.clientWidth - margin.right - margin.left-5;

    var tickFormat = "%H:%M";

    var keyFunction = function(d) {
    return d.startDate + d.taskName + d.endDate;
    };

    var rectTransform = function(d) {
    return "translate(" + x(d.startDate) + "," + y(d.taskName) + ")";
    };

    var x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);

    var y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);
    console.log(height - margin.top - margin.bottom)
    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
        .tickSize(8).tickPadding(8);

    var yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

    var initTimeDomain = function() {
    if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
        if (tasks === undefined || tasks.length < 1) {
        timeDomainStart = d3.time.day.offset(new Date(), -3);
        timeDomainEnd = d3.time.hour.offset(new Date(), +3);
        return;
        }
        tasks.sort(function(a, b) {
        return a.endDate - b.endDate;
        });
        timeDomainEnd = tasks[tasks.length - 1].endDate;
        tasks.sort(function(a, b) {
        return a.startDate - b.startDate;
        });
        timeDomainStart = tasks[0].startDate;
    }
    };

    var initAxis = function() {
    x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
    y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);
    xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
        .tickSize(8).tickPadding(8);

    yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
    };
    
    function gantt(tasks) {
    
    initTimeDomain();
    initAxis();
    
    var svg = d3.select("#medicationChart")
    .append("svg")
    .attr("class", "chart")
    .attr("id", "gantt")
    .attr("overflow", "auto")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("class", "gantt-chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
    
      svg.selectAll(".chart")
     .data(tasks, keyFunction).enter()
     .append("rect")
     .attr("rx", 5)
         .attr("ry", 5)
     .attr("class", function(d){ 
         if(taskStatus[d.status] == null){ return "bar";}
         return taskStatus[d.status];
         }) 
     .attr("y", 0)
     .attr("transform", rectTransform)
     .attr("height", function(d) { return y.rangeBand(); })
     .attr("width", function(d) { 
         return (x(d.endDate) - x(d.startDate)); 
         })
        .on("mouseover", function(d) {
              tooltip.text(d.taskName+": "+ (d.endDate - d.startDate)/(1000*3600)+" h");
              tooltip.style("visibility", "visible");
      })
      .on("mousemove", function() {
          return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});;
     
     
     svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
     .transition()
     .call(xAxis);
     
     svg.append("g").attr("class", "y axis").transition().call(yAxis);

     return gantt;

    };
    
    gantt.redraw = function(tasks) {

    initTimeDomain();
    initAxis();
    
        var svg = d3.select("svg");

        var ganttChartGroup = svg.select(".gantt-chart");
        var rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);
        
        rect.enter()
         .insert("rect",":first-child")
         .attr("rx", 5)
         .attr("ry", 5)
     .attr("class", function(d){ 
         if(taskStatus[d.status] == null){ return "bar";}
         return taskStatus[d.status];
         }) 
     .transition()
     .attr("y", 0)
     .attr("transform", rectTransform)
     .attr("height", function(d) { return y.rangeBand(); })
     .attr("width", function(d) { 
         return (x(d.endDate) - x(d.startDate)); 
         });

        rect.transition()
          .attr("transform", rectTransform)
     .attr("height", function(d) { return y.rangeBand(); })
     .attr("width", function(d) { 
         return (x(d.endDate) - x(d.startDate)); 
         });
        
    rect.exit().remove();

    svg.select(".x").transition().call(xAxis);
    svg.select(".y").transition().call(yAxis);
    
    return gantt;
    };

    gantt.margin = function(value) {
    if (!arguments.length)
        return margin;
    margin = value;
    return gantt;
    };

    gantt.timeDomain = function(value) {
    if (!arguments.length)
        return [ timeDomainStart, timeDomainEnd ];
    timeDomainStart = +value[0], timeDomainEnd = +value[1];
    return gantt;
    };

    /**
     * @param {string}
     *                vale The value can be "fit" - the domain fits the data or
     *                "fixed" - fixed domain.
     */
    gantt.timeDomainMode = function(value) {
    if (!arguments.length)
        return timeDomainMode;
        timeDomainMode = value;
        return gantt;

    };

    gantt.taskTypes = function(value) {
    if (!arguments.length)
        return taskTypes;
    taskTypes = value;
    return gantt;
    };
    
    gantt.taskStatus = function(value) {
    if (!arguments.length)
        return taskStatus;
    taskStatus = value;
    return gantt;
    };

    gantt.width = function(value) {
    if (!arguments.length)
        return width;
    width = +value;
    return gantt;
    };

    gantt.height = function(value) {
    if (!arguments.length)
        return height;
    height = +value;
    return gantt;
    };

    gantt.tickFormat = function(value) {
    if (!arguments.length)
        return tickFormat;
    tickFormat = value;
    return gantt;
    };


    
    return gantt;
};

//------------------------------------------------------------------------------------------------------------------------------------------------------>


//data set
var treatments = [
{"startDate":new Date("Sun Feb 08 05:45:00 GMT 2017"),"endDate":new Date("Sun Feb 08 10:30:00 GMT 2017"),"taskName":"Surgery","status":"SUCCEEDED"}, 
{"startDate":new Date("Sun Feb 07 04:45:00 GMT 2017"),"endDate":new Date("Sun Feb 08 19:30:00 GMT 2017"),"taskName":"Chemo Therapy","status":"FAILED"}, 
{"startDate":new Date("Sun Feb 07 13:45:00 GMT 2017"),"endDate":new Date("Sun Feb 08 16:30:00 GMT 2017"),"taskName":"Medication1","status":"RUNNING"}, 
{"startDate":new Date("Sun Feb 07 12:45:00 GMT 2017"),"endDate":new Date("Sun Feb 08 05:30:00 GMT 2017"),"taskName":"Medication3","status":"KILLED"}];
//treatment:{'startDate':,'endDate':,'taskName':,'status':}

var taskStatus = {
    "SUCCEEDED" : "bar",
    "FAILED" : "bar-failed",
    "RUNNING" : "bar-running",
    "KILLED" : "bar-killed"
};

//name of the treatments to populate y-axis
var treatmentNames = [ "Surgery", "Chemo Therapy", "Medication1", "Medication2", "Medication3" ];

//find latest date (where graph ends)
treatments.sort(function(a, b) {
    return a.endDate - b.endDate;
});
var maxDate = treatments[treatments.length - 1].endDate;

//find earliest date (where graph starts)
treatments.sort(function(a, b) {
    return a.startDate - b.startDate;
});
var minDate = treatments[0].startDate;

//sets the format of the x-axis
var format = "%H:%M";

var gantt = d3.gantt().taskTypes(treatmentNames).taskStatus(taskStatus).tickFormat(format).height(450).width(800);


//------------------------------------------------------------------------------------------------------------------------------------------------------>

gantt.timeDomainMode("fixed");
gantt.timeDomain([ minDate, maxDate ]);

gantt(treatments);
//------------------------------------------------------------------------------------------------------------------------------------------------------>

function testArray(array){
    for (var i=0; i<array.length;i++){
        console.log(array[i])
    }
}

//input = dataNode (person)
//output = various data needed for graph (array of treatments)
function getTreatment(dataNode){
}


function getEndDate() {
    var lastEndDate = Date.now();
    if (treatments.length > 0) {
	lastEndDate = treatments[treatments.length - 1].endDate;
    }

    return lastEndDate;
}



/*function addTask() {

    var lastEndDate = getEndDate();
    var taskStatusKeys = Object.keys(taskStatus);
    var taskStatusName = taskStatusKeys[Math.floor(Math.random() * taskStatusKeys.length)];
    var taskName = treatmentNames[Math.floor(Math.random() * treatmentNames.length)];

    treatments.push({
	"startDate" : d3.time.hour.offset(lastEndDate, Math.ceil(1 * Math.random())),
	"endDate" : d3.time.hour.offset(lastEndDate, (Math.ceil(Math.random() * 3)) + 1),
	"taskName" : taskName,
	"status" : taskStatusName
    });

    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};

function removeTask() {
    treatments.pop();
    changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
};

function changeTimeDomain(timeDomainString) {
    this.timeDomainString = timeDomainString;
    switch (timeDomainString) {
    case "1hr":
    format = "%H:%M:%S";
    gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -1), getEndDate() ]);
    break;
    case "3hr":
    format = "%H:%M";
    gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -3), getEndDate() ]);
    break;

    case "6hr":
    format = "%H:%M";
    gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -6), getEndDate() ]);
    break;

    case "1day":
    format = "%H:%M";
    gantt.timeDomain([ d3.time.day.offset(getEndDate(), -1), getEndDate() ]);
    console.log(d3.time.day.offset(getEndDate(), -1))
    console.log(getEndDate())
    break;

    case "1week":
    format = "%m/%d";
    gantt.timeDomain([ d3.time.day.offset(getEndDate(), -7), getEndDate() ]);
    break;
    default:
    format = "%H:%M"

    }
    gantt.tickFormat(format);
    gantt.redraw(treatments);
}
*/

//------------------------------------------------------------------------------------------------------------------------------------------------------>