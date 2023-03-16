// --- Setup dependencies ---
const express = require("express");
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;

// --- Setup Express App ---
const app = express();

// Enable JSON data processing
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

//MongoClient is async
async function main() {
  const client = await MongoClient.connect(mongoUri, {
    useUnifiedTopology: true, // simplify our access to MongoDB
  });

  const db = client.db("dwad-22-project-2");

  app.get("/", async function (req, res) {
    const user = await db
      .collection("prayerRequest")
      .find({})
      .limit(2)
      .toArray();
    res.json(user);
  });
}
main();

app.listen(PORT, function () {
  console.log("Server has started");
});
