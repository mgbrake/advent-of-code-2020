const fs = require('fs');

/*****************
 *  MISSION: count yes answers for each group and sum
 * STRATEGY: count distinct yes - union? - and sum

 */


var groups = [];



fs.readFile('06-forms.txt', 'utf8', function (err,data) {
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

            //console.log(`ctup: ${ctup} ` + JSON.stringify(passport));
            groups.push(group);
            group = new Object();
            group.linenumber = ctup++;
            group.yesString = "";
            group.yesArray = [];
            group.memCT = 0;
        }
        else {
            group.memCT++;
        }
        let pe = line.split('');

        group.yesString = group.yesString + line;
        var c=group.yesArray.concat(pe).sort();
        group.yesArray=c.filter((value,pos) => {return c.indexOf(value) == pos;} );
        group.everyoneYesCT = 0;
        pe.forEach(element => {
            var regex = new RegExp(element, "g");
            var count = (group.yesString.match(regex) || []).length;
            if(count==group.memCT)
            {
                group.everyoneYesCT++;
            }
        });
        
       
    });

    //done looping, add the last
    groups.push(group);
    
    countHits();
}

function countHits()
{
    var validCT = 0;
    var total = 0;
    var totalEveryone = 0;
    groups.forEach(group => {
       total+=group.yesArray.length;
       if(group.everyoneYesCT>0)
       {
            totalEveryone+=group.everyoneYesCT;
       }
    });
    console.log(groups);
    console.log(`total anyone: ${total}`);
    console.log(`total everyone: ${totalEveryone}`);
    
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}