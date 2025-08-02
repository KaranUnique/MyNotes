const mongoose = require('mongoose');
const folderSchema = new mongoose.Schema({
    foldername: { type: String, required: true },

    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notes'
    }],
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Folder',folderSchema);