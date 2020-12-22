const { group, groupCollapsed } = require('console');
const fs = require('fs');
const { parse } = require('path');

/*****************
 *  MISSION: count safe ingredients.
 * STRATEGY: parse a list of ingredients paired with allergens.
 * iteratively figure out what is safe and not.
 * first answer: 1329, not right, too low.
 * second answer: 2238 too high
 * third answer: 1941 too low
 * 
 * Each allergen is found in exactly one ingredient. Each ingredient contains zero or one allergen. 
 * Allergens aren't always marked;
 */ 


var groups = [], safeingredients = [], allergens = [], allergen_translations = []
maybenotsafeingredients = [];
var safecount = 0; unsafecount = 0;
fs.readFile('21-ingredients.txt', 'utf8', function (err,data) {
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
    
    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next section;
            return;
        }
        // do repeated matching to pull out parenthesis
        var product = new Object();
        product.knownallergens = [];
        var allerg = line.split('(')[1];
        if(typeof allerg !== "undefined")
        {
            product.knownallergens = allerg.replace("contains ", "").replace(")", "").split(',').map(a=>{return a.trim()});
            product.knownallergens.forEach(alg => {
                if(!allergens.includes(alg))
                {
                    allergens.push(alg);
                }
            });
        }
        product.unsure = line.split('(')[0].split(' ').filter(a=>{return typeof a!=="undefined" && a.length>0;});
        product.safeingredients = [];
        product.unsafeingredients = [];
        
        groups.push(product);
    });
    
    // console.log(groups);
    // return;
    runIt();
}

function runIt() {
    var maxiterations = 5;
    while(groups.filter(a=>a.unsure.length>0).length>0 && maxiterations>=0)
    {
        maxiterations--;
        allergens.forEach(allergen => {
            var commongroups = groups.filter(a=>{return a.knownallergens.includes(allergen);});
            //console.log(`for allergen [${allergen}]`);
            //console.log(commongroups);
            if(commongroups.length==1)
            {
                if(commongroups[0].unsure[0].length==1)
                {
                    if(typeof allergen_translations[commongroups[0].unsure[0]] === "undefined")
                    {
                        allergen_translations[commongroups[0].unsure[0]] = allergen;
                    }
                    if(typeof allergen_translations[allergens]  === "undefined")
                    {
                        allergen_translations[allergen] = commongroups[0].unsure[0];
                    }
                    commongroups[0].unsafeingredients = commongroups[0].unsure[0];
                    commongroups[0].unsure[0].splice(0,1);
                    unsafecount++;
                }
            }
            else if(commongroups.length>=2)
            {
                var commoningredients = commongroups[0].unsure.filter(a=>commongroups[1].unsure.indexOf(a)>=0
                && typeof allergen_translations[a]==="undefined");
                var index = 2;
                while(index<commongroups.length && commoningredients.length>1)
                {
                    commoningredients = commoningredients.filter(a=>commongroups[index].unsure.indexOf(a)>=0
                    && typeof allergen_translations[a]==="undefined");
                    index++;
                }

                if(commoningredients.length<1)
                {
                    //skip it
                }
                else if(commoningredients.length==1)
                {
                    if(typeof allergen_translations[commoningredients[0]] === "undefined")
                    {
                        allergen_translations[commoningredients[0]] = allergen;
                    }
                    if(typeof allergen_translations[allergen] === "undefined")
                    {
                        allergen_translations[allergen] = commoningredients[0];
                    }
                    console.log(`IDENTIFIED: ${allergen} as ${commoningredients[0]}`)
                }
                else {
                    console.log(`couldn't identify one.  its one of:`);
                    console.log(commoningredients);
                }

            }
            //end of individual allergens check
        });

    }

    var maxiterations = 5;
    while(groups.filter(a=>a.unsure.length>0).length>0 && maxiterations>=0)
    {

      

        //remove from unsure list after positively matched
        for(var at_pair in allergen_translations) {
            console.log(`removing identified allergen from other groups`);
            console.log(at_pair);
            for(var i=0;i<groups.length;i++)
            {
                var alg_index = groups[i].unsure.indexOf(at_pair);
                if(alg_index>=0)
                {
                    //console.log(`found ${at_pair} (${allergen_translations[at_pair]}) in ${groups[i].unsure}`)
                    groups[i].unsafeingredients.push(groups[i].unsure[alg_index]);
                    groups[i].unsure.splice(alg_index,1);
                    unsafecount++;
                }
            }
        }

        for(var i=0;i<groups.length;i++)
        {
            //console.log(groups[i]);
            console.log(`known allergens: ${groups[i].knownallergens} unsafe: ${groups[i].unsafeingredients}`);
            if(groups[i].knownallergens.length <= groups[i].unsafeingredients.length)
            {
                console.log(`found a group where remaining ingredients are safe.`);
                console.log(groups[i].unsure);
                
                // the rest are safe
                for(var j=groups[i].unsure.length-1; j>=0; j--)
                {
                    groups[i].safeingredients.push(groups[i].unsure[j]);
                    if(!safeingredients.includes(groups[i].unsure[j]))
                    {
                        safeingredients.push(groups[i].unsure[j]);
                    }
                    groups[i].unsure.splice(j,1);
                    safecount++;
                }
            }
        }

        //remove from unsure list after marked safe
        for(var s=0; s<safeingredients.length; s++) {
            var safe = safeingredients[s];
            console.log(`removing identified safe from other groups`);
            console.log(safe);
            for(var i=0;i<groups.length;i++)
            {
                var alg_index = groups[i].unsure.indexOf(safe);
                if(alg_index>=0)
                {
                    groups[i].safeingredients.push(groups[i].unsure[alg_index]);
                    groups[i].unsure.splice(alg_index,1);
                    safecount++;
                }
            }
        }

        //except, maybe NOT safe, so go back through and find overcommitted groups
        for(var i=0;i<groups.length;i++)
        {
            //console.log(groups[i]);
            if(groups[i].unsafeingredients.length < groups[i].knownallergens.length)
            {
                console.log(`found a group where remaining ingredients are incorrectly marked safe.`);
                console.log(groups[i]);
                safecount -= groups[i].safeingredients.length;
                groups[i].unsure = groups[i].safeingredients;
                maybenotsafeingredients.concat(groups[i].safeingredients);
                groups[i].safeingredients = [];
            }

        }

        //remove from unsure list after marked safe
        for(var s=0; s<maybenotsafeingredients.length; s++) {
            var maybesafe = maybenotsafeingredients[s];
            console.log(`removing maybe-safe from safe lists`);
            console.log(maybenotsafeingredients);
            for(var i=0;i<groups.length;i++)
            {
                var alg_index = groups[i].safeingredients.indexOf(maybesafe);
                if(alg_index>=0)
                {
                    groups[i].unsure.push(groups[i].safeingredients[alg_index]);
                    groups[i].safeingredients.splice(alg_index,1);
                    safecount--;
                }
            }
        }
        maybenotsafeingredients = [];

    }
    

    console.log(`groups`);
    console.log(groups);

    console.log(`unsafe ingredients (${allergen_translations.length/2}) appeared ${unsafecount} times.`);
    console.log(allergen_translations);

    console.log(`safe ingredients (${safeingredients.length}) appeared ${safecount} times.`);
    console.log(safeingredients);

    // ingredients might still not be matched.
    // if different items share the same ingredients and have NO overlapping
    //
}
