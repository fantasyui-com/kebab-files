const fs = require('fs');
const path = require('path');
const kebabCase = require('lodash/kebabCase');
const program = require('commander');

program
  .version('0.1.0')
  .arguments('<dir> [dirs...]')
  .option('-d, --dry-run', 'Dry run, just print file names.')
  .action(function (dir, dirs) {
     dirValues = [dir];
     if (dirs) {
       dirValues = dirValues.concat(dirs);
     }
  });

program.parse(process.argv);

if ( (typeof dirValues === 'undefined') || (dirValues.length === 0) ) {
   console.error('no dir[s] given!');
   process.exit(1);
}


const main = async function({dir}){

  //
  const files = fs.readdirSync(dir)
  .filter(i=>!i.match(/^\./)) // strip dot files
  .map(i=>path.join(dir, i)) // combine filename and basename
  .map( i => ({ // create object
    location:i,
    name: kebabCase(path.basename(i, path.extname(i))) + path.extname(i)
  }))


  files.forEach(entry => {

    const oldName = entry.location;
    const newName = path.join( dir, entry.name );

    if( oldName !== newName ) {
      if(program.dryRun){
        console.log( "%s\n%s\n", oldName, newName )
      }else{
        fs.renameSync( oldName, newName );
      }
    }

  });

} // main


dirValues.map(dir=>main({dir}))
