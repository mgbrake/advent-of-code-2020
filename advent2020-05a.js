const fs = require('fs');

/*****************
 *  MISSION: find your seat through process of elimination
 * STRATEGY: Decipher binary space partitioning:
 * FBFBBFFRLR = row 44, column 5, number 44*8+5 = 357
 * 
 * Here are some other boarding passes:

BFFFBBFRRR: row 70, column 7, seat ID 567.
FFFBBBFRRR: row 14, column 7, seat ID 119.
BBFFBBFRLL: row 102, column 4, seat ID 820.
As a sanity check, look through your list of boarding passes. What is the highest seat ID on a boarding pass?
MAX(#Bs * 8 + #Rs)
 */


const totalRows = 128, totalColumns = 8, colsStartsAtIndex=7;

var curRow = totalRows/2;
var curColumn = totalColumns/2;
var curSeat = 0;
var seenSeats = [];

fs.readFile('05-passes.txt', 'utf8', function (err,data) {
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
    runIt(lines);
  });


  
function runIt(lines) {
    
    var ctup = 0;
    let seat = new Object();

    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next ;
            return;
        }
        seat.ticket = ctup++;
        seat.code = line;
        translateSeat(line);
        seat.column = curColumn;
        seat.row = curRow;
        seat.seat = curSeat;
        seenSeats.push(seat);
        seat = new Object();
    });

    seenSeats = seenSeats.sort( function(a,b) { return a.seat-b.seat} );
    console.log(seenSeats);
    console.log(`Max seat is: ${JSON.stringify(seenSeats[seenSeats.length-1])}`);

    var thisSeat = seenSeats[0].seat;
    var found = false;
    seenSeats.forEach(element => {
        if(element.seat==thisSeat || found)
        {
            thisSeat++;
            return;
        }
        
        thisSeat++;
        found = true;
        console.log(`missed ticket before ${JSON.stringify(element)}`);
    });
}


function translateSeat(code)
{
    curRow = totalRows/2;
    curColumn = totalColumns/2;
    curSeat = 0;

    for (var i = 0; i < code.length; i++) {
        // binary means powers of 2.  since we are partitioning in half each time
        // the change by will decrease proportional to how far into the string we are.
        // 64 ahead of time to give starting position
        // 32, 16, 8, 4, 2, 1, 
        // so for 32, it's 128/4 = 128/2^2 = 128/(2^(0+2)) 
        // so for 16, it's 128/8 = 128/2^3 = 128/(2^(1+2))
        var changeBy = totalRows/Math.pow(2, i+2); 
        if(i>=colsStartsAtIndex)
        {
            changeBy = totalColumns/Math.pow(2, i-colsStartsAtIndex+2); 
            //console.log(`Changing column by ${changeBy}`);
        }
        else {
            
            //console.log(`Changing rows by ${changeBy}`);
        }
        switch(code.charAt(i))
        {
            case 'F': curRow = curRow - changeBy; break;
            case 'B': curRow = curRow + changeBy; break;
            
            case 'L': curColumn = curColumn - changeBy; break; 
            case 'R': curColumn = curColumn + changeBy; break;  
            default: console.log('what is this?  ' + charAt(i)); break;
        }
    }
    // it's all 0 based, and all the math so far has been on integer standard
    // so the final answer needs to be offset
    curRow-=.5;
    curColumn-=.5;
    curSeat = ((curRow)*8) + (curColumn);
    console.log(`Row: ${curRow}, Columns ${curColumn}, Seat ${curSeat}`);
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}