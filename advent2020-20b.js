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

fs.readFile('20-test.txt', 'utf8', function (err,data) {
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
    composeImage();
    findInImage();

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
                    photo.matchesNphotos[photo.matchesNphotos.length] = groups[j];
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
                    photo.matchesEphotos[photo.matchesEphotos.length] = groups[j];
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
                    photo.matchesSphotos[photo.matchesSphotos.length] = groups[j];
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
                    photo.matchesWphotos[photo.matchesWphotos.length] = groups[j];
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

        console.log(`--no four pieces with just two matching edges found.  see part a for an extended solution`);
        

    }
}
    

function composeImage()
{
    // chose a corner.  Run to another corner.  Stitch tiles as we go.
    var corners = groups.filter(a=>{return a.sidesHasMatch==2;});
    var thistile = corners[0];
    console.log(`start tile: ${thistile.number}`);
    var startcolumn = 0;
    if(thistile.matchesE>0)
    {
        //opposite side is the "entrance"
        thistile.exit = thistile.matchesEpattern;
        thistile.exitdir = "E";
    } 
    else if(thistile.matchesW>0)
    {
        //opposite side is the "entrance"
        thistile.exit = thistile.matchesWpattern; // need to flip the tile instead.
        console.log(`exit west, flipping`);
        console.log(thistile.rows);
        flipTileEW(thistile);
        console.log(`flipped`);
        console.log(thistile.rows);
        thistile.exitdir = "E";
    }
    if(thistile.matchesN>0)
    {
        console.log(`joined to a tile on north, flipping`);
        console.log(thistile.rows);
        flipTileNS(thistile);
        console.log(`flipped`);
        console.log(thistile.rows);
    }
    corners.splice(0,1);
    //create first set of tiles, empty
    for(var r=0; r<thistile.rows.length; r++)
    {
        image.push([]);
    }

    var lasttile = thistile;
    var readyForSouth = [];
    while(!corners.includes(lasttile))
    {
    
        for(var r=0; r<thistile.rows.length; r++) // trim image borders here...
        {
            for(var c=0; c<thistile.rows[r].length; c++)
            {
                image[r][startcolumn+c] = thistile.rows[r][c];
            }
            image[r][image[r].length] = " ";
        }
        //next tile
        startcolumn = image[0].length;
        //go east
        console.log(thistile.matchesEphotos);
        var nexttile = thistile.matchesEphotos[0];
        if(typeof nexttile!=="undefined" && !corners.includes(nexttile))
        {
            console.log(`next tile: ${nexttile.number}`);
            console.log(`starting at: ${startcolumn}`);
            //need to orient it
            //find the pattern match
            var matchedIndex = nexttile.edges.indexOf(thistile.matchesEpattern); 
            // except, needs to be the reversed version
            matchedIndex = (matchedIndex+4)%8;
            if(matchedIndex<4)
            {
                // tile needs to be flipped
                flipTileNS(nexttile);
                matchedIndex = matchedIndex+4
            }
            //now, we know have it oriented.  so rotate to match
            var exitIndex = (matchedIndex+2)%4;
            while(exitIndex!=1)
            {
                // need to rotate
                rotateRight(nexttile);
                exitIndex= ((exitIndex+1)%4);
            }
        }
        if(thistile.matchesS>=1)
        {
            readyForSouth[readyForSouth.length] = thistile;
        }
        lasttile = thistile;
        thistile = nexttile;
    }

    //from here on, just add on the oriented tiles to the south of each of these tiles


    //output the composite

    image.forEach(row => {
        console.log(row.reduce((a,b)=>a+b,""));
    });

    return;
}

function rotateRight(thistile)
{
    var oldtile = JSON.parse(JSON.stringify(thistile)); //copy

    //ROW, COLUMN (not x,y - y,x)
    //0,0 moves to 0,endOfRow
    //1,0 moves to 0,endOfRow-1
    //2,0 moves to 0,endofRow-2
    //0,1 moves to 1,endofRow
    //0,2 moves to 2,endofRow
    var len = thistile.rows.length; //assume square
    for(var r=0; r<oldtile.rows.length; r++) 
    {
        for(var c=0; c<oldtile.rows[r].length; c++)
        {
            thistile[c][len-r] = oldtile[r][c];
        }
    }
    for(var i=0;i<4; i++)
    {
        //0=>1, 1=>2, etc for N->E
        thistile.edges[(i+1)%4] = oldtile.edges[i];
        thistile.edges[((i+1)%4)+4] = oldtile.edges[i+4];
    }

    
    thistile.matchesE = oldtile.matchesN;
    thistile.matchesEphotos = oldtile.matchesNphotos;
    thistile.matchesEpattern = oldtile.matchesNpattern;
    thistile.matchesN = oldtile.matchesW;
    thistile.matchesNphotos = oldtile.matchesWphotos;
    thistile.matchesNpattern = oldtile.matchesWpattern;
    thistile.matchesW = oldtile.matchesS;
    thistile.matchesWphotos = oldtile.matchesSphotos;
    thistile.matchesWpattern = oldtile.matchesSpattern;
    thistile.matchesS = oldtile.matchesE;
    thistile.matchesSphotos = oldtile.matchesEphotos;
    thistile.matchesSpattern = oldtile.matchesEpattern;

    
}

function flipTileEW(thistile)
{
    //console.log(thistile.rows);
    thistile.rows.forEach(row => {
        row = row.split('').reverse().join('');
    });
    //console.log(thistile.rows);
    var holdct = thistile.matchesE;
    var holdPhotos = thistile.matchesEphotos;
    var holdPattern = thistile.matchesEpattern;
    thistile.matchesE = thistile.matchesW;
    thistile.matchesEphotos = thistile.matchesWphotos;
    thistile.matchesEpattern = thistile.matchesWpattern;
    thistile.matchesW = holdct;
    thistile.matchesWphotos = holdPhotos;
    thistile.matchesWpattern = holdPattern;
    var holdEdge = thistile.edges[1];
    thistile.edges[1] = thistile.edges[3].split('').reverse().join('');
    thistile.edges[3] = holdEdge.split('').reverse().join('');
    holdEdge = thistile.edges[5];
    thistile.edges[5] = thistile.edges[7].split('').reverse().join('');
    thistile.edges[7] = holdEdge.split('').reverse().join('');
}

function flipTileNS(thistile)
{
    //console.log(thistile.rows);
    var halfLen = Math.floor(thistile.rows.length/2.0);
    //console.log(`halflen = ${halfLen}`);
    for(var i=0; i<halfLen; i++)
    {
        //console.log(`swapping ${i} with ${thistile.rows.length-1-i}`);
        var holdrow = thistile.rows[i];
        thistile.rows[i] = thistile.rows[thistile.rows.length-1-i];
        thistile.rows[thistile.rows.length-1-i] = holdrow;
    }
    //console.log(thistile.rows);
    var holdct = thistile.matchesN;
    var holdPhotos = thistile.matchesNphotos;
    var holdPattern = thistile.matchesNpattern;
    thistile.matchesN = thistile.matchesS;
    thistile.matchesNphotos = thistile.matchesSphotos;
    thistile.matchesNpattern = thistile.matchesSpattern;
    thistile.matchesS = holdct;
    thistile.matchesSphotos = holdPhotos;
    thistile.matchesSpattern = holdPattern;
    var holdEdge = thistile.edges[0];
    thistile.edges[2] = thistile.edges[2].split('').reverse().join('');
    thistile.edges[2] = holdEdge.split('').reverse().join('');
    holdEdge = thistile.edges[4];
    thistile.edges[4] = thistile.edges[6].split('').reverse().join('');
    thistile.edges[6] = holdEdge.split('').reverse().join('');
}

function findInImage()
{

}
