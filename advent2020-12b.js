const { group } = require('console');
const fs = require('fs');

/*****************
 *  MISSION: find stable state and count occupied seats
 * STRATEGY: load it.  process state changes, for seats, look directionally instead
 */ 


var groups = [];
const maxindex = 660;

fs.readFile('12-directions.txt', 'utf8', function (err,data) {
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
    var wpx=10; wpy=1; //relative to the ship
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
                wpy+= move.distance;
                move.wpx = wpx;
                move.wpy = wpy;
                break;
            case 'E':
                move.dx = move.distance;
                move.dy = 0;
                wpx+= move.distance;
                move.wpx = wpx;
                move.wpy = wpy;
                break;
            case 'S':
                move.dy = 0-move.distance;
                move.dx = 0;
                wpy-=move.distance;
                move.wpx = wpx;
                move.wpy = wpy;
                break;
            case 'W':
                move.dx = 0-move.distance;
                move.dy = 0;
                wpx-=move.distance;
                move.wpx = wpx;
                move.wpy = wpy;
                break;
            case 'L':
                //rotate the waypoint around the ship left (counter-clockwise) the given number of degrees
                move.currentdistance = Math.sqrt(Math.pow(wpx,2)+Math.pow(wpy,2));
                move.origheading = Math.atan((wpy)/(wpx)) * 180.0 / Math.PI;
                if( wpx<0 )
                {
                    move.origheading+=180;
                }
                move.origheading = (move.origheading+360) % 360;
                move.newheading = ((move.origheading + move.distance)+360) % 360;
                move.wpx = Math.round(Math.cos(move.newheading*Math.PI/180) * move.currentdistance);
                move.wpy = Math.round(Math.sin(move.newheading*Math.PI/180) * move.currentdistance);
                wpx = move.wpx;
                wpy = move.wpy;
                break;
            case 'R':
                //rotate the waypoint around the ship right (clockwise) the given number of degrees
                move.currentdistance = Math.sqrt(Math.pow(wpx,2)+Math.pow(wpy,2));
                move.origheading = Math.atan((wpy)/(wpx)) *180.0 / Math.PI;
                if( wpx<0 )
                {
                    move.origheading+=180;
                }
                move.origheading = (move.origheading+360) % 360;
                move.newheading = ((move.origheading - move.distance)+360) % 360;
                move.wpx = Math.round(Math.cos(move.newheading*Math.PI/180) * move.currentdistance);
                move.wpy = Math.round(Math.sin(move.newheading*Math.PI/180) * move.currentdistance);
                wpx = move.wpx;
                wpy = move.wpy;
                break;
            case 'F':
                x+=move.distance * wpx;
                y+=move.distance * wpy;
                move.wpx = wpx;
                move.wpy = wpy;
                move.x = x;
                move.y = y;
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
