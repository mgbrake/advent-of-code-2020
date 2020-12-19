const { group } = require('console');
const { randomBytes } = require('crypto');
const fs = require('fs');
const { isRegExp } = require('util');
const { runInThisContext } = require('vm');

/*****************
 *  MISSION: ticket validation
 * STRATEGY: parse and create rules for valid regions
 * Check the tickets
 * discard error tickets
 * discern which field is which by checking each group against
 * each indexed value.  if each tickets[x] values are valid for 
 * a group than that group's index = x
 * 

 */


var groups=[], invalids = [], yourticket=[], nearbytickets=[], invalidsingles=[], takenIndexes=[];
var errorrate = 0;

fs.readFile('16-tickets.txt', 'utf8', function (err,data) {
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
    
    var region = "rules";
    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next region
            return;
        }
        if(line.indexOf('your ticket')>=0)
        {
            region = "your ticket";
            return;
        } else if (line.indexOf('nearby tickets')>=0)
        {
            region = "nearby tickets";
            return;
        }
        
        switch(region)
        {
            case "rules":
                var group = new Object();
                group.name = line.split(':')[0];
                group.rangeStrings = line.split(':')[1].split(' or ').map((a)=>{return a.trim();});
                group.ranges = [];
                group.rangeStrings.forEach(element => {
                    var range = new Object();
                    range.start = parseInt(element.split('-')[0]);
                    range.end = parseInt(element.split('-')[1]);
                    group.ranges.push(range);
                });
                groups.push(group);
                break;
            case "your ticket":
                yourticket = line.split(',').map(a=>{return parseInt(a.trim());});
                break;
            case "nearby tickets":
                var ticket = line.split(',').map(a=>{return parseInt(a.trim());});
                var fullticketvalid = true;
                (ticket).forEach(num => {
                    var valid = false;
                    (groups).forEach(grp => {
                        var isValid = validForGroup(num,grp);
                        if(isValid) {
                            //console.log(`number ${num} is valid for ${grp.name}`);
                            //console.log(grp.ranges);
                        }
                        else
                        {
                            //console.log(`NOT VALID number ${num} is not valid for ${grp.name}`);
                            //console.log(grp.ranges);
                        }
                        //console.log(`valid was ${valid}`);
                        valid = valid || isValid;
                        //console.log (`[valid] is now ${valid}`);
                    });
                    if(!valid)
                    {
                        fullticketvalid = false;
                        invalidsingles.push(num);
                    }
                });
                if(fullticketvalid)
                {
                    nearbytickets.push(ticket);
                }
                else
                {
                    invalids.push(ticket);
                }
                break;
        }

        
    });
    nearbytickets.push(yourticket);
    console.log(`valid tickets: ${nearbytickets.length}, invalid: ${invalids.length}`);


    console.log('your ticket');
    console.log(yourticket);
    runIt();
}

function runIt() {

    groups.forEach(grp => {
        grp.index = 0;
        var validindex = true;
        grp.possibleIndexes = [];
        while(validindex && grp.index<yourticket.length)
        {
            if(takenIndexes.includes(grp.index))
            {
                grp.index++;
                continue; // skip checking this index;
            }
            //console.log(`group: ${grp.name}, index: ${grp.index}`);
            for(var i=0; i<nearbytickets.length; i++)
            {
                //console.log(`checking nt[${i}][${grp.index}] (${nearbytickets[i][grp.index]}) for valid against ${grp.name}`);
                if(!validForGroup(nearbytickets[i][grp.index], grp))
                {

                    validindex = false;
                    //console.log(`NOTVALID: nt[${i}][${grp.index}] (${nearbytickets[i][grp.index]}) for valid against ${grp.name}`);
                }
            }
            if(validindex) 
            {
                //no issues found
                //console.log(`possibly valid ${grp.name} ${grp.index}`);
                grp.possibleIndexes.push(grp.index);
                //takenIndexes.push(grp.index);
                //return; // not sure if it's the only one yet... DONT return foreach group function return
            }
            
            validindex = true;
            grp.index++;
        }
        if(grp.possibleIndexes.length==1)
        {
            grp.index = grp.possibleIndexes[0];
            takenIndexes.push(grp.index);
        }
    });

    var leftToSlot = groups.filter(a=>{return a.possibleIndexes.length>1;});
    while(leftToSlot.length>0)
    {
        // console.log(`left to slot`);
        // console.log(leftToSlot);
        // console.log(`takenIndexes`);
        // console.log(takenIndexes);

        groups.forEach(grp => {
            if(grp.possibleIndexes.length==1) { return; }
            //^^no point doing it again
            for(var i=grp.possibleIndexes.length-1; i>=0; i--)
            {
                if(takenIndexes.includes(grp.possibleIndexes[i]))
                {
                    // console.log(`located taken index: ${grp.possibleIndexes[i]} at ${i}`);
                    // console.log(grp);
                    grp.possibleIndexes.splice(i,1);
                    // console.log(grp);
                }
            }
            if(grp.possibleIndexes.length==1)
            {
                grp.index = grp.possibleIndexes[0];
                takenIndexes.push(grp.index);
            }
        });

        leftToSlot = groups.filter(a=>{return a.possibleIndexes.length>1;});
    }

    console.log(groups);
    console.log("your ticket:");
    var yourticketinterp = [];
    for(var g=0; g<groups.length; g++)
    {
        g.yourticketvalue = yourticket[groups[g].index];
        var field = new Object();
        field.name = groups[g].name;
        field.value = yourticket[groups[g].index];
        yourticketinterp.push(field);
    }
    console.log(yourticketinterp);

    var departure = groups.filter(a=>{return a.name.indexOf('departure')==0;});
    var product = 1;
    for(var d=0; d<departure.length; d++)
    {
        console.log(`index of ${departure[d].name} is ${departure[d].index} which is ${yourticket[departure[d].index]}`);
        product = product * yourticket[departure[d].index];
    }
    console.log(`product: ${product}`);
    
}

function validForGroup(number, group)
{
    var vfg = false;
    var ranges = group.ranges.sort((a,b)=>{return a.start-b.start});
    for(var r=0; r<ranges.length; r++)
    {
        if(number >= ranges[r].start && number <= ranges[r].end)
        {
            vfg = true;
        }
    }
    return vfg;
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}