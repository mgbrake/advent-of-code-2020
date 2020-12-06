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
    group.yesArray = [];

    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next passport;

            //console.log(`ctup: ${ctup} ` + JSON.stringify(passport));
            groups.push(group);
            group = new Object();
            group.linenumber = ctup++;
            group.yesArray = [];
        }
        let pe = line.split('');

        var c=group.yesArray.concat(pe).sort();
        group.yesArray=c.filter((value,pos) => {return c.indexOf(value) == pos;} );
       
    });

    //done looping, add the last
    groups.push(group);
    
    countHits();
}

function countHits()
{
    var validCT = 0;
    var total = 0;
    groups.forEach(group => {
       total+=group.yesArray.length;
    });
    console.log(groups);
    console.log(`total: ${total}`);
    
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}