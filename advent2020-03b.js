const fs = require('fs');

/*****************
 *  MISSION: follow a repeating terrain map down and count the trees you run into.
 * STRATEGY: iterate through terrain and find matches using mod function.  use several routes and multiply the hits
 */

var data = '';
var terrain = [];
var lineLength = 1;
var move = [ 
    {"moveright":1, "movedown":1},
    {"moveright":3, "movedown":1},
    {"moveright":5, "movedown":1},
    {"moveright":7, "movedown":1},
    {"moveright":1, "movedown":2}
]
var hitchar = '#';
var readStream = fs.createReadStream('03-terrain.txt', 'utf8');


readStream.on('data', function(chunk) {
    
    data += chunk;
    //console.log(chunk);
    if(chunk.includes('\r\n')){
        let line = data.split("\r\n");
        console.log(line);
        line.pop();
        checkSubArray(line);
        //console.log(foundMatch + " for " + strNumbers);
        data = data.replace(line.join("\r\n"), "");
    }
});
    
readStream.on('end', function() {
    
    let line = data.split("\r\n");
    checkSubArray(line);

    let hits = countHits();

     console.log(terrain);
    console.log(`hits: ${hits}`);
});


function checkSubArray(line) {
    
    line.forEach(element => {
        if(element==="")
        {
            return;
        }
        lineLength = element.trim().length;
        terrain.push(element.trim());
    });
    return;
}

function countHits()
{
    hitArray = [];
    move.forEach(element => {
       var moveright = element.moveright, movedown = element.movedown;
        var x=0, y=0, hits=0;
        while(y<terrain.length-movedown)
        {
            x+=moveright;
            x=x%lineLength;
            y+=movedown;
            if(terrain[y][x]==hitchar || terrain[y][x]=="X")
            {
                hits++;
                terrain[y] = terrain[y].replaceAt(x,"X");
            }
            else{
                terrain[y] = terrain[y].replaceAt(x,"O");
            }
        }
        hitArray.push(hits);
        
    });
    console.log(hitArray);
    var total = 1;
    hitArray.forEach(i => {
        total = total * i;
    });
    return total;
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}