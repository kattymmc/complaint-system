const mongoose = require('mongoose');

const { COMPLAINTS_SYSTEM_MONGODB_HOST, COMPLAINT_SYSTEM_MONGODB_DATABASE } = process.env;
const MONGODB_URI = `mongodb://${COMPLAINTS_SYSTEM_MONGODB_HOST}/${COMPLAINT_SYSTEM_MONGODB_DATABASE}`;

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
})
.then(db => console.log('Database is connected'))
.catch(err => console.log(err));