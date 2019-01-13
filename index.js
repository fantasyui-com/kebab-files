#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const kebabCase = require('lodash/kebabCase');
const program = require('commander');
const pathExists = require('path-exists');
const superb = require('superb');


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
  .map( i => ({ // create object
    filename: i,
    location:path.join(dir, i),
  //  name: kebabCase(path.basename(i, path.extname(i))) + kebabCase(path.extname(i))
  }))


  files.forEach(entry => {

    const isDirectory = fs.lstatSync(entry.location).isDirectory();
    const isFile = fs.lstatSync(entry.location).isFile();

    if(isDirectory){
      entry.name = kebabCase( entry.filename );
    } else if(isFile){
      entry.name = kebabCase(entry.filename) +  path.extname(entry.filename);
    }


  });

  files.forEach(entry => {

    const oldName = entry.location;
    const newName = path.join( dir, entry.name );

    const namesDiffer = (oldName !== newName);
    const pathAvailable = !(pathExists.sync(newName));



        if( namesDiffer ) {
          if(pathAvailable){
            if(program.dryRun) console.log( "%s\n%s\n", oldName, newName );
            if(!program.dryRun) fs.renameSync( oldName, newName );
          }else{
            if(program.dryRun) console.log( "%s\n%s\n", oldName, newName +  '-' + superb.random()  );
            if(!program.dryRun) fs.renameSync( oldName, newName +  '-' + superb.random() );
          }
        }else{
          // name was the same... nothing to do.
        }



  });

} // main


dirValues.map(dir=>main({dir}))
