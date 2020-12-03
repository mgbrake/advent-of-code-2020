const fs = require('fs');

/*****************
 *  MISSION: use the pattern to see if password matches.  Password contains given letter in one position or the other, not both.
 * STRATEGY: Check password string for given indexes for given letter.  check if one and not the other.  Add to valid array if so, 
 *           and return the count at the end.
 */

var data = '';
var valid = [];
var invalid = [];
var readStream = fs.createReadStream('02-passwords.txt', 'utf8');


readStream.on('data', function(chunk) {
    
    data += chunk;
    //console.log(chunk);
    if(chunk.includes('\r\n')){
        let strNumbers = data.split("\r\n");
        console.log(strNumbers);
        strNumbers.pop();
        checkSubArray(strNumbers);
        //console.log(foundMatch + " for " + strNumbers);
        data = data.replace(strNumbers.join("\r\n"), "");
    }
});
    
readStream.on('end', function() {
    
    let strNumbers = data.split("\r\n");
    checkSubArray(strNumbers);

    
    console.log(`last entry ${data}`);

    console.log(`Valid entries: ${valid.length}`);
});


function checkSubArray(strNumbers) {
    
    strNumbers.forEach(element => {
        

        if(element==="")
        {
            return;
        }

        let rule = element.split(":")[0];
        let pwd = element.split(":")[1].replace(" ", "");
        const min = parseInt( rule.split("-")[0] );
        const max = parseInt( rule.split("-")[1].split(" ")[0] );
        let substr = rule.split("-")[1].split(" ")[1];
        //numbers.push(parseInt(element));
        //numbers.sort((a, b) => a - b);
        //return;
        
        
        //var stringToGoIntoTheRegex = escapeRegExp(substr); // this is the only change from above
        //var regex = new RegExp(stringToGoIntoTheRegex, "g");
        // at this point, the line above is the same as: var regex = /#abc#/g;

        //var count = (pwd.match(regex) || []).length;
        console.log(`${substr}: pwd.substring(${min-1},${min-1+substr.length}) ${pwd.substring(min-1,min-1+substr.length)} pwd.substring(${max-1},${max-1+substr.length}) ${pwd.substring(max-1,max-1+substr.length)}  `);
        if((pwd.substring(min-1,min-1+substr.length) == substr && pwd.substring(max-1,max-1+substr.length)!=substr) || 
        (pwd.substring(min-1,min-1+substr.length) != substr &&pwd.substring(max-1,max-1+substr.length)==substr))
        {
            console.log(`valid: ${pwd} at either ${min} or ${max} is a ${substr}`);
            valid.push(element);
        }
        else
        {
            console.log(`INVALID: ${pwd} IS NOT OR IS BOTH at either ${min} or ${max} is a ${substr}`);
            invalid.push(element);
        }
        
    });
    return;
}

function escapeRegExp(stringToGoIntoTheRegex) {
    return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}