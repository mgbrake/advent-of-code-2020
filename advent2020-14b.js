const fs = require('fs');

/*****************
 *  MISSION: apply character mask to loaded input and add up the result
 * STRATEGY: gather list of registers that would be set for each number.
 * multiply number to be set by number of registers that contains it.

 // not right: 2337995697492
 // not right: 2337994453801
 // I was missing replacing X in the zero index.  Probably had things
 // lined up except for that.  Though, the number conversion may have
 // caused some issues also, so while integer comparison is a LOT
 // faster, string comparison of the binary for the overwritten locations 
 //  just works.
 // right: 2741969047858
 */


var groups = [];
var accumulated = 0;
var ctr = 0;


fs.readFile('14-inst.txt', 'utf8', function (err,data) {
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
    
    var linenum = 0;
    var mask = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next passport;
            return;
        }
        if(line.substring(0,4)=="mask")
        {
            mask = line.split('=')[1].trim();
            linenum++;
            return;
        }
        else {
            var proto = new Object();
            let pe = line.split('=');
            proto.mask = mask;
            proto.register = pe[0].split(']')[0].split('[')[1];
            proto.decimal = parseInt(pe[1].trim());
            proto.regbin = dec2bin(proto.register);
            //proto.masked = maskbin(mask,proto.regbin);
            console.log(`register: ${proto.register} ${proto.regbin}`);
            var masked = maskbin(mask,proto.regbin);
            console.log(`variations: ${masked.length}`)
            proto.linenum = linenum;
            // don't bother to convert back to decimal - because of the size, this
            // is causing some issues.
            proto.registersToSet = masked.map((a) => {return a;});
            accumulated += proto.registersToSet.length * proto.decimal;
            proto.registersToUnset = [];
            groups.push(proto);
            if(linenum==39)
            {
                console.log(`line: ${line}, accumulated: ${accumulated} `);
                console.log(proto);
            }
            for(var rg=0;rg<proto.registersToSet.length;rg++)
            {
                
                var reg = proto.registersToSet[rg];
                for(var gp=0;gp<groups.length-1;gp++) //don't include most recent
                {
                    var g = groups[gp];
                    
                    const index = g.registersToSet.indexOf(reg);
                    if(index>=0)
                    {
                        accumulated -= g.decimal;
                        g.registersToUnset[g.registersToUnset.length] = reg;
                        g.registersToSet.splice(index,1);
                    }
                }
            }
        }
        console.log(`linenum: ${linenum} accumulated: ${accumulated} line: ${line}`);
       linenum++;
    });

    
    console.log('done setting registers');
    console.log(groups.filter(a=>{return a.registersToSet.length<=1;}));
    var ck2 = 0, strck = "";
    groups.forEach(g => {
        ck2 += g.registersToSet.length * g.decimal;
        strck += `+(${g.registersToSet.length} * ${g.decimal}) `;
    });
    console.log(strck);
    console.log(`sum: ${accumulated} ${ck2}`); //*${groups[groups.length-1].decimal}=${groups.length*groups[groups.length-1].decimal}`);
 
}
function dec2bin(dec){
    return (dec >>> 0).toString(2).padStart(36, '0');
}
function bin2dec(bin){
    return parseInt(bin,2);
}
function maskbin(mask,bin){
    bin = bin.padStart(mask.length-bin.length, '0');
    var tx = bin.split('');
    //console.log(tx);
    for(var i=0; i<mask.length; i++)
    {
        tx[i] = (mask.substring(i,i+1)==='0'?tx[i]:mask.substring(i,i+1));
    }
    //console.log(tx);
    var maskedstr = tx.filter((a)=>{return (typeof a!=="undefined") && a.trim().length>0}).join('');
    console.log(`mask:           ${mask}`);
    console.log(`masked string:  ${maskedstr}`);
    var masked = [maskedstr];
    var str = masked[0];
    while(str.indexOf('X')>=0)
    {
        newmasked = [];
        while(masked.length>0)
        {
            var tbr = masked.pop();
            var r1 = tbr.replace('X', 0);
            var r2 = tbr.replace('X', 1);
            newmasked.push(r1); // both are single replacements
            newmasked.push(r2);
        }
        masked = newmasked;
        str = masked[0];
    }
    return masked;
}


String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}