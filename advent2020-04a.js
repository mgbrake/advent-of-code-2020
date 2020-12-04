const fs = require('fs');

/*****************
 *  MISSION: find valid passports, pix of data on one line
 * STRATEGY: split the lines and assign to fields, then check a list of req fields (reflection)
 byr (Birth Year)
iyr (Issue Year)
eyr (Expiration Year)
hgt (Height)
hcl (Hair Color)
ecl (Eye Color)
pid (Passport ID)
cid (Country ID)
 */


var passports = [];
var reqFields = ["byr","iyr","eyr","hgt","hcl","ecl","pid"];


fs.readFile('04-passports.txt', 'utf8', function (err,data) {
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
    let passport = new Object();
    passport.linenumber = ctup++;

    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next passport;

            //console.log(`ctup: ${ctup} ` + JSON.stringify(passport));
            passports.push(passport);
            passport = new Object();
            passport.linenumber = ctup++;
        }
        let pe = line.split(' ');

        pe.forEach(kvpair => {
            var kvpair = kvpair.split(':');
            if(kvpair.length>1)
            {
                passport[kvpair[0]]=kvpair[1]; 
            }
        });
        
    });

    //done looping, add the last
    passports.push(passport);
    
    countHits();
}

function countHits()
{
    var validCT = 0;
    passports.forEach(p => {
        var isvalid = isValidPassport(p);
        
        if(isvalid)
        {
            validCT++;
        }
    });
    console.log(`Valid passports: ${validCT}`);
    
}

function isValidPassport(passport)
{
    var valid = true;
    reqFields.forEach(element => {
        if(!valid)
        {
            return false;
        }
        if(typeof passport[element] !==  'undefined')
        {
            // element exists, ok
        }
        else
        {
            valid = false;
            console.log(`INVALID passport, missing ${element}:`);
            console.log(passport);
            return false;
        }
    });
    if(valid)
    {
        console.log(`valid passport:`);
        console.log(passport);
    }
    return valid;
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}