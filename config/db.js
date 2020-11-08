const mongoose = require("mongoose");
const db = require("./default");

const connectDB = async () => {
  try {
    await mongoose.connect(db.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("Connexion à MongoDB réussie !");
  } catch (err) {
    console.error(err.message);
    console.log("Connexion à MongoDB échouée !");
    process.exit(1);
  }
};

module.exports = connectDB;
