/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Davender Singh Student ID: 125700211 Date: 19-05-2023
*  Cyclic Link: https://pear-aggressive-indri.cyclic.app/
*
********************************************************************************/ 
const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const TripsDB = require("./modules/tripsDB.js");
const db = new TripsDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

    res.json({ message: "API Listening" });

});

app.post("/api/trips", (req, res) => {

    db.addNewTrip(req.body)
        .then(data => res.status(201).json(data))
        .catch((err) => {
            res.status(500).json(err);
        });

});

app.get("/api/trips", (req, res) => {

    let page = req.query.page ? req.query.page : 0;
    let perPage = req.query.perPage ? req.query.perPage : 0;
    let title = req.query.title;
    db.getAllTrips(page, perPage, title)
        .then(data => res.json(data))
        .catch((err) => {
            res.status(500).json(err);
        });

});

app.get("/api/trips/:id", (req, res) => {

    db.getTripById(req.params.id)
        .then((movie) => {
            movie ? res.json(movie) : res.status(404).json({ "message": "Resource not found" });
        })
        .catch((err) => {
            res.status(500).json({ "message": "Server internal error" });
        });

});

app.put("/api/trips/:id", (req, res) => {

    if (req.body.id && req.params.id != req.body.id) {
        res.status(400).json({ "message": "IDs not match" });
    }
    else {
        db.updateTripById(req.body, req.params.id).then(() => { res.json({ "message": "the object updated" }) })
            .catch((err) => {
                res.status(500).json({ "message": "Server internal error" });
            });
    }

});

app.delete("/api/trips/:id", (req, res) => {

    db.deleteTripById(req.params.id).then(() => { res.json() }).catch((err) => {
        res.status(500).json({ "message": "Server internal error" });
    });
    res.status(204).end();

});

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});
