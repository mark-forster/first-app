require('dotenv').config();
const mongoose = require('mongoose');

/** MongoDb set-up */
mongoose
.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Database is connected successfully: mongoDB Altas...!🐁🐁🐁');
})
.catch(err => console.log(err.message));