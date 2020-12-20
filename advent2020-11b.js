const { group } = require('console');
const fs = require('fs');

/*****************
 *  MISSION: find stable state and count occupied seats
 * STRATEGY: load it.  process state changes, for seats, look directionally instead
 */ 


var groups = [];
const maxindex = 660;

fs.readFile('11-seats.txt', 'utf8', function (err,data) {
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
    var rowup = 0;
    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next passport;
            return;
        }
        var tiles = line.split('');
        var row = [];
        var columnup=0;
        tiles.forEach(element => {
            var tile = new Object();
            tile.tilenumber = ctup++;
            tile.rownumber = rowup;
            tile.columnnumber = columnup++;
            tile.item = element;
            row.push(tile);
        });
        groups.push(row);
        rowup++;
    });
    
    //console.log(groups);
    runIt();
}

function runIt() {
    
    for(var i=0; i<groups.length; i++)
    {
        var row =groups[i];
        for(var j=0; j<row.length; j++)
        {
            var tile=row[j];
            if(tile.item=="L")
            {
                tile.occupiedSeats = 0;
                var sum = row.slice(j-1<0?0:j-1,j+1>=row.length?row.length:j+1).map((a)=>a.item=="L"?1:0).reduce((acc, val) => { return acc + val;});
                if(j>0) {
                    sum += groups[j-1].slice(j-1<0?0:j-1,j+1>=row.length?row.length:j+1).map((a)=>a.item=="L"?1:0).reduce((acc, val) => { return acc + val;});
                }
                if(j<group.length-1) {
                    sum += groups[j+1].slice(j-1<0?0:j-1,j+1>=row.length?row.length:j+1).map((a)=>a.item=="L"?1:0).reduce((acc, val) => { return acc + val;});
                }
                tile.surroundingSeats = sum;
            }
        }
    }
    //console.log(groups);
    console.log(groups.map((a)=>a.map(b=>b.item).join('')));
    console.log(groups.map((a)=>a.map(b=>b.surroundingSeats).join('')));
    //return;

    var lastTotalOccupiedSeats = groups.length * groups[0].length;
    var totalOccupiedSeats = 0;
    //iterate/simulate
    while(lastTotalOccupiedSeats!=totalOccupiedSeats)
    {
        lastTotalOccupiedSeats = totalOccupiedSeats;
        totalOccupiedSeats = 0;
        //simultaneous updates is easiest with a second array built off the first
        s = groups.map((row)=>row.map((tile)=>tile.item));
        for(var i=0; i<groups.length; i++)
        {
            var row =groups[i];
            for(var j=0; j<row.length; j++)
            {
                var tile=row[j];
                if(tile.item==="L" && tile.occupiedSeats==0)
                {
                    s[i][j]="#";
                }
                if(tile.item==="#" && tile.occupiedSeats>=5)
                {
                    s[i][j]="L";
                }
            }
        }
        //console.log(s);
        
        for(var i=0; i<groups.length; i++)
        {
            var row =groups[i];
            for(var j=0; j<row.length; j++)
            {
                var tile=row[j];
                tile.item = s[i][j];
                if(tile.item=="#")
                {
                    totalOccupiedSeats++;  // looking at this seat
                }
                
                //figure out surrounding seats
                tile.occupiedSeats = 0;
                
                //go out each direction until it hits L or #
                
                //N (j)
                if(trace(s, j,i,0,-1)) { tile.occupiedSeats++; }
                //NE
                if(trace(s, j,i,1,-1)) { tile.occupiedSeats++; }
                //etc
                if(trace(s, j,i,1,0)) { tile.occupiedSeats++; }
                if(trace(s, j,i,1,1)) { tile.occupiedSeats++; }
                if(trace(s, j,i,0,1)) { tile.occupiedSeats++; }
                if(trace(s, j,i,-1,1)) { tile.occupiedSeats++; }
                if(trace(s, j,i,-1,0)) { tile.occupiedSeats++; }
                if(trace(s, j,i,-1,-1)) { tile.occupiedSeats++; }
            }
        }
        console.log(`occupied seats: ${totalOccupiedSeats}`);
        console.log(groups.map((a)=>a.map(b=>b.item).join('')));
        //console.log(groups.map((a)=>a.map(b=>b.occupiedSeats).join('')));
    }
        
        
    console.log(`stable state: ${totalOccupiedSeats}`);

    
}

function trace(s, locX, locY, incX, incY)
{
    var checking = locX==8&&locY==0;
    var foundOccupiedSeat = false;
    var foundSeat = false;
    var hitEdge = false;
    while(!foundSeat && !hitEdge)
    {
        locY = locY+incY;
        locX = locX+incX;
        if(locY<0 || locY>=groups.length || locX<0 || locX>=groups[0].length)
        {
            hitEdge = true;
        }
        else{
            if(s[locY][locX]=="#")
            {
                foundSeat = true;
                foundOccupiedSeat = true;
            }
            else if(s[locY][locX]=="L")
            {
                foundSeat = true;
            }
        }
    }
    if(checking)
    {
        //console.log(`direction: incX ${incX} incY ${incY}, currentLoc: X ${locX}, Y ${locY}, hitEdge? ${hitEdge} foundSeat? ${foundSeat} occupied? ${foundOccupiedSeat}`)
    }
    return foundOccupiedSeat;
}