const fs = require('fs');
const path = require('path');
const stringify = require('csv-stringify');
const OUTPUT_PATH = path.normalize(path.join(__dirname, "..", "output")) + path.sep;

/**
 * Convert an array into a csv string
 * @private
 */
async function csvStringify(csvData){
  return new Promise((resolve, reject) => {
    stringify(csvData, function(err, output){
      err ? reject(err) : resolve(output);
    }); 
  });
}

/**
 * Check if a file exists
 * @private
 */
async function fileExists(fileName) {
  return new Promise((resolve)=>{
    fs.access(fileName, fs.constants.F_OK, (err) => {
      resolve(err ? false : true);
    });
  });
}

/**
 * Write data to a file
 * @private
 */
async function writeFile(filePath, fileData){
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, fileData, function(err) {
      err ? reject(err) : resolve(filePath);
    });
  });
}

/**
 * Saves a file to a unique name
 * @private
 */
async function saveFile(fileName, fileData) {
  const fileType = fileName.split('.').pop();
  const fileBase = fileName.split('.').shift();
  let exists = true;
  let fileNumber = 1;
  let filePath = "";

  while (exists) {
    const fileNumber_str = "-" + fileNumber.toString(); 
    const current = fileNumber === 1 ? fileBase + '.' + fileType : fileBase + fileNumber_str + '.' + fileType;
    filePath = OUTPUT_PATH + current;
    fileNumber++;
    exists = await fileExists(filePath);
  }
  return writeFile(filePath, fileData);
}

/**
 * Generates a csv containing the seeding results
 * @public
 */
async function exportSeeding(seeds,name){
  let rows = [["seed", "entrant", "rank", "participant ranks"]];
  for(let i = 0; i < seeds.length; i++){
    let participantRanks = "";
    for(const participant of seeds[i].participants){
      participantRanks += participant.rank + " ";
    }
    const row = [i+1, seeds[i].name, seeds[i].rank, participantRanks];
    rows.push(row);
  }
  const csvContent = await csvStringify(rows);
  const file = await saveFile(`${name}.csv`, csvContent);
  return {file, content: csvContent};
}

module.exports = {
  exportSeeding
};
