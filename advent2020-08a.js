const fs = require('fs');
const { runInThisContext } = require('vm');

/*****************
 *  MISSION: find the loop, check accumulator
 * STRATEGY: run until loop detected

 */



var groups = [], seen=[];
var depth = 0;
var accum=0,inst=0;


fs.readFile('08-inst.txt', 'utf8', function (err,data) {
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
    group.op = "nop"
    group.arg = 0;

    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next passport;
            return;
        }
        group = new Object();
        group.linenumber = ctup++;
        
        let pe = line.split(" ");

        group.op = pe[0].trim();
        group.arg = eval(`0${pe[1]}`);

        groups.push(group);
    });

    //console.log(groups);
    
    runIt();
}

// returns a number
function runIt() {
    
    console.log(`${(">").repeat(depth)} running ` + JSON.stringify(groups[inst]));

    let grp = groups[inst];
    
    if(seen.includes(grp.linenumber))
    {
        console.log(`duplicate instruction encountered.  Accum: ${accum}`);
        return;
    }

    
    switch(grp.op)
    {
        case 'nop':
            //do nothing
            inst++;
            console.log('nop, inst: ' + inst + ' accum: ' + accum);
            break;
        case 'acc':
            inst++;
            console.log(`accum: ${accum} += ${grp.arg}`)
            accum += grp.arg;
            
            console.log('acc, inst: ' + inst + ' accum: ' + accum);
            break;
        case 'jmp':
            inst+= parseInt( grp.arg );
            
            console.log('jmp, inst: ' + inst + ' accum: ' + accum);
            break;
    }
    depth++;
    seen.push(grp.linenumber);
    console.log(seen);
    runIt(); // will look until it hits the return detection.
}


function uniqueArray(arr) {
    var hashMap = {};
    var uniqueArr = [];
  
    for (var i = 0; i < arr.length; i++) {
      if (!hashMap.hasOwnProperty(arr[i])) {
        uniqueArr.push(arr[i]);
        hashMap[arr[i]] = i;
      }
    }
    return uniqueArr;
  }


String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}