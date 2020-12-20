const { group } = require('console');
const fs = require('fs');
const { gzip } = require('zlib');

/*****************
 *  MISSION: find pairs of numbers that match from a previously given list, within a given range
 * STRATEGY: Read numbers in from a file, until the preamble is filled
 */ 


var groups = [], processingSet = [];
const frameSize = 25;
const targetNumber = 1492208709;
const maxindex = 660;

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
    
    console.log(` index:${index}, len ${groups.length}`);
    //console.log(`${JSON.stringify(groups)}`)
    while(index<groups.length)
    {
        
        //console.log(`matching from ${JSON.stringify(processingSet)}`);
        var found = false;
        for(var j=maxindex; j>0; j--)
        {
            console.log(` j:${j}`);
             if(found) {  continue; }
            for(var i=index-frameSize; i<j; i++)
            {
                //console.log(`i:${i} j:${j}`);
                if(found) {  continue; }
                
                if(i==j)
                {
                    continue;
                }
                console.log(`i: ${i}: ${JSON.stringify(groups[i])}, j: ${j}: ${JSON.stringify(groups[j])}`);
                let x = 0,mi=i,mj=j;
                while(mi<=mj && x<targetNumber)
                {
                    x+=parseInt(groups[mi++].value);
                }
                console.log(`x: ${x} from indexes ${i} ${j}`);
                if(x==targetNumber)
                {
                    found = true;
                    
                    console.log(`matched ${targetNumber} to ${JSON.stringify(groups.slice(i,mi))}  from indexes ${i} ${mi}`);
                    min=parseInt(groups[i].value);
                    max=parseInt(groups[i].value);
                    for(var fi=i; fi<mi;fi++)
                    {
                        lookat=parseInt(groups[fi].value);
                        if(lookat>max) { max = lookat; }
                        if(lookat<min) { min = lookat; }
                    }
                    console.log(`sum min/max = ${min+max}`);
                    return;
                }
            }
        }
        // if(found===false)
        // {
        //     console.log(`problem, finished numbers without match: target: ${JSON.stringify(groups[index])}`);
        //     return;
        // }
        // else{
        //     processingSet.splice(0, 1);
        //     processingSet[frameSize] = groups[index++];
        // }
        index++;
        
    }
    console.log(`done loop`);

    
}