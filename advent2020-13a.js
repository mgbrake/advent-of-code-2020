const { group } = require('console');
const fs = require('fs');

/*****************
 *  MISSION: find closest depart time
 * STRATEGY: load it.  mod it and subtract from the given bus number to find "arrive next"
 */ 


var groups = [];
var arrivetime = 0, nextbus=0;

fs.readFile('13-buses.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    let lines = data.split("\r\n");
    if(lines.length==1)
    {
        lines = data.split("\n");
        lines.forEach(element => {
            element = element.replace("\r", "").trim();
        });
    }
    //console.log(lines);
    setup(lines);
  });

function setup(lines) {
    var linenum = 0;
    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next passport;
            return;
        }
        if(linenum==0)
        {
            arrivetime = parseInt(line);
        }
        else {
            var b = line.split(',');
            b.forEach(element => {
                var item = element.trim();
                if(parseInt(item))
                {
                    //console.log(`fount int ${item}`);
                    groups.push(parseInt(item));
                }   
                // else{

                //     console.log(`not an int ${item}`);
                // }
            });
        }

        linenum++;
        
        
    });
    
    
    
    runIt();
}

function runIt() {
    var sortedlist = groups.sort((a,b)=>{return a-b;});
    var min = groups[groups.length-1];
    var diff = 0;
    var best = 0;
    groups.forEach(element => {
        diff = element - (arrivetime % element);
        if(diff<min)
        {
            min = diff;
            best = element;
        }
    });

    console.log(sortedlist);
    console.log(`bus: ${best} difference in time: ${min}, mult: ${best*min}`);
}
