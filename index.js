// --- Setup dependencies ---
const express = require("express");
const { ObjectId } = require("mongodb");
const MongoUtil = require("./MongoUtil");
const PORT = 4000;

const cors = require("cors");

// const jwt = require('jsonwebtoken');

require("dotenv").config();

// --- Setup Express App ---
const app = express();

// Enable CORS
app.use(cors());

// Enable JSON to process data (POST GET PUT DELETE)
app.use(express.json());

// --- Declare collection variables ---
const dbCollections = {
  user: "user",
  cellGroup: "cellGroup",
  prayerRequest: "",
  devotional: "devotional",
  devotionalFavourites: "devotionalFavourites",
};

// --- Main Function Starts---
async function main() {
  // --- Connect to database ---
  const db = await MongoUtil.connect(
    process.env.MONGO_URI,
    "dwad-22-project-2"
  );

  // --- Functions and Validations ---
  async function getRecordById(collection, id) {
    const record = await db.collection(dbCollections[collection]).findOne({
      _id: ObjectId(id),
    });
    return record;
  }

  function sendSuccessResponse(res, code, data) {
    res.status(code); // either OK or Created
    res.json({
      status: "success",
      data: data,
    });
  }

  function sendDatabaseError(res) {
    res.status(500); // Internal server error
    res.json({
      status: "error",
      message: "Database not available, please try later.",
    });
  }

  // --- Routes ---

  // --- Routes: Users ---
  // POST Endpoint to create new users,
  app.post("/users", async function (req, res) {
    // Regex for email validation
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    // Regex for password validation (at least 8 characters with both letters and numbers)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    try {
      const { username, user_email, password, cell_group_name } = req.body; // using destructuring assignment to extract these properties from the req.body object

      if (!emailRegex.test(user_email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error:
            "Please input least 8 characters with both letters and numbers",
        });
      }

      // Connect to MongoDB and insert new user
      const result = await db
        .collection(dbCollections.user)
        .insertOne({ username, user_email, password });
      const user_id = result.insertedId; //result.insertedId property contains the _id value of the newly inserted document, so we can access it later to push into cellgroup

      //add user_id to cellgroup
      //need to add cellgroup name in user login form, so findandupdate will find the correct cellgroup then update
      const cellGroup = await db
        .collection(dbCollections.cellGroup)
        .findOneAndUpdate(
          { cell_group_name: cell_group_name },
          { $push: { users: user_id } },
          { returnOriginal: false }
        );

      res.json({ message: "User created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // GET Endpoint to view all the users,

  // PUT Endpoint to edit the users,
  // DELETE to remove user,

  // --- Routes: Prayer Requests ---
  app.get("/", function (req, res) {
    res.send("This is the Wall of Prays API");
  });

  //GET Endpoint to retrive all existing prayer request, data will be in req.query
  app.get("/prayer_request", async function (req, res) {
    console.log("prayer request get route called");
    //the query string is the parameter passed to the end point, it's not part of the end point URL
    //three ways for and end points to receive info:
    //  1. req.body(send via .POST .PATCH .PUT, or when submit form, );
    //  2. req.query(via query string ?...=...&),
    //  3. req.params(if it is encoded in the url itslef)

    // basic pattern for making search engine in many languanges: start with and empty criteria that will find all...and using conditions (ifs)
    // to allow client to customize the filter object base on what they send to the endpoint via the query string
    const filter = {};

    // check if req.query.prayer_topic is truthy? if yes proceed with what inside {}, if not skip the if
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

    // to enable serach by date
    // if (req.query.date) {
    //   filter.date = {}
    // }

    // to enable serach by useremail
    // if (req.query.user.useremail) {
    //   filter.user.useremai = {}
    // }

    const requests = await db
      .collection("prayerRequest")
      .find(filter)
      .toArray();

    res.status(200);
    res.json({ status: "success", requests: requests });
  });

  // GET Endpoint to retrieve a single prayer request by id
  // app.get("/prayer_request/:prayerRequest_id", async function (req, res) {
  //   try {
  //   } catch (error) {
  //     sendDatabaseError(res);
  //   }
  // });

  // POST Endpoint to create new prayer request, data will be in req.body
  app.post("/prayer_request", async function (req, res) {
    // Validate username
    if (req.body.user.username) {
      // validate if user name exist in the user name database
      const usernameExists = await db
        .collection(dbCollections.user)
        .findOne({ username: req.body.user.username });
      if (!usernameExists) {
        res.status(400);
        res.send({ error: "Username does not exist" });
        return;
      }
    } else {
      res.status(400);
      res.send({ error: "Please input username" });
      return;
    }

    // Validate user email
    if (req.body.user.user_email) {
      // check if email is in correct format

      // const emailRegex =
      //   /^([A-Za-z0-9_\-\.]){1,}\@([A-Za-z0-9_\-\.]){1,}\.([A-Za-z]){2,4}$/;
      // if (!req.body.user_email.match(emailRegex)) {
      //   res.status(400);
      //   res.send({ error: "Invalid email format" });
      //   return;
      // }
      // check if email exist in database
      const emailExists = await db
        .collection(dbCollections.user)
        .findOne({ user_email: req.body.user.user_email }); //emailExists returns a object if can find

      if (!emailExists) {
        res.status(400);
        res.send({ error: "User Email does not exist" });
        return;
      } else {
        res.status(400);
        res.send({ error: "Please input username" });
        return;
      }
    }

    // Validate the rest of the input
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

    // Validate content 300charter max
    if (req.body.content && req.body.content.length > 300) {
      res.status(400);
      res.send({ error: "Exceeded max length of 300 chars" });
      return; //end the function
    }

    //if no error, proceed to create a new prayer request
    try {
      // insert newly created prayer request to its collection
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

      // find the coresponding user docunment and update to include the newly created prayerRequest ID
      const user = await db.collection("user").findOneAndUpdate(
        {
          username: req.body.user.username,
          user_email: req.body.user.user_email,
        },
        { $push: { prayerRequest: result.insertedId } }, //result.InsertedID returns the _id value as ObjectId，{ $push: { <field1>: <value1>, ... } }
        { returnOriginal: false } //make sure to return the updated user collection
      );

      res.json({ result: result }); //send back the result so client knows if it is successful
    } catch (e) {
      sendDatabaseError(res);
    }
  });

  //Update: modify a document, data will be in req.body
  //need to know which prayer_request I'm changing, so will need _id in the parameter using ":"
  app.put("/prayer_request/:prayer_request_id", async function (req, res) {
    // get the ID of the document we want to change, which is in the parameter, so it's req.params.
    const requestID = req.params.prayer_request_id;

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

  // --- Routes: Responses (Part of Prayer Requests) ---
  // POST Endpoint to create new responses,
  app.post(
    "/prayer_request/:prayer_request_id/responses",
    async function (req, res) {
      try {
        // Validate the JWT token
        // const authHeader = req.headers.authorization;
        // if (!authHeader) {
        //   return res.status(401).json({ error: 'Missing authorization header' });
        // }
        // const token = authHeader.split(' ')[1];
        // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // const userId = decodedToken.userId;

        // below is redundent, keep it to remember no need to do this next time!
        // validation: make sure that post exists!
        // const prayerRequest = await db
        //   .collection("prayerRequest")
        //   .find({ " _id": new ObjectId(req.params.prayer_request_id) })
        //   .toArray(); //toArray is very important!!!! I encountered bug here!!
        // console.log(req.params.prayer_request_id);

        // if (!prayerRequest) {
        //   return res.status(404).json({ error: "Prayer Request not found" });
        // }

        //add new response and push it to the response array embeded in prayerRequest
        const newResponse = {
          response_id: new ObjectId(),
          content: req.body.content,
          // user_id: userId, //will be retrived from const userId = decodedToken.userId;
        };
        const result = await db
          .collection("prayerRequest")
          .updateOne(
            { _id: new ObjectId(req.params.prayer_request_id) },
            { $push: { response: newResponse } }
          );

        if (result.modifiedCount !== 1) {
          throw new Error("Failed to add comment to post");
        }

        res.json({ result: result });
      } catch (error) {
        res.status(404);
        res.send({ error: "Prayer Request ID does not exist" });
      }
    }
  );

  // PUT Endpoint to edit the response,
  app.put(
    "/prayer_request/:prayer_request_id/responses/:response_id",
    async function (req, res) {
      try {
        // get the ID of the response I want to change, which is in the parameter
        const prayerRequestId = req.params.prayer_request_id;
        const responseId = req.params.response_id;
        const newContent = req.body.content;
        console.log(prayerRequestId);
        console.log(responseId);
        console.log(newContent);

        //find the id of the prayer_request
        const prayerRequest = await db
          .collection("prayerRequest")
          .findOne({ _id: new ObjectId(prayerRequestId) });

        if (!prayerRequest) {
          return res.status(404).json({ error: "Prayer Request not found" });
        }

        // find the prayer request document and the response and update it
        const result = await db.collection("prayerRequest").updateOne(
          {
            _id: new ObjectId(prayerRequestId),
            "response.response_id": new ObjectId(responseId),
          },
          { $set: { "response.$.content": newContent } }
        );
        res.json({ result: result });
      } catch (error) {
        res.status(404);
        res.send({ error: "Prayer Request ID does not exist" });
      }
    }
  );

  // --- Routes: Cellgroups (for future development) ---
  // POST Endpoint to create new cellgroup,
  // GET Endpoint to view all the cellgroups,
  // PUT Endpoint to edit the cellgroups,
  // DELETE to remove cellgroup,
}
main();

app.listen(PORT, function () {
  console.log("Server has started");
});
