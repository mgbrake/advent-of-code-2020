const { group, groupCollapsed } = require('console');
const fs = require('fs');
const { gzip } = require('zlib');

/*****************
 *  MISSION: find ordered list of adapters, count 1 jumps and 3 jumps
 * STRATEGY: So, the sequence can be +1, +2 or +3 for value each time.
 * The three jumps are firm - consider those fence posts.
 * but within each contiguous block there can be some variations.
 * The number of variations in each block are then multiplied by the number
 * of variations in each additional block.
 * 4,5,6,7 has 4 variations: 4567,4.67,45.7,4..7
 * 10,11,12 has 2 variations: 101112, 10.12
 * 15,16 has 1 variation:
 * so 0,1,4,5,6,7,10,11,12,15,16,19,22 has a total of 8 variations
 * this could be done with a chart, to speed it along
 * 45678,4.678,45.78,456.8,4..78,4.6.8,45..8 #NOT VALID: 4...8
 * 456789,
 *      4.6789,45.789,456.89,4567.9,
 *      4..789,4.6.89,4.67.9,45..89,45.7.9,456..9,
 *      4..7.9,4.6..9,
 *      NOT AN OPTION: 4...89, 45...9, 4....9
 * 4567890,
 *      4.67890,45.7890,456.890,4567.90,45678.0,
 *      4..7890,4.6.890,4.67.90,4.678.0,45..890,45.7.90,45.78.0,456..90,456.8.0,4567..0
 *      4...890,4..7.90,4..78.0,4.6..90,4.6.8.0,45...90,45..8.0,45.7..0,45.78.0,456...0,
 *      4...8.0,4..7..0,4.6...0
 */ 


var groups = [], jump1=[], jump3=[], collected=[];
const maxindex = 660;
var factors = [
    { groupSize: 0, factor: 1 },
    { groupSize: 1, factor: 1 },
    { groupSize: 2, factor: 1 },
    { groupSize: 3, factor: 2 }, //1+1  +0
    { groupSize: 4, factor: 4 }, //1+2  +1
    { groupSize: 5, factor: 7 }, //2+4  +1
    { groupSize: 6, factor: 13 }, //4+7 +2
    { groupSize: 7, factor: 24 }, //7+13 +4
    
];
var maxContiguous = 1;

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

    let max = 0;
    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next passport;
            return;
        }
        group = new Object();
        group.linenumber = ctup++;
        group.value = parseInt(line);
        if(group.value>max)
        {
            max = group.value;
        }
        group.used = false;
        groups.push(group);
    });

    group = new Object();
    group.linenumber = -1;
    group.value = 0;
    group.used = false;
    groups.push(group);


    group = new Object();
    group.linenumber = 99999;
    group.value = max+3;
    group.used = false;
    groups.push(group);
    //console.log(groups);
    
    runIt();
}

function runIt() {
    groups = groups.sort((a,b) => { return parseInt(a.value) - parseInt(b.value); });
    console.log(groups);
    
    var numberInGroup = 1;

    for(var i=1; i<groups.length; i++)
    {
        var a1 = parseInt(groups[i-1].value);
        var a2 = parseInt(groups[i].value);
        
        if(a2-a1===1)
        {
            jump1[jump1.length] = groups[i];
            numberInGroup++;
        } else if (a2-a1===3)
        {
            jump3[jump3.length] = groups[i];
            groups[i-1].contiguous = numberInGroup;
            groups[i-1].factor = factors[numberInGroup];
            collected[collected.length] = groups[i-1];
            if(numberInGroup>maxContiguous)
            {
                maxContiguous = numberInGroup;
            }
            numberInGroup = 1;
        }
    }
    groups[i-1].contiguous = numberInGroup;
    groups[i-1].factor = factors[numberInGroup];
    collected[collected.length] = groups[i-1];
    if(numberInGroup>maxContiguous)
    {
        maxContiguous = numberInGroup;
    }

    console.log(`1 jumps: ${jump1.length}, 3 jumps: ${jump3.length}, product = ${(jump3.length)*(jump1.length)}`);
        
    console.log(collected);

        
    console.log(`max contiguous: ${maxContiguous}`);

    var total = 1;
    collected.forEach(element => {
        total = total * element.factor.factor;
    });

    console.log(`combination of factors: ${total}`);
}