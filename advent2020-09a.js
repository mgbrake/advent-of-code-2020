const fs = require('fs');

/*****************
 *  MISSION: find pairs of numbers that match from a previously given list, within a given range
 * STRATEGY: Read numbers in from a file, until the preamble is filled
 */ 


var groups = [], processingSet = [];
const frameSize = 25;

fs.readFile('09-numbers.txt', 'utf8', function (err,data) {
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
    var index = frameSize;
    

    //console.log(`${JSON.stringify(groups)}`)
    while(index<groups.length)
    {
        
        //console.log(`matching from ${JSON.stringify(processingSet)}`);
        let targetNumber = groups[index].value;
        var found = false;
        for(var j=index-frameSize; j<index; j++)
        {
             if(found) {  continue; }
            for(var i=index-frameSize; i<j; i++)
            {
                if(found) {  continue; }
                
                if(i==j)
                {
                    continue;
                }
                console.log(`i: ${i}: ${JSON.stringify(groups[i])}, j: ${j}: ${JSON.stringify(groups[j])}`);
                let x = parseInt(groups[i].value) + parseInt(groups[j].value);
                //console.log(`x: ${x}`);
                if(x==targetNumber)
                {
                    found = true;
                    groups[i].matchedWith = groups[index].linenumber;
                    groups[j].matchedWith = groups[index].linenumber;
                    console.log(`matched ${targetNumber} to ${JSON.stringify(groups[i])} and ${JSON.stringify(groups[j])} at indexes ${i} ${j}`);
                    
                    break;
                }
            }
        }
        if(found===false)
        {
            console.log(`problem, finished numbers without match: target: ${JSON.stringify(groups[index])}`);
            return;
        }
        else{
            processingSet.splice(0, 1);
            processingSet[frameSize] = groups[index++];
        }

        
    }
    console.log(`done loop`);

    for(var y=frameSize;y<groups.length;y++)
    {
        console.log(`y: ${y}, y-groups[y].matchedWith: ${y-groups[y].matchedWith}`);
        if(y-groups[y].matchedWith>2)
        {
            console.log(`candidate: ${groups[y]}`);
        }
    }
}