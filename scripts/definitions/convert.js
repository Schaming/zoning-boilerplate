import csv from 'csvtojson';
import fs from 'fs';

const filePath = './definitions test2.csv';
const outputFile = './definitions2.json';

let jsonObj = await csv().fromFile(filePath);

// filter out completely blank rows
jsonObj = jsonObj.filter(row =>
  row.termID || row.terms || row.text || row.type || row.image
);

fs.writeFileSync(outputFile, JSON.stringify(jsonObj, null, 2));
console.log('JSON file created at', outputFile);
