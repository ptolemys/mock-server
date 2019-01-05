const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB_URL);

var mock = mongoose.model('MockModel', {
    mockResponse: {
        type:Object,
        required: true
    }
});

module.exports = {
    mock: mock
};