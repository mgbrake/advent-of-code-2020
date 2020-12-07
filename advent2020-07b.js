const fs = require('fs');

/*****************
 *  MISSION: find total number of bags
 * STRATEGY: depth first dive

 */


const theColor = "shiny gold";
var groups = [];
var depth = 0;
var outputgroups = [];


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
            if(number>0)
            {
                groups[outerbag].holds.push( {"color": color, "qty": number} );
                groups[color].heldby.push(outerbag);
            }
            if(color==theColor)
            {
                console.log('adding contained by color: ' + outerbag);
            }
            if(outerbag=="plaid magenta")
            {
                console.log('adding contains: ' + outerbag + ": " + JSON.stringify(groups[outerbag].holds));
            }
        });

       
    });

    //console.log(groups);
    
    listHeldBags(theColor);
}

// returns a number
function listHeldBags(color) {
    
    console.log(`${(">").repeat(depth)} checking ` + color);
    if(groups[color]===undefined)
    {
        console.log( "0 - no bags can be held by " + color);
        return 0;
    }

    if(groups[color].holds.length==0)
    {
        console.log(`${(">").repeat(depth)} no sub bags`);
        return 0; //just itself
    }
 
    let totalBags = 0;
    let colors = groups[color].holds;
    let seencolors = [];
    console.log(`${(">").repeat(depth)} starting list of colors: ` + JSON.stringify(colors));
    for(var i=0; i<colors.length; i++ )
    {
        let newcolor = colors[i];
        
        console.log(`${(">").repeat(depth)} calculating ${newcolor.qty} ${newcolor.color}`);
        depth++;
        let numHeld =  listHeldBags(newcolor.color.trim());
        depth--;
        let bagsToAdd = parseInt(newcolor.qty) * (1 + parseInt(numHeld));
        console.log(`${(">").repeat(depth)} calculated ${newcolor.qty} ${newcolor.color}, each holding ${numHeld} plus the ${newcolor.color} bag makes ${bagsToAdd}`);
        totalBags += bagsToAdd;
    }
    
    console.log(`Each ${color} bag holds ${totalBags} `);
    return totalBags;
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