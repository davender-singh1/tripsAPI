const TripDB = require("./modules/tripsDB.js");
const db = new TripDB();
const express = require("express");
const path = require("path");
const cors = require("cors");
require('dotenv').config();
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.json({message: "API Listening"});
})

app.post('/api/trips', (req, res) => {
    if(Object.keys(req.body).length === 0) {
      res.status(500).json({ error: "Invalid number "});
    } else {
      db.addNewTrip(req.body).then((data) => { res.status(201).json(data)
      }).catch((err) => { res.status(500).json({ error: err }); });
    }
  });
  
  app.get('/api/trips', (req, res) => {
      db.getAllTrips(req.query.page, req.query.perPage, req.query.title).then((data) => {
        if (data.length === 0) res.status(204).json({ message: "No data returned"});  
        else res.status(201).json(data);  
      }).catch((err) => {
        res.status(500).json({ error: err }); 
      })
  });
  
 
  app.get('/api/trips/:_id', (req, res) => {
    db.getTripById(req.params._id).then((data) => {
      res.status(201).json(data)  
    }).catch((err) => {
      res.status(500).json({ error: err });
    })
  })
  
  app.put('/api/trips/:_id', async (req, res) => {
    try {
      if (Object.keys(req.body).length === 0) {
        return res.status(500).json({ error: "No data to update"});
      }
      const data = await db.updateTripsById(req.body, req.params._id);
      res.json({ success: "Trips updated!"});
    }catch(err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.delete('/api/trips/:_id', async (req, res) => {
    db.deleteTripById(req.params._id).then(() => {
      res.status(202).json({ message: `The ${req.params._id} removed from the system`})  
      .catch((err) => {
        res.status(500).json({ error: err })
      })
    })
  });
  

  db.initialize("Your MongoDB Connection String Goes Here").then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});
