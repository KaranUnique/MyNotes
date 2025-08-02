const mongoose = require('mongoose');

const connectdb = () => {
 mongoose.connect("mongodb://localhost:27017/Notes").
        then(() => {
            console.log("Database created");
        })
        .catch(err => {
            console.log("error occur", err);
        })

}


module.exports = connectdb;