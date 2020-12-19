const { group } = require('console');
const fs = require('fs');

/*****************
 *  MISSION: find stable state and count occupied seats
 * STRATEGY: load it.  process state changes
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
                if(tile.item==="#" && tile.occupiedSeats>=4)
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
                for(var m=-1; m<=1; m++)
                {
                    for(var n=-1; n<=1; n++)
                    {
                        
                        if(i+m>=0 && i+m<groups.length && j+n>=0 && j+n<groups[0].length && (m!=0||n!=0))
                        { // within range and not the "center" space
                            //console.log(`s at [${i+m}][${j+n}] is ${s[i+m][j+n]}`);
                            if(s[i+m][j+n]=="#")
                            {
                                tile.occupiedSeats++;
                            }
                        }
                    }
                }
            }
        }
        console.log(`occupied seats: ${totalOccupiedSeats}`);
        console.log(groups.map((a)=>a.map(b=>b.item).join('')));
        console.log(groups.map((a)=>a.map(b=>b.occupiedSeats).join('')));
    }
        
        
    console.log(`stable state: ${totalOccupiedSeats}`);

    
}