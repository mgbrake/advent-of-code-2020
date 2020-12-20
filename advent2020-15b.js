const fs = require('fs');

/*****************
 *  MISSION: elf counting game
 * STRATEGY: record numbers in order in groups array
 * record frequencies, hash lookup for each number in a separate array

 */


var lastgroup, freqs = [];
var nthNumber = 30000000;
var nextval = 0;



fs.readFile('15-numbers.txt', 'utf8', function (err,data) {
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
        var startingnumbers = line.split(',').map(a=>a.trim());
        startingnumbers.forEach(element => {
            let group = new Object();
            group.linenum = linenum++; // actually unit number this time
            group.val = parseInt(element);
            if(typeof freqs[group.val]==="undefined")
            {
                nextval = 0;
                lastgroup=group;
                freqs[group.val] = group;
            }
        });
        for(var i=linenum; i<nthNumber; i++)
        {
            var thisval = nextval;
            let group = new Object();
            group.linenum = i;
            group.val = thisval;
            if(typeof freqs[thisval]==="undefined")
            {
                nextval = 0;
                group.nextval = nextval;
                lastgroup = group;
                freqs[group.val] = group;
            }
            else {
                // seen before
                nextval = i - freqs[thisval].linenum;
                group.nextval = nextval;
                lastgroup = group;
                freqs[group.val] = group;
            }
        }
        

        console.log(startingnumbers);
        console.log(lastgroup);
        
        //console.log(`linenum: ${linenum} accumulated: ${accumulated} line: ${line}`);
       //linenum++;
    });

    //console.log(groups);
    
}


String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}