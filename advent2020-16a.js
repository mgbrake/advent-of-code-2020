const { group } = require('console');
const { randomBytes } = require('crypto');
const fs = require('fs');
const { isRegExp } = require('util');

/*****************
 *  MISSION: ticket validation
 * STRATEGY: parse and create rules for valid regions
 * Check the tickets
 * Add up errors
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
                nearbytickets.push(ticket);
                break;
        }

        
    });

    console.log(groups);

        
    for(var i=0; i<nearbytickets.length; i++)
    {
        var ticket = nearbytickets[i];
        invalids[i] = [];
        for(var j=0; j<ticket.length; j++)
        {
            var number = parseInt(ticket[j]);
            var valid = false;
            for(var g=0; g<groups.length; g++)
            {
                var vfg = validForGroup(number,groups[g]);
                // if(!vfg)
                // {
                //     console.log(`${number} not valid in group`);
                //     console.log(groups[g]);
                // }
                valid = valid || vfg; // valid in ANY group
            }
            if(!valid)
            {
                errorrate += number;
                invalids[i].push(number);
                invalidsingles.push(number);
                //console.log(`invalid: ${number} ${invalids} ${invalidsingles}`);
            }

        }
    }
    
    console.log(`invalids detected: ${invalidsingles.length}, sum: ${invalidsingles.reduce((a,b)=>a.toString() + "+" + b.toString() , "")} ${errorrate}`);
    
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