const fs = require('fs');

/*****************
 *  MISSION: count yes answers for each group and sum
 * STRATEGY: count distinct yes - union? - and sum

 */


const theColor = "shiny gold";
var groups = [];

var colors = [], seencolors = [];


fs.readFile('07-bags.txt', 'utf8', function (err,data) {
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
    let group = new Object();
    group.linenumber = ctup++;
    group.yesString = "";
    group.yesArray = [];
    group.memCT = 0;

    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next passport;
            return;
        }
        
        let pe = line.split(" bags contain ");

        let outerbag = pe[0];
        let containedstrings = pe[1].split(',');

        containedstrings.forEach(element => {
            let number = element.trim().split(" ")[0];
            if(number=="no")
            {
                number = 0;
            }
            let color = element.replace(number,"").replace("no", "").replace("bags", "").replace("bag", "").replace(".", "").trim();
            //console.log(number + ":" + color);
            if(groups[outerbag]===undefined)
            {
                groups[outerbag] = new Object();
                groups[outerbag].holds = [];
                groups[outerbag].heldby = [];
            }
            if(groups[color]===undefined)
            {
                groups[color] = new Object();
                groups[color].holds = [];
                groups[color].heldby = [];
            }
            groups[outerbag].holds.push( {"color": color, "qty": number} );
            groups[color].heldby.push(outerbag);
            if(color==theColor)
            {
                console.log('adding contained by color: ' + outerbag);
            }
        });

       
    });

    console.log(groups);
    
    listHoldingBags(theColor);
}

function listHoldingBags(color) {
    
    console.log("checking " + color);
    if(groups[color]===undefined)
    {
        console.log( "0 - no bags can hold one that is " + color);
        return;
    }
 
    colors = groups[color].heldby;
    seencolors = [];
    console.log(`starting list of colors: ` + colors)
    while(colors.length>0 )
    {
        let newcolor = colors.pop();
        console.log("checking " + newcolor);
        seencolors.push(newcolor);
        if(groups[newcolor]===undefined)
        {
            // top level, stop
        }
        else
        {
            (groups[newcolor].heldby).forEach(c => {
                if(!colors.includes(c) && !seencolors.includes(c))
                {
                    colors.push(c);
                }
            });
        }
    }
    
    console.log(`Your ${color} bag can be in one of ${seencolors.length} bags`);
    console.log(` ${seencolors.sort().join(',')} `);
    
}


function uniqueArray(arr) {
    var hashMap = {};
    var uniqueArr = [];
  
    for (var i = 0; i < arr.length; i++) {
      if (!hashMap.hasOwnProperty(arr[i])) {
        uniqueArr.push(arr[i]);
        hashMap[arr[i]] = i;
      }
    }
    return uniqueArr;
  }


String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}