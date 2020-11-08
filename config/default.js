module.exports = {
  mongoURI: process.env.MONGO_URI || "mongodb+srv://nicolasdutour:Kitesurf1983@kitetriplocal.6fxl0.mongodb.net/kitetriplocal?retryWrites=true&w=majority",
  jwtSecret: process.env.JWT_SECRET || "jwtSecret"
};
