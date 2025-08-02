const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        unique: true
    },
    file: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model("Notes", noteSchema);
