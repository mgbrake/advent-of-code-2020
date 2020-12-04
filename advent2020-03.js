const fs = require('fs');

/*****************
 *  MISSION: follow a repeating terrain map down and count the trees you run into.
 * STRATEGY: iterate through terrain and find matches using mod function
 */


var terrain = [];
var lineLength = 1;
var moveright = 3;
var movedown = 1;
var hitchar = '#';

fs.readFile('03-terrain.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    let lines = data.split("\r\n");
    if(lines.length==1)
    {
        lines = data.split("\n");
    }
    runIt(lines);
  });

function runIt(line) {
    
    line.forEach(element => {
        if(element==="")
        {
            return;
        }
        lineLength = element.trim().length;
        terrain.push(element.trim());
    });
    
    countHits();
}

function countHits()
{
    var x=0, y=0, hits=0;
    while(y<terrain.length-movedown)
    {
        x+=moveright;
        x=x%lineLength;
        y+=movedown;
        if(terrain[y][x]==hitchar)
        {
            hits++;
            terrain[y] = terrain[y].replaceAt(x,"X");
        }
        else{
            terrain[y] = terrain[y].replaceAt(x,"O");
        }
    }
    
    console.log(terrain);
    console.log(hits);
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}