const mongoose = require('mongoose');

const mongoUri = "mongodb+srv://pratik:8uvauzFaaOVzw2tU@cluster0.hfq2sgw.mongodb.net/";

const connectmongo = () => {
  mongoose.connect(mongoUri,{
        useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Connection events
  const db = mongoose.connection;

  db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
};

module.exports = connectmongo;
