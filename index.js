// --- Setup dependencies ---
const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;

// --- Setup Express App ---
const app = express();

// Enable CORS
app.use(cors());

// Enable JSON to process data (POST GET PUT DELETE)
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
const PORT = 4000;
//MongoClient is async
async function main() {
  // connect to MongoDB, using two params the connection string and a configuration object
  const client = await MongoClient.connect(mongoUri, {
    useUnifiedTopology: true, // simplify access to MongoDB
  });

  const db = client.db("dwad-22-project-2");

  //Create: adding new prayer request, data will be in req.body
  app.post("/prayer_request", async function (req, res) {
    console.log("prayer request route called");
    if (!req.body.title) {
      res.status(400);
      res.send({ error: "Please give a short summary." });
      return; //end the function
    }
    if (!req.body.prayer_topic) {
      res.status(400);
      res.send({ error: "Please choose at least one topic." });
      return; //end the function
    }
    if (!req.body.pray_for) {
      res.status(400);
      res.send({ error: "Please let us know what to pray for." });
      return; //end the function
    }

    try {
      const result = await db.collection("prayerRequest").insertOne({
        date: new Date(req.body.date),
        prayer_topic: req.body.prayer_topic,
        pray_for: req.body.pray_for,
        content: req.body.content,
        answered: req.body.answered,
        response: req.body.response,
        user: {
          username: req.body.user.username,
          user_email: req.body.user.user_email,
        },
        title: req.body.title,
      });
      res.json({ result: result }); //send back the result so client knows if it is successful
    } catch (e) {
      //this e will have the original error message
      res.status(503);
      res.send({
        error: "Database not available, please try later...",
      });
    }
  });

  //Read: GET Endpoint to retrive all existing prayer request, data will be in req.query
  app.get("/prayer_request", async function (req, res) {
    console.log("prayer request get route called");
    //the query string is the parameter passed to the end point, it's not part of the end point URL
    //three ways for and end points to receive info:
    //  1. req.body(send via .POST .PATCH .PUT, or when submit form, );
    //  2. req.query(via query string ?...=...&),
    //  3. req.params(if it is encoded in the url itslef)

    //example: access the query string
    // console.log(req.query);

    // below lines are the basic pattern for making search engine in many languanges: start with and empty criteria that will find all...and using conditions (ifs)
    // to allow client to customize the filter object base on what they send to the endpoint via the query string
    const filter = {};

    // check if req.query.prayer_topic is truthy, aka got value? if yes proceed with what inside {}, if not skip the if
    //  and if all the ifs are falsey,the will filter will be {}, means find all aka find({})
    if (req.query.title) {
      filter.title = {
        $regex: req.query.title,
        $options: "i", //making it case insensetive
      };
    }
    if (req.query.prayer_topic) {
      filter.prayer_topic = { $in: [req.query.prayer_topic] };
      // $in is mongoDB syntax to find somthing in and array
      // can also write as filter["prayer_topic"] = { $in: [req.query.prayer_topic] };
    }

    if (req.query.pray_for) {
      filter.pray_for = { $in: [req.query.pray_for] };
    }

    console.log(filter);
    const requests = await db
      .collection("prayerRequest")
      .find(filter)
      .toArray();
    console.log(requests);
    res.json({ requests: requests });
  });

  // GET Endpoint to retrieve a single prayer request by id : to be added

  // GET Endpoint to get all prayer request from a user by user_email

  // GET Endpoint to retrive all existing prayer request
  // app.get("/prayer_request/:prayer_topic", async function (req, res) {});

  //Update: modify a document, data will be in req.body
  //need to know which prayer_request I'm changing, so will need _id in the parameter using ":"
  app.put("/prayer_request/:prayer_request_id", async function (req, res) {
    // get the ID of the document we want to change, which is in the parameter, so it's req.params.
    const requestID = req.params.prayer_request_id;
    //
    const response = await db.collection("prayerRequest").updateOne(
      {
        _id: new ObjectId(requestID),
      },
      {
        $set: {
          date: new Date(req.body.date),
          prayer_topic: req.body.prayer_topic,
          pray_for: req.body.pray_for,
          content: req.body.content,
          answered: req.body.answered,
          response: req.body.response,
          user: {
            username: req.body.user.username,
            user_email: req.body.user.user_email,
          },
          title: req.body.title,
        },
      }
    );
    res.json({ status: response });
  });

  //Delete:
  app.delete("/prayer_request/:prayer_request_id", async function (req, res) {
    const result = await db.collection("prayerRequest").deleteOne({
      _id: new ObjectId(req.params.prayer_request_id),
    });
    res.json({
      status: "Prayer Request deleted.",
    });
  });
}
main();

app.listen(PORT, function () {
  console.log("Server has started");
});
