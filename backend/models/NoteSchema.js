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
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: ['personal', 'work'],
        default: 'personal'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Notes", noteSchema);
