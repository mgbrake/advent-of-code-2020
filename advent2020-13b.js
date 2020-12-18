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
 * first reduction
 * 0 = -6x+1, x = 1/6
 * 0 = -46x+3, x = 3/46
 * 0 = 28x+2, x =  -2/14
 * 0 = 14x+1, x = -1/14
 * 
 * hmmm.  nope, maybe easier since this is mod to iterate up and check if the value maps
 * using mod difference.  So array generation each loop and see if the indexes match
 * 
 * ok, that worked, but the end result timeframe to calculate was huge.
 * we need something that finishes faster.  An approximation?  A different equation?
 * The minimum starting point should be the multiplaction of all the common factors,
 * but I don't know how to account for the shift.
 * 
 * figured that out from example
 * 1068781
 * 
offset (0 index)	0	    1	    4	    6	    7
position + offset	1068781	1068782	1068785	1068787	1068788
values	            7	    13	    59	    31	    19
p+o / value	        152683	82214	18115	34477	56252

The p+o values can be reached and checked in compinations in real time, combination lock style
take the largest item, in this case 59.  Multiply it by a test number.
if that test number - index of the largest number is divisible cleanly (mod) by the first number, check the other numbers also, according to their offsets.

Spinning that into 13b-2
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
    
    var i=0;
    while(i<Number.MAX_SAFE_INTEGER)
    {
        var checkArray = groups.map((a)=>{return a - (i % a)});
        var sumCk = 0;
        var j = 0;
        checkArray.forEach(n => {
            if(Number.isInteger(n))
            {
                if(i==1233)
                {
                    console.log(`n ${n} j ${j} tot ${(n-j-1)}`);
                }
                sumCk += Math.abs((n-j-1));
            }
            j++;
        });
        // console.log(checkArray);
        // console.log(`iteration ${i}: sumCk: ${sumCk}`);

        if(sumCk==0)
        {
            console.log(checkArray);
            console.log(`found match: iteration ${i+1}: sumCk: ${sumCk}`);
            return;
        }

        i++;
    }

    //console.log(sortedlist);
    //console.log(`bus: ${best} difference in time: ${min}, mult: ${best*min}`);
}
