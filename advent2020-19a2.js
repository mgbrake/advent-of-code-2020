const { group } = require('console');
const fs = require('fs');
const { parse } = require('path');

/*****************
 *  MISSION: determine if messages match a given set of rules, which reference other rules
 * STRATEGY: parse an equation and evaluate - substring decomposition using regex
 */ 


var groups = [], messages = [];

fs.readFile('19-rules.txt', 'utf8', function (err,data) {
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
            rule.validstringsregex = "";
            var grps = line.split('|');
            for(var i=0;i<grps.length;i++)
            {
                if(grps[i].indexOf('"')>=0)
                {
                    rule.validstringsregex = grps[i].replace(/\"/g, "");
                }
                else {
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
                    rule.validstringsregex+= vs ; 
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
        var regex = new RegExp(`${groups[0].validstringsregex}`); 
        if(element.replace(regex, "").trim().length==0)
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
    var resultregex = "";
    for(var r=0;r<ruleset.length;r++)
    {
        var refrule = groups[ruleset[r]];
        console.log(`looking up ruleset for ${ruleset[r]}`)
        console.log(refrule);
        if(refrule.validstringsregex.length==0)
        {
            // need to lookup subitems, matchsets
            refrule.validstringsregex = "";
            (refrule.matchsets).forEach(element => {
                var resEx = getValidStrings(element);
                if(refrule.validstringsregex.length>0)
                {
                   refrule.validstringsregex=`(${refrule.validstringsregex}|${resEx})`;
                }
                else
                {
                    refrule.validstringsregex=`${resEx}`;
                }
            });
        }

        // valid strings are OR'd together
        if(resultregex.length==0)
        {
            resultregex = `${refrule.validstringsregex}`;
        }
        else
        {
            resultregex = `${resultregex}${refrule.validstringsregex}`;
        }


    }
     console.log(`resolved this:`);
     console.log(ruleset);
     console.log(`to`);
     console.log(resultregex);
    return resultregex;
}
