const { group } = require('console');
const fs = require('fs');
const { parse } = require('path');

/*****************
 *  MISSION: parse an equation and evaluate.  apply order of operations
 * STRATEGY: parse an equation and evaluate - substring decomposition using regex
 */ 


var groups = [], substitutions = [];
const maxindex = 660;

fs.readFile('18-equations.txt', 'utf8', function (err,data) {
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
            //next section;
            return;
        }
        // do repeated matching to pull out parenthesis
        var str = line;
        var row = new Object();
        row.expression = str;
        substitutions = [];
        row.value = getValue(str);
        row.index = rowup;
        groups.push(row);
        rowup++;
    });
    
    //console.log(groups);
    runIt();
}

function runIt() {
    console.log(groups);
    console.log(`sum of lines: ${groups.reduce((a,b)=>a+b.value,0)}`);
}

function getValue(expression)
{
    var str = expression.replace('','');
    while(str.indexOf('(')>=0)
    {
        var regex = /\([^()]+\)/g
        found = str.match(regex);
        //console.log(found);
        if(typeof found !== "undefined" && found.length>0)
        {
            (found).forEach(paren => {
                var sub = new Object();
                sub.number = substitutions.length;
                sub.expression = paren.substring(1,paren.length-1).trim();
                sub.value = getValue(sub.expression);
                str = str.replace(paren, sub.value);
                substitutions.push(sub);
            });
        }
    }
    console.log(`SUBS for ${expression}: `);
    console.log(substitutions);
    console.log(`SUBBED EXPR: ${str}`);


    
    var operands = /[\+\-\*\/ ]/g;
    var oo = str.match(operands).filter(a=>{return a.trim().length>0;});
    var components = str.split(operands).filter(a=>{return a.trim().length>0;});

    console.log(components);
    console.log(oo);
    //now apply order of operations...
    for(var i=components.length-1; i>0; i--) // go from end to not mess with the order
    {
        if(oo[i-1]==="+")
        {
            oo.splice(i-1,1); // remove opp 
            var val = parseInt(components[i-1]) + parseInt(components[i]); // calculate 
            components[i-1] = val; // replace
            components.splice(i,1); // remove the number consumed by the calculation
        }
    }
    console.log('reduced +');
    console.log(components);
    for(var i=components.length-1; i>0; i--) // go from end to not mess with the order
    {
        if(oo[i-1]==="-")
        {
            oo.splice(i-1,1); // remove opp 
            var val = parseInt(components[i-1]) - parseInt(components[i]); // calculate 
            components[i-1] = val; // replace
            components.splice(i,1); // remove the number consumed by the calculation
        }
    }
    console.log('reduced -');
    console.log(components);
    for(var i=components.length-1; i>0; i--) // go from end to not mess with the order
    {
        if(oo[i-1]==="*")
        {
            oo.splice(i-1,1); // remove opp 
            var val = parseInt(components[i-1]) * parseInt(components[i]); // calculate 
            components[i-1] = val; // replace
            components.splice(i,1); // remove the number consumed by the calculation
        }
    }
    console.log('reduced *');
    console.log(components);

    for(var i=components.length-1; i>0; i--) // go from end to not mess with the order
    {
        if(oo[i-1]==="/")
        {
            oo.splice(i-1,1); // remove opp 
            var val = parseInt(components[i-1]) / parseInt(components[i]); // calculate 
            components[i-1] = val; // replace
            components.splice(i,1); // remove the number consumed by the calculation
        }
    }
    console.log('reduced /');
    console.log(components);

    return components.reduce((a,b)=>a+b,0);

}