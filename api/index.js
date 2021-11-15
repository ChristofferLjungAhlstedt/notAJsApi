//basic api express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//API get request for town name
app.get('/getTrip/:id', (req, res) => { // Note to self. :id is the parameter. Don't need to put it in the url. Dont need : in the url
    const { id } = req.params;
    res.send(getLocation(id));
});

//Post request for new location
app.post('/postLoc/:newLocation', (req, res) => {
    const {newLocation} = req.params;
    res.send(newLocation);
});

//Middleware for better experience
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found. ERROR: 404'})
});

app.use(express.json());

//read from json
function readFromJson() {
    const fs = require('fs');
    let rawdata = fs.readFileSync('location.json');
    return JSON.parse(rawdata);
}

//Find a location based on town name
function getLocation(town) {
    const locations = readFromJson();
    try {
        return locations.town[town].spots[0].name;
    } catch (e) {
        return 'No such location';
    }
}