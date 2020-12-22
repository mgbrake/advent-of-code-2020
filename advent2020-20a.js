const { group } = require('console');
const fs = require('fs');

/*****************
 *  MISSION: match edges
 * STRATEGY: load it.  record edges, count number of edge matches for each tile.  
 * // not right: 28523300799841
 */ 


var groups = [], corners = [];
var image = [];
var findobject = `
                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `;

fs.readFile('20-photos.txt', 'utf8', function (err,data) {
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
    var photo = new Object;
    photo.matched = false;
    photo.rows = [];
    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next tile;
            groups.push(photo);
            photo = new Object();
            photo.rows = [];
            return;
        }
        if(line.indexOf("Tile")>=0)
        {
            photo.number = parseInt(line.replace("Tile", "").replace(":","").trim());
        }
        else {
            var columns = line.split('');
            photo.rows.push(columns);
        }
    });
    if(typeof photo.number!=="undefined")
    {
        groups.push(photo); // don't forget the last one!
    }

    console.log(groups.reduce((a,b)=>a+""+b,""));

    groups.forEach(photo => {
        
        photo.edges = [];
        var edge = photo.rows[0].reduce((a,b)=>a+b,""); // top l-r
        photo.edges.push(edge);
        edge = "";
        (photo.rows).forEach(row => {
            edge += row[row.length-1];
        }); // right t-b
        photo.edges.push(edge);
        edge = photo.rows[photo.rows.length-1].reduce((a,b)=>a+b,"").split( '' ).reverse( ).join( '' ); //bottom r-l
        photo.edges.push(edge);
        edge = "";
        (photo.rows).forEach(row => {
            edge += row[0];
        }); // left b-t
        edge = edge.split( '' ).reverse( ).join( '' );
        photo.edges.push(edge);

        // photo.reverseedges = [];
        photo.edges.push(photo.edges[0].split( '' ).reverse( ).join( '' )); 
        photo.edges.push(photo.edges[1].split( '' ).reverse( ).join( '' )); 
        photo.edges.push(photo.edges[2].split( '' ).reverse( ).join( '' )); 
        photo.edges.push(photo.edges[3].split( '' ).reverse( ).join( '' )); 
        
    });
    
    //console.log(groups);

    runIt();
    //composeImage();
    //findInImage();

}

function runIt() {
    
    for(var i=0; i<groups.length; i++)
    {
       var photo = groups[i];
       //place in "center" of space and check all other tiles for each side
        photo.sidesHasMatch = 0;
       //check top row against all other tiles bottom row
       photo.matchesN = 0;
       photo.matchesNphotos = [];
        // if(photo.number == 2311)
        // {
        //     console.log(`photo 2311`);
        // }
       for(var j=0; j<groups.length; j++)
       {
           for(var k=0; k<8; k++)
           {
                if(i!=j && 
                    (groups[i].edges[0] == groups[j].edges[k]
                        || groups[i].edges[4] == groups[j].edges[k])
                )
                {
                    // if(photo.number = 2311)
                    // {
                    //     console.log(`match ${groups[i].number} to ${groups[j].number}: `);
                    // }
                    photo.matchesN++;
                    photo.matchesNphotos[photo.matchesNphotos.length-1] = groups[j];
                    photo.matchesNpattern = groups[j].edges[k];
                }
            }
       }
       if(photo.matchesN>0)
       {
           photo.sidesHasMatch++;
       }
       photo.matchesE = 0;
       photo.matchesEphotos = [];
       for(var j=0; j<groups.length; j++)
       {
           for(var k=0; k<8; k++)
           {
                if(i!=j && 
                    (groups[i].edges[1] == groups[j].edges[k]
                        || groups[i].edges[5] == groups[j].edges[k])
                )
                {
                    // if(photo.number == 2311)
                    // {
                    //     console.log(`match ${groups[i].number} to ${groups[j].number}: `);
                    // }
                    photo.matchesE++;
                    photo.matchesEphotos[photo.matchesEphotos.length-1] = groups[j];
                    photo.matchesEpattern = groups[j].edges[k];
                }
            }
       }
       if(photo.matchesE>0)
       {
           photo.sidesHasMatch++;
       }
       photo.matchesS = 0;
       photo.matchesSphotos = [];
       for(var j=0; j<groups.length; j++)
       {
           for(var k=0; k<8; k++)
           {
                if(i!=j && 
                    (groups[i].edges[2] == groups[j].edges[k]
                        || groups[i].edges[6] == groups[j].edges[k])
                )
                {
                    // if(photo.number == 2311)
                    // {
                    //     console.log(`match ${groups[i].number} to ${groups[j].number}: `);
                    // }
                    photo.matchesS++;
                    photo.matchesSphotos[photo.matchesSphotos.length-1] = groups[j];
                    photo.matchesSpattern = groups[j].edges[k];
                }
            }
       }
       if(photo.matchesS>0)
       {
           photo.sidesHasMatch++;
       }
       photo.matchesW = 0;
       photo.matchesWphotos=[];
       for(var j=0; j<groups.length; j++)
       {
           for(var k=0; k<8; k++)
           {
                if(i!=j && 
                    (groups[i].edges[3] == groups[j].edges[k]
                        || groups[i].edges[7] == groups[j].edges[k])
                )
                {
                    // if(photo.number == 2311)
                    // {
                    //     console.log(`match ${groups[i].number} to ${groups[j].number}: `);
                    // }
                    photo.matchesW++;
                    photo.matchesWphotos[photo.matchesWphotos.length-1] = groups[j];
                    photo.matchesWpattern = groups[j].edges[k];
                }
            }
       }
       if(photo.matchesW>0)
       {
           photo.sidesHasMatch++;
       }

    //    if(photo.number == 2311)
    //     {
    //         console.log(groups.filter(a=>{return a.number==3079;}));
    //        return;
    //     }
    }
    console.log(groups);
    
    //corners SHOULD only have two sides - see if that's true
    var corners = groups.filter(a=>{return a.sidesHasMatch==2;});
    if(corners.length==4)
    {
        console.log(`four corners found`);
        console.log(corners);
        console.log(`corner sum: ${corners.reduce((a,b)=>a*b.number,1)}`);
        return;
    }
    else 
    {
        console.log(`---------CORNERS------------`);
        console.log(corners);

        console.log(`--no four pieces with just two matching edges found.`);
        // well, several of the corners have extra matches, so need to check other things.
        var middleCands = groups.filter(a=>{return a.sidesHasMatch==4});
        // try first config based on middle being right position.
        middleCands.forEach(photo => {

            var mN=false, mE=false, mS=false, mW=false;
            
            if(photo.matchesN==1)
            {
                photo.side1 = photo.matchesNphotos[0];
                mN = true;
            } else if(photo.matchesE==1)
            {
                photo.side1 = photo.matchesEphotos[0];
                mE = true;
            } else if(photo.matchesS==1)
            {
                photo.side1 = photo.matchesSphotos[0];
                mS = true;
            } else if(photo.matchesW==1)
            {
                photo.side1 = photo.matchesWhotos[0];
                mW = true;
            }

            if(typeof photo.side1==="undefined")
            {
                console.log("no single matches. Work on generalizing more...");
                return;
            }
            else {
                photo.side1.matched = true;
            }

            var foundmatch = false;
            if(!mN && !foundmatch)
            {
                for(var i=0;i<photo.matchesNphotos.length; i++)
                {
                    if(!photo.matchesNphotos[i].matched)
                    {
                        photo.side2 = photo.matchesNphotos[i];
                        foundmatch = true;
                        mN = true;
                    }
                }
            }
            if(!mE && !foundmatch)
            {
                for(var i=0;i<photo.matchesEphotos.length; i++)
                {
                    if(!photo.matchesEphotos[i].matched)
                    {
                        photo.side2 = photo.matchesEphotos[i];
                        foundmatch = true;
                        mE = true;
                    }
                }
            }
            if(!mS && !foundmatch)
            {
                for(var i=0;i<photo.matchesSphotos.length; i++)
                {
                    if(!photo.matchesSphotos[i].matched)
                    {
                        photo.side2 = photo.matchesSphotos[i];
                        foundmatch = true;
                        mS = true;
                    }
                }
            }
            if(!mW && !foundmatch)
            {
                for(var i=0;i<photo.matchesWphotos.length; i++)
                {
                    if(!photo.matchesWphotos[i].matched)
                    {
                        photo.side2 = photo.matchesWphotos[i];
                        
                        foundmatch = true;
                        mW = true;
                    }
                }
            }

            if(typeof photo.side2==="undefined")
            {
                console.log("no matches for side 2. Work on generalizing more...");
                return;
            }
            else {
                photo.side2.matched = true;
            }


            var foundmatch = false;
            if(!mN && !foundmatch)
            {
                for(var i=0;i<photo.matchesNphotos.length; i++)
                {
                    if(!photo.matchesNphotos[i].matched)
                    {
                        photo.side3 = photo.matchesNphotos[i];
                        foundmatch = true;
                        mN = true;
                    }
                }
            }
            if(!mE && !foundmatch)
            {
                for(var i=0;i<photo.matchesEphotos.length; i++)
                {
                    if(!photo.matchesEphotos[i].matched)
                    {
                        photo.side3 = photo.matchesEphotos[i];
                        foundmatch = true;
                        mE = true;
                    }
                }
            }
            if(!mS && !foundmatch)
            {
                for(var i=0;i<photo.matchesSphotos.length; i++)
                {
                    if(!photo.matchesSphotos[i].matched)
                    {
                        photo.side3 = photo.matchesSphotos[i];
                        foundmatch = true;
                        mS = true;
                    }
                }
            }
            if(!mW && !foundmatch)
            {
                for(var i=0;i<photo.matchesWphotos.length; i++)
                {
                    if(!photo.matchesWphotos[i].matched)
                    {
                        photo.side3 = photo.matchesWphotos[i];
                        
                        foundmatch = true;
                        mW = true;
                    }
                }
            }

            if(typeof photo.side3==="undefined")
            {
                console.log("no matches for side 2. Work on generalizing more...");
                return;
            }
            else {
                photo.side3.matched = true;
            }


            var foundmatch = false;
            if(!mN && !foundmatch)
            {
                for(var i=0;i<photo.matchesNphotos.length; i++)
                {
                    if(!photo.matchesNphotos[i].matched)
                    {
                        photo.side4 = photo.matchesNphotos[i];
                        foundmatch = true;
                        mN = true;
                    }
                }
            }
            if(!mE && !foundmatch)
            {
                for(var i=0;i<photo.matchesEphotos.length; i++)
                {
                    if(!photo.matchesEphotos[i].matched)
                    {
                        photo.side4 = photo.matchesEphotos[i];
                        foundmatch = true;
                        mE = true;
                    }
                }
            }
            if(!mS && !foundmatch)
            {
                for(var i=0;i<photo.matchesSphotos.length; i++)
                {
                    if(!photo.matchesSphotos[i].matched)
                    {
                        photo.side4 = photo.matchesSphotos[i];
                        foundmatch = true;
                        mS = true;
                    }
                }
            }
            if(!mW && !foundmatch)
            {
                for(var i=0;i<photo.matchesWphotos.length; i++)
                {
                    if(!photo.matchesWphotos[i].matched)
                    {
                        photo.side4 = photo.matchesWphotos[i];
                        
                        foundmatch = true;
                        mW = true;
                    }
                }
            }

            if(typeof photo.side4==="undefined")
            {
                console.log("no matches for side 2. Work on generalizing more...");
                return;
            }
            else {
                photo.side4.matched = true;
            }


        });

        //check if there are four unmatched yet.  If so, the corners is them
        var c = groups.filter(a=>{return !a.matched;});
        if(c.length==4)
        {
            console.log(`four corners found`);
            console.log(corners);
            console.log(`corner sum (harder): ${corners.reduce((a,b)=>a*b.number,1)}`);
            return;
        }
        else {
            console.log(groups);
            console.log(`no luck`);
            return;
        }

    }
}
    

