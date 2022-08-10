const fs = require('fs')

function saveInJSONFile(data, fileName) {
    var jsonData = JSON.stringify(data, null, "\t")
    fs.writeFile(fileName, jsonData, function (err) {
        if (err) {
            console.log(err)
        }
    })
}

function readFromJSONFile(fileName) {
    var jsonData = fs.readFileSync(fileName, 'utf8');
    var data = JSON.parse(jsonData)
    return data
}

module.exports = {
    saveInJSONFile,
    readFromJSONFile
}