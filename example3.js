//Process: input dataNode (person)
//         retrieve treatments (object: treatments)
//         draw graph
//
//------------------------------------------------------------------------------------------------------------------------------------------------------>

//data set
var treatments = [
{"startDate":new Date("Sun Feb 09 13:45:45 GMT 2017"),"endDate":new Date("Sun Feb 09 17:35:45 GMT 2017"),"taskName":"Surgery","status":"SUCCEEDED"}, 
{"startDate":new Date("Sun Feb 07 04:36:45 GMT 2017"),"endDate":new Date("Sun Feb 09 19:36:45 GMT 2017"),"taskName":"Chemo Therapy","status":"FAILED"}, 
{"startDate":new Date("Sun Feb 10 13:45:45 GMT 2017"),"endDate":new Date("Sun Feb 10 16:36:45 GMT 2017"),"taskName":"Other1","status":"RUNNING"}, 
{"startDate":new Date("Sun Feb 05 02:45:45 GMT 2017"),"endDate":new Date("Sun Feb 05 05:36:45 GMT 2017"),"taskName":"Other3","status":"KILLING"}];
//treatment:{'startDate':,'endDate':,'taskName':,'status':}

var taskStatus = {
    "SUCCEEDED" : "bar",
    "FAILED" : "bar-failed",
    "RUNNING" : "bar-running",
    "KILLED" : "bar-killed"
};

//name of the treatments to populate y-axis
var treatmentNames = [ "Surgery", "Chemo Therapy", "Other1", "Other2", "Other3" ];

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
var format = "%d";

var gantt = d3.gantt().taskTypes(treatmentNames).taskStatus(taskStatus).tickFormat(format).height(450).width(800);


//------------------------------------------------------------------------------------------------------------------------------------------------------>

gantt.timeDomainMode("fixed");
gantt.timeDomain([ minDate, maxDate ]);

console.log(minDate)
console.log(maxDate)

gantt(treatments);
document.getElementsByClassName('gantt-chart')[0].setAttribute('width', '150%');
document.getElementsByClassName('gantt-chart')[0].setAttribute('overflow', 'scroll');
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