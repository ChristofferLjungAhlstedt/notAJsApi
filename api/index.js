//basic api express
const app = require('express')();
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//API get request for town name
app.get('/getuppsala', (req, res) => {
    res.send(getLocation('uppsala'));
});

app.get('/getsthlm', (req, res) => {
    res.send(getLocation('sthlm'));
});

app.get('/getmalmo', (req, res) => {
    res.send(getLocation('malmo'));
});


//read from json
function readFromJson() {
    const fs = require('fs');
    let rawdata = fs.readFileSync('location.json');
    return JSON.parse(rawdata);
}

//Find a location based on town name
function getLocation(town) {
    const locations = readFromJson();
    return locations.town[town].spots[0].name;
}