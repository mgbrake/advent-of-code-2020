const { group } = require('console');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
const fs = require('fs');

/*****************
 *  MISSION: find stable state and count occupied seats
 * STRATEGY: load it.  process state changes
 */ 


var fourdimensions = [];
var originalXsize = 1, originalYsize = 1, originalZsize = 1, originalWsize=1;
var maxcycles = 6;

fs.readFile('17-cubes.txt', 'utf8', function (err,data) {
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
    
    fourdimensions = [];
    var dimensions  = [];
    var ctup = 0;
    var rowup = 0;
    var groups = [];
    lines.forEach(line => {
        if(line.trim().length===0)
        {
            //next passport;
            return;
        }
        var tiles = line.split('');
        var row = [];
        var columnup=0;
        tiles.forEach(element => {
            var tile = new Object();
            tile.tilenumber = ctup++;
            tile.rownumber = rowup;
            tile.columnnumber = columnup++;
            tile.dimension = 0;
            tile.fourd=0;
            tile.item = element;
            tile.active = false;
            if(tile.item==="#")
            {
                tile.active = true;
            }
            row.push(tile);
        });
        groups.push(row);
        rowup++;
    });
    dimensions.push(groups);
    fourdimensions.push(dimensions);
    originalYsize = groups.length;
    originalXsize = groups[0].length;
    originalZsize = dimensions.length;
    originalWsize = fourdimensions.length;

    //shift everything to center around 0
    for(var w=0; w<fourdimensions.length; w++)
    {
        var dimensions = fourdimensions[w];
        for(var d=0; d<dimensions.length; d++)
        {
            for(var r=0; r<dimensions[d].length; r++)
            {
                for(var c=0; c<dimensions[d][r].length; c++)
                {
                    dimensions[d][r][c].columnnumber-=Math.floor((originalXsize-1)/2);
                    dimensions[d][r][c].rownumber-=Math.floor((originalYsize-1)/2);
                    dimensions[d][r][c].dimension-=Math.floor((originalZsize-1)/2);
                    dimensions[d][r][c].fourd-=Math.floor((originalWsize-1)/2);
                }
            }
        }
    }
    
    //console.log(groups);
    runIt();
}

function runIt() {
    
    fourdimensions.forEach(dimensions => {
        (dimensions).forEach(d => {
            console.log(`dimension z=${d[0][0].dimension}, w=${d[0][0].fourd}`);
            console.log(d.reduce((a,b)=>{return a+b.reduce((m,n)=>{return m+n.item;},"")+"\n";},""));
        });
    });

    for(var cycle=1; cycle<=maxcycles; cycle++)
    {
        grow(fourdimensions);

        // (dimensions).forEach(d => {
        //     console.log(`dimension ${d[0][0].dimension}`);
        //     console.log(d.reduce((a,b)=>{return a+b.reduce((m,n)=>{return m+n.item;},"")+"\n";},""));
        // });

        // calculate
        for(var g=0;g<fourdimensions.length; g++)
        {
            var dimensions = fourdimensions[g];
            for(var h=0; h<dimensions.length; h++)
            {
                var groups = dimensions[h];
                for(var i=0; i<groups.length; i++)
                {
                    var row =groups[i];
                    for(var j=0; j<row.length; j++)
                    {
                        var tile=row[j];
                    
                        // if(tile.active)
                        // {
                            //console.log(`checking tile at ${tile.columnnumber} ${tile.rownumber} ${tile.dimension}`)
                            var can = countActiveNeighbors(tile);
                            //console.log(tile);
                        //     return;
                        // }
                    }
                }
            }
        }
        // (dimensions).forEach(d => {
        // console.log(d.reduce((a,b)=>{return a+b.reduce((m,n)=>{return m+"("+n.activeneighbors+")";},"")+"\n";},""));
        // });
        //morph
        for(var g=0;g<fourdimensions.length; g++)
        {
            var dimensions = fourdimensions[g];
            for(var h=0; h<dimensions.length; h++)
            {
                var groups = dimensions[h];
                for(var i=0; i<groups.length; i++)
                {
                    var row =groups[i];
                    for(var j=0; j<row.length; j++)
                    {
                        var tile=row[j];
                        if( (tile.activeneighbors<2 || tile.activeneighbors>3) && tile.active)
                        {
                            tile.active = false;
                            tile.item = '.';
                        }
                        if( (tile.activeneighbors==3) && !tile.active)
                        {
                            tile.active = true;
                            tile.item = '#';
                        }
                        
                    }
                }
            }
        }

        console.log(`END OF CYCLE ${cycle}`);
        fourdimensions.forEach(dimensions => {
             (dimensions).forEach(d => {
                 console.log(`dimension z=${d[0][0].dimension}, w=${d[0][0].fourd}`);
                 console.log(d.reduce((a,b)=>{return a+b.reduce((m,n)=>{return m+n.item;},"")+"\n";},""));
             });
         });
     
    }
    
        

        var countActive = 0;
        for(var g=0;g<fourdimensions.length; g++)
        {
                var dimensions = fourdimensions[g];
            for(var h=0; h<dimensions.length; h++)
            {
                var groups = dimensions[h];
                for(var i=0; i<groups.length; i++)
                {
                    var row =groups[i];
                    for(var j=0; j<row.length; j++)
                    {
                        var tile=row[j];
                        if(tile.active)
                        {
                            countActive++;
                        }
                    }
                }
            }
        }
        console.log(`now active: ${countActive}`);

    
}

function countActiveNeighbors(tile)
{
    tile.activeneighbors = 0;
    for(var w=-1;w<=1;w++)
    {
        for(var x=-1;x<=1;x++)
        {
            for(var y=-1;y<=1;y++)
            {
                for(var z=-1;z<=1;z++)
                {
                    if(x==0&&y==0&&z==0&&w==0)
                    {
                        continue; // skip center
                    }
                    
                    if(checklocation(x+tile.columnnumber,y+tile.rownumber,z+tile.dimension,w+tile.fourd))
                    {
                        tile.activeneighbors++;
                    }

                } 
            }
        }
    }
    return tile.activeneighbors;
}

function checklocation(x,y,z,w)
{
    var dimensions = fourdimensions[0];
    var dimension_shift =  Math.floor( (dimensions.length-1) / 2); // z direction
    var row_shift =   Math.floor( (dimensions[0].length-1) / 2); //y
    var column_shift =  Math.floor( (dimensions[0][0].length-1) / 2); //x
    var fourd_shift =  Math.floor( (fourdimensions.length-1) / 2); //x
    //var dimension_shift = 0, row_shift = 0, column_shift = 0;

    if(fourd_shift+w>=fourdimensions.length || fourd_shift+w<0)
    {
        //console.log(`checking ${x} ${y} ${z} ${w} = fourd_shift ${fourd_shift}`);
        return false;
    }
    if(dimension_shift+z>=dimensions.length || dimension_shift+z<0)
    {
        //console.log(`checking ${x} ${y} ${z} ${w} = dimmension shift ${dimension_shift}`);
        return false;
    }
    if(row_shift+y>=dimensions[0].length || row_shift+y<0)
    {
        //console.log(`checking ${x} ${y} ${z} ${w} = row shift ${row_shift}`);
        
        return false;
    }
    if(column_shift+x>=dimensions[0][0].length || column_shift+x<0)
    {
        //console.log(`checking ${x} ${y} ${z} ${w} = column shift ${column_shift}`);
        
        return false;
    }
    //console.log(`found tile at ${x}+${column_shift}, ${y}+${row_shift}, ${z}+${dimension_shift}`);
    tile = fourdimensions[fourd_shift+w][dimension_shift+z][row_shift+y][column_shift+x];
    //  
    //  console.log(tile);
    //console.log(`checking ${x} ${y} ${z} ${w} = ${tile.columnnumber} ${tile.rownumber} ${tile.dimension} = ${tile.active}`);
    return tile.active;
} 

function grow(fourdimensions)
{
    fourdimensions.forEach(dimensions => {
        dimensions.forEach(d => {
            d.forEach(r => {
                var ref = r[0];
                //  console.log(`reference x:`);
                //  console.log(ref);
                var tile = new Object();
                tile.tilenumber = 0;
                tile.rownumber = ref.rownumber;
                tile.columnnumber = ref.columnnumber-1;
                tile.dimension = ref.dimension;
                tile.fourd = ref.fourd;
                tile.item = ".";
                tile.active = false;
                //  console.log(`prepending tile to column: ${ref.columnnumber}`);
                //  console.log(tile);
                r.unshift(tile);

                var ref = r[r.length-1];
                //  console.log(`reference:`);
                //  console.log(ref);
                var tile = new Object();
                tile.tilenumber = 0;
                tile.rownumber = ref.rownumber;
                tile.columnnumber = ref.columnnumber+1;
                tile.dimension = ref.dimension;
                tile.fourd = ref.fourd;
                tile.item = ".";
                tile.active = false;
                //  console.log(`appending tile to column: `);
                //  console.log(tile);
                r.push(tile);
            });
            //console.log(`GREW COLUMNS to ${d[0].length} `);
            //console.log(r);
        });
    });

    fourdimensions.forEach(dimensions => {
        dimensions.forEach(d => {
            var newcolumn = JSON.parse(JSON.stringify(d[0]));
            for(var c=0;c<newcolumn.length;c++)
            {
                newcolumn[c].rownumber--;
                newcolumn[c].active = false;
                newcolumn[c].item = ".";
            }
            // console.log(`prepending new column to row`);
            // console.log(newcolumn);
            d.unshift(newcolumn);

            var newcolumn = JSON.parse(JSON.stringify(d[d.length-1]));
            for(var c=0;c<newcolumn.length;c++)
            {
                newcolumn[c].rownumber++;
                newcolumn[c].active = false;
                newcolumn[c].item = ".";
            }
            // console.log(`appending new column to row`);
            // console.log(newcolumn);
            d.push(newcolumn);
        });
        //console.log(`GREW ROWS `);
        //console.log(d);
    });
    
    fourdimensions.forEach(dimensions => {
        var newdimension = [];
        for(var d1=0;d1<dimensions[0].length;d1++)
        {
            groups = dimensions[0];
            var newgroup = [];
            for(var d2=0;d2<groups[d1].length;d2++)
            {
                var ref = groups[d1][d2];
                var tile = new Object();
                tile.tilenumber = 0;
                tile.rownumber = ref.rownumber;
                tile.columnnumber = ref.columnnumber;
                tile.dimension = ref.dimension-1;
                tile.fourd = ref.fourd;
                tile.item = ".";
                tile.active = false;
                newgroup.push(tile);
            }
            newdimension.push(newgroup);
        }
        dimensions.unshift(newdimension);

        var newdimension = [];
        for(var d1=0;d1<dimensions[dimensions.length-1].length;d1++)
        {
            groups = dimensions[dimensions.length-1];
            var newgroup = [];
            for(var d2=0;d2<groups[d1].length;d2++)
            {
                var ref = groups[d1][d2];
                var tile = new Object();
                tile.tilenumber = 0;
                tile.rownumber = ref.rownumber;
                tile.columnnumber = ref.columnnumber;
                tile.dimension = ref.dimension+1;
                tile.fourd = ref.fourd;
                tile.item = ".";
                tile.active = false;
                newgroup.push(tile);
            }
            newdimension.push(newgroup);
        }
        dimensions.push(newdimension);
    });


    //add new 4d
    var new4d = JSON.parse(JSON.stringify(fourdimensions[0]));

    var dimensions = new4d;
    for(var h=0; h<dimensions.length; h++)
    {
        var groups = dimensions[h];
        for(var i=0; i<groups.length; i++)
        {
            var row =groups[i];
            for(var j=0; j<row.length; j++)
            {
                var tile=row[j];
                tile.fourd--;
                tile.active = false;
                tile.item = ".";
            }
        }
    }
    fourdimensions.unshift(new4d);

    var new4d = JSON.parse(JSON.stringify(fourdimensions[fourdimensions.length-1]));

    var dimensions = new4d;
    for(var h=0; h<dimensions.length; h++)
    {
        var groups = dimensions[h];
        for(var i=0; i<groups.length; i++)
        {
            var row =groups[i];
            for(var j=0; j<row.length; j++)
            {
                var tile=row[j];
                tile.fourd++;
                tile.active = false;
                tile.item = ".";
            }
        }
    }
    fourdimensions.push(new4d);

    
}