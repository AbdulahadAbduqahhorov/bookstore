const fs = require('fs')

function saveInJSONFile(data, fileName) {
    var jsonData = JSON.stringify(data, null, "\t")
    fs.writeFile(fileName, jsonData,  (err)=>  {
        if (err) {
            console.log(err)
            return;
        }
    })
}

function readFromJSONFile(fileName) {
   try {
    var jsonData = fs.readFileSync(fileName, 'utf8');
    var data = JSON.parse(jsonData)
    return data
   } catch (error) {
    console.error(error)
   }
}

module.exports = {
    saveInJSONFile,
    readFromJSONFile
}