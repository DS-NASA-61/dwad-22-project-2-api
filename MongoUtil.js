const MongoClient = require("mongodb").MongoClient;
const mongoUri = process.env.MONGO_URI;

async function connect(mongoUri, dbname) {
  // connect to MongoDB, using two params the connection string and a configuration object
  //MongoClient is async
  let client = await MongoClient.connect(mongoUri, {
    useUnifiedTopology: true, // simplify access to MongoDB
  });
  const db = client.db(dbname);
  return db;
}
module.exports = { connect };
