const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
const MongoUtil = require("./MongoUtil");

// read in the key/value pairs in the .env file
// and made them available via `process.env`
require("dotenv").config();

const app = express();

app.use(express.json()); // needed to enable json

async function main() {
  const db = await MongoUtil.connect(process.env.MONGO_URI, "sample_airbnb");

  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });
  return db;
}

main();
