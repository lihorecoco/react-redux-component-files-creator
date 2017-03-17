"use-strict"

const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const basicReactComponentTemplate = "import React, { PropTypes } from \'react\';";
const basicContainerTemplate = "import { connect } from \'react-redux\';\nimport { bindActionCreators } from 'redux';"

const SOURCE_FOLDER = __dirname+"/src/";

const ensureExists = (path, mask, cb) => {
    if (typeof mask == 'function') {
        cb = mask;
        mask = "0777";
    }
    fs.mkdir(path, mask, function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null);
            else cb(err);
        } else cb(null);
    });
}

const convertCamelCaseToDash = (str) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

const createFile = (folderName, fileName, fileFormat, templateText) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(folderName+"/"+fileName+"."+fileFormat, templateText, 'utf8', function (err) {
      if (err) {
        console.error("File could not be creted");
        reject(err);
      } else {
        console.log(fileName+"."+fileFormat+" has been created successfully");
        resolve();
      }
  	});
  })
}

rl.question('ENTER FOLDER NAME then press [ENTER] >>>>> ', (folderName) => {

	ensureExists(SOURCE_FOLDER+folderName, 0744, function(err) {
    	if (!err) {
    		rl.question('Enter component name then press [ENTER] >>>> ', (answer) => {
          Promise.all([
            createFile(SOURCE_FOLDER+folderName, answer, "jsx", basicReactComponentTemplate),
            createFile(SOURCE_FOLDER+folderName, answer+"Container", "js", basicContainerTemplate),
            createFile(SOURCE_FOLDER+folderName, answer+"Actions", "js", ""),
            createFile(SOURCE_FOLDER+folderName, answer+"Reducer", "js", ""),
            createFile(SOURCE_FOLDER+folderName, convertCamelCaseToDash(answer), "scss", "")
          ]).then(() => {
            console.log("Component has been created successfully");
            rl.close();
          }, () => {
            console.error("Component could not be created");
          })
        });
    } else {
      console.error("Folder could not be created");
    }
	});
})
