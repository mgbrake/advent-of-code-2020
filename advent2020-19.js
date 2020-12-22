const { group } = require('console');
const fs = require('fs');
const { parse } = require('path');

/*****************
 *  MISSION: determine if messages match a given set of rules, which reference other rules
 * STRATEGY: parse an equation and evaluate - substring decomposition using regex
 */ 


var groups = [], messages = [];

fs.readFile('19-test.txt', 'utf8', function (err,data) {
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

    var section = "rules";
    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next section;
            section = "messages";
            return;
        }
        // do first pass on rules and messages
        if(section=="rules")
        {
            var rule = new Object();
            rule.expression = line;
            rule.number = parseInt(line.split(':')[0]);
            line = line.replace(rule.number + ':','').trim();
            rule.matchsets = [];
            rule.validstrings = [];
            var grps = line.split('|');
            for(var i=0;i<grps.length;i++)
            {
                if(grps[i].indexOf('"')>=0)
                {
                    rule.validstrings = [ grps[i].replace(/\"/g, "") ];
                }
                else {
                   rule.validstrings = [];
                    // split up each "and" ordered iteem
                    rule.matchsets.push(grps[i].split(' ').filter(a=>{return parseInt(a);}).map(a=>{return parseInt(a)}));
                }
            }
            groups[rule.number] = rule;
        }
        else if (section=="messages")
        {
            messages.push( line );
        }
    });
    
    //console.log(groups);
    // next, pre evaluate each rule, correction, just the first rule
    //
    groups.filter(a=>{return a.number==0;}).forEach(rule => {
        if(rule.matchsets.length>0)
        {
            rule.matchsets.forEach(set => {
                var vs = getValidStrings(set);
                vs.forEach(element => {
                    if(!rule.validstrings.includes(element))
                    {
                        rule.validstrings.push(element); 
                    } 
                });
            });
        }
    });

    runIt();
}

function runIt() {
    //console.log(groups);
    //console.log(messages);
    //console.log(`sum of lines: ${groups.reduce((a,b)=>a+b.value,0)}`);
    var valid = [], invalid = [];
    messages.forEach(element => {
        if(groups[0].validstrings.includes(element))
        {
            valid.push(element);
        }
        else
        {
            invalid.push(element);
        }
    });
    console.log(`MATCHING messages: ${valid.length}`);
}

function getValidStrings(ruleset)
{
    //goal is to return an array of possible matching strings.
    console.log(`resolving ruleset`);
    console.log(ruleset);
    var possStr = [];
    var str = "";
    possStr.push(str);
    for(var r=0;r<ruleset.length;r++)
    {
        var refrule = groups[ruleset[r]];
        //console.log(`looking up ruleset for ${ruleset[r]}`)
        //console.log(refrule);
        if(refrule.validstrings.length==0)
        {
            // need to lookup subitems, matchsets
            (refrule.matchsets).forEach(element => {
                var stringsToAdd = getValidStrings(element);

                stringsToAdd.forEach(element => {
                    if(!refrule.validstrings.includes(element))
                    {
                        refrule.validstrings.push(element);
                    }
                });
            });
        }

        // valid strings are OR'd together
        // each item in possible strings is removed and replaced
        // with the appended version from valid strings 
        var newArr = [];
        while(possStr.length>0)
        {
            var poss = possStr.pop();
            for(var j=0;j<refrule.validstrings.length; j++)
            {
                if(!newArr.includes(poss+refrule.validstrings[j]))
                {
                    newArr.push(poss+refrule.validstrings[j]);
                }
            }
        }
        possStr = newArr;
       


    }
     console.log(`resolved this:`);
     console.log(ruleset);
     console.log(`to`);
     console.log(possStr);
    return possStr;
}
