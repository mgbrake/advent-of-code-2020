const { group } = require('console');
const { randomBytes } = require('crypto');
const fs = require('fs');
const { isRegExp } = require('util');

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


var groups=[], invalids = [], yourticket=[], nearbytickets=[], invalidsingles=[];
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
                valid = false;
                (ticket).forEach(num => {
                    (groups).forEach(grp => {
                        valid = valid || validForGroup(num,grp);
                    });
                });
                if(valid)
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

    groups.forEach(grp => {
        grp.index = 0;
        var validindex = true;
        while(validindex && grp.index<yourticket.length)
        {
            console.log(`group: ${grp.name}, index: ${grp.index}`);
            for(var i=0; i<nearbytickets.length; i++)
            {
                console.log(`checking nt[${i}][${grp.index}] (${nearbytickets[i][grp.index]}) for valid against ${grp.name}`);
                if(!validForGroup(nearbytickets[i][grp.index], grp))
                {
                    validindex = false;
                    console.log(`NOTVALID: nt[${i}][${grp.index}] (${nearbytickets[i][grp.index]}) for valid against ${grp.name}`);
                }
            }

            if(validindex) 
            {
                return; // no issues found foreach group function return
            }
            else
            {
                validindex = true;
                grp.index++;
            }
        }
            
        

    });

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