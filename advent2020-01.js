const fs = require('fs');

/*****************
 *  MISSION: find 2 numbers in a list that add to 2020.  Multiply them for the answer
 * STRATEGY: Read numbers in from a file, splitting as loading is happening and check against
 *           previously loaded numbers in ascending order - stop checking if the total is larger than 2020,
 *           and add to the sorted list to be checked against other incoming numbers
 */

var data = '';
var numbers = [];
var readStream = fs.createReadStream('01-numbers.txt', 'utf8');
const targetNumber = 2020;
var foundMatch = false;

readStream.on('data', function(chunk) {
    if(foundMatch)
    {
        return;
    }
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
    if(foundMatch)
    {
        return;
    }
    let strNumbers = data.split("\r\n");
    checkSubArray(strNumbers);

    
    console.log(`last entry ${data}`);
});


function checkSubArray(strNumbers) {
    
    strNumbers.forEach(element => {
        if(foundMatch)
        {
            return;
        }

        if(element==="")
        {
            return;
        }

        console.log(numbers);
        let x = parseInt(element) + 0;
        var i = 0;
        
        while(x<targetNumber)
        {
            
            if(i>=numbers.length)
            {
                console.log(`no match so far for ${element}, adding to end`);
                break;
            }
            
            x = parseInt(element) + parseInt(numbers[i]);

            console.log(`checking ${element}, ${element} + ${numbers[i]} = ${x} at position ${i}`);
            if(x==targetNumber)
            {
                console.log(`${element} + ${numbers[i]} = ${targetNumber}, ${element}*${numbers[i]}= ${element*numbers[i]} `);
                foundMatch = true;
                return;
            } 

            //else   
            i++;

        }
        
        numbers.push(parseInt(element));
        numbers.sort((a, b) => a - b);
        return true;

        
    });
    return false;
}