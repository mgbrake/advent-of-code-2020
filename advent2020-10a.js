const { group, groupCollapsed } = require('console');
const fs = require('fs');
const { gzip } = require('zlib');

/*****************
 *  MISSION: find ordered list of adapters, count 1 jumps and 3 jumps
 * STRATEGY: load it.  order it.  count it.
 */ 


var groups = [], jump1=[], jump3=[];
const maxindex = 660;

fs.readFile('10-numbers.txt', 'utf8', function (err,data) {
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
    
    var ctup = 0;
    let group = new Object();
    group.linenumber = ctup++;
    group.value = "";
    group.used = false;

    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next passport;
            return;
        }
        group = new Object();
        group.linenumber = ctup++;
        group.value = line;
        group.used = false;
        groups.push(group);
    });

    //console.log(groups);
    
    runIt();
}

function runIt() {
    groups = groups.sort((a,b) => { return parseInt(a.value) - parseInt(b.value); });
    console.log(groups);
    
    for(var i=1; i<groups.length; i++)
    {
        var a1 = parseInt(groups[i-1].value);
        var a2 = parseInt(groups[i].value);
        
        if(a2-a1===1)
        {
            jump1[jump1.length] = groups[i];
        } else if (a2-a1===3)
        {
            jump3[jump3.length] = groups[i];
        }
    }
    console.log(`1 jumps: ${jump1.length}, 3 jumps: ${jump3.length}, product = ${(jump3.length+1)*(jump1.length+1)}`);
        
        
    console.log(`done loop`);

    
}