const fs = require('fs');

/*****************
 *  MISSION: apply character mask to loaded input and add up the result
 * STRATEGY: ^^

 */


var groups = [];


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
    let group = new Object();
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
        }
        else {
            var group = new Object();
            let pe = line.split('=');
            group.mask = mask;
            group.register = pe[0].split(']')[0].split('[')[1];
            group.decimal = parseInt(pe[1].trim());
            group.binary = dec2bin(group.decimal);
            group.masked = maskbin(mask,group.binary);
            group.newdec = bin2dec(group.masked);
            group.linenum = linenum;
            groups[group.register] = group;

        }
       linenum++;
    });

    console.log(groups);
    console.log(`sum: ${groups.reduce((a,b)=>a+b.newdec,0)}`);
}
function dec2bin(dec){
    return (dec >>> 0).toString(2).padStart(36, '0');
}
function bin2dec(bin){
    return parseInt(bin,2);
}
function maskbin(mask,bin){
    bin = bin.padStart(mask.length-bin.length, 'X');
    var tx = bin.split('');
    //console.log(tx);
    for(var i=0; i<mask.length; i++)
    {
        tx[i] = (mask.substring(i,i+1)==='X'?tx[i]:mask.substring(i,i+1));
    }
    //console.log(tx);
    return tx.filter((a)=>{return (typeof a!=="undefined") && a.trim().length>0}).join('');
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}