const { group } = require('console');
const fs = require('fs');
const { parse } = require('path');

/*****************
 *  MISSION: parse an equation and evaluate
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
    //now just do them
    var accumulated = 0;
    for(var i=0; i<components.length; i++)
    {
        
        if(i==0)
        {
            accumulated += parseInt(components[i]);
        }
        else
        {
            switch(oo[i-1]){
                case '+':
                    accumulated+=parseInt(components[i]);
                    break;
                case '-':
                    accumulated-=parseInt(components[i]);
                    break;
                case '*':
                    accumulated*=parseInt(components[i]);
                    break;
                case '/':
                    accumulated/=parseInt(components[i]);
                    break;
                
            }
        }
    }

    return accumulated;

}