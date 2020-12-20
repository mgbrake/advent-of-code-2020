const { group } = require('console');
const fs = require('fs');

/*****************
 *  MISSION: find stable state and count occupied seats
 * STRATEGY: load it.  process state changes, for seats, look directionally instead
 */ 


var groups = [];
const maxindex = 660;

fs.readFile('12-test2.txt', 'utf8', function (err,data) {
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
    var heading = 0;
    var x=0; y=0;
    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next passport;
            return;
        }
        
        var move = new Object();
        move.tilenumber = ctup++;
        move.item = line;
        move.distance = parseInt(line.substring(1,line.length));
        console.log(`move: ${line.charAt(0)} ${move.distance}`);
        switch(line.charAt(0))
        {
            case 'N':
                move.dy = move.distance;
                move.dx = 0;
                y+= move.distance;
                move.heading = heading;
                break;
            case 'E':
                move.dx = move.distance;
                move.dy = 0;
                x+= move.distance;
                move.heading = heading;
                break;
            case 'S':
                move.dy = 0-move.distance;
                move.dx = 0;
                y-=move.distance;
                move.heading = heading;
                break;
            case 'W':
                move.dx = 0-move.distance;
                move.dy = 0;
                x-=move.distance;
                move.heading = heading;
                break;
            case 'L':
                heading = heading+move.distance; 
                move.heading = heading;
                move.dx = 0;
                move.dy = 0;
                break;
            case 'R':
                heading = heading-move.distance; 
                move.heading = heading;
                move.dx = 0;
                move.dy = 0;
                break;
            case 'F':
                move.dx = move.distance * Math.cos(heading * Math.PI / 180);
                move.dy = move.distance * Math.sin(heading * Math.PI / 180);
                x+=move.dx;
                y+=move.dy;
                move.heading = heading;
                break;

        }
        groups.push(move);
        
    });
    
    console.log(groups);
    console.log(`x: ${x}, y: ${y}, heading: ${heading}, manhattan distance: ${Math.abs(x)+Math.abs(y)}`);
    
    //runIt();
}

function runIt() {
    
    
}
