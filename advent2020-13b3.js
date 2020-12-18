const { group } = require('console');
const fs = require('fs');

/*****************
 *  MISSION: find constraints so that given buses depart 1 minute apart at time t
 * STRATEGY: load it.  set up as a series of linear equations.  Simultaneously solve
 *      using eigen vectors?
 *  for 7,13,x,x,59,x,31,19
 * t = 7x
 * t = 13x -1
 * t = 59x -4
 * t = 31x -6
 * t = 17X -7
 * 
 * 1068781
 * 
offset (0 index)	0	    1	    4	    6	    7
position + offset	1068781	1068782	1068785	1068787	1068788
values	            7	    13	    59	    31	    19
p+o / value	        152683	82214	18115	34477	56252

The p+o values can be reached and checked in compinations in reasonable time, combination lock style
take the largest item, in this case 59.  Multiply it by a test number.
if that test number - index of the largest number is divisible cleanly (mod) by the first number, check the other numbers also, according to their offsets.

Spinning that into 13b-2

starting point: 
 */ 


var groups = [];
var arrivetime = 0, nextbus=0;
var maxVal = 0;
var maxIndex = 0;

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
                    var newint = parseInt(item);
                    //console.log(`fount int ${item}`);
                    if(newint > maxVal)
                    {
                        maxVal = newint;
                        maxIndex = groups.length;
                    }
                    groups.push(newint);
                }   
                else{
                    groups.push(0);
                    //console.log(`not an int ${item}`);
                }
            });
        }

        linenum++;
        
        
    });
    
    
    
    runIt();
}

function runIt() {
    
    var i= Math.round(1720290842967000/maxVal); //349760642864000
    // the actual number is between 0.2 and 0.8 of the product
    // of all running busses, but for now the max boundary
    // is set as the product of all the numbers
    // that range is based on ratios of where found and tends
    // to be lower the more variation in numbers
    while(i<Number.MAX_SAFE_INTEGER)
    {
        var checkNumber = i*maxVal;
        var modClean = true;
        var j = 0;
        var checkArray = groups.map((a)=>{return a});
        groups.forEach(element => {
            if(!modClean)
            {
                return false;
            }
            checkArray[j] = (checkNumber-maxIndex+j) % element ;
            if( parseInt(checkArray[j]) && checkArray[j] > 0)
            {
                modClean = false;
                return false;
                //console.log(`not clean`)
            }
            j++;
        });

        if(modClean)
        {
            console.log(checkArray);
            console.log(`found match: i ${i}: maxVal: ${maxVal} maxIndex: ${maxIndex} startingIndex (i*maxVal - maxIndex): ${(i*maxVal)-maxIndex}`);
            
            return;
        }
        if(i%(1000*maxVal)==0)
        {
            console.log(`i: ${i}, maxVal: ${maxVal}, mult: ${checkNumber}`);
            console.log(checkArray);
        }
        i++;
    }

    //console.log(sortedlist);
    //console.log(`bus: ${best} difference in time: ${min}, mult: ${best*min}`);
}
