const express = require('express');
//const router = express.Router();
const app = express();
const cors = require("cors");

const connectdb = require("./db");

app.use(cors());
app.use(express.json());

connectdb();

const Notes = require('./models/NoteSchema');
const Folder = require('./models/FolderSchema');

app.get('/api/note-viewedit', async (req, res) => {
    // Only get non-deleted notes
    const Notedata = await Notes.find({ isDeleted: { $ne: true } });
    res.status(200).json(Notedata); // now fetch the data in frontend using fetch
})

// Get favorite notes
app.get('/api/notes/favorites', async (req, res) => {
    try {
        const favoriteNotes = await Notes.find({ isFavorite: true, isDeleted: { $ne: true } });
        res.status(200).json(favoriteNotes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Get notes by category
app.get('/api/notes/category/:category', async (req, res) => {
    const { category } = req.params;
    try {
        const categoryNotes = await Notes.find({ category: category, isDeleted: { $ne: true } });
        res.status(200).json(categoryNotes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})
app.get('/api/note-viewedit/:id', async (req, res) => {

    const { id } = req.params;
    try {
        const note = await Notes.findById(id);
        if (!note) return res.status(404).json({ message: "Page not found" })
        res.status(200).json(note);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }

})

app.put('/api/note-viewedit/:id', async (req, res) => {
    const { id } = req.params;
    const { filename, file, isFavorite, category } = req.body;

    try {
        const updateNote = await Notes.findByIdAndUpdate(
            id,
            { filename, file, isFavorite, category },
            { new: true }
        );
        if (!updateNote) return res.status(404).send("Note not found");
        res.status(200).json(updateNote);
    }

    catch (err) {
        res.status(500).send(err);
    }
})

app.post('/api/note-save', async (req, res, next) => {

    const { filename, content, isFavorite, category } = req.body;
    // console.log(req.body.content);
    // console.log(req.body.filename);
    const existingfile = await Notes.findOne({ filename });
    if (existingfile) {
        return res.status(409).json({ message: "Filename already exsist", type: "DUPLICATE_FILENAME" });
    }

    try {
        const note = new Notes({ 
            filename, 
            file: content, 
            isFavorite: isFavorite || false, 
            category: category || 'personal' 
        });
        await note.save();
        // console.log("post request works");

        res.status(200).send({ message: "Note saved" });
    }
    catch (err) {
        res.status(400).send({ message: "Note not saved" });
    }
})

app.delete('/api/note-viewedit/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        // Soft delete - mark as deleted instead of removing from database
        const note = await Notes.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );

        if (!note) return res.status(404).send("File not found");

        res.status(200).send("File moved to trash");
    }
    catch (err) {
        res.status(400).send("File not moved to trash");
    }
})

// Get trash items
app.get('/api/notes/trash', async (req, res) => {
    try {
        const trashedNotes = await Notes.find({ isDeleted: true });
        res.status(200).json(trashedNotes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Permanently delete a specific file from trash
app.delete('/api/notes/trash/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Notes.findOneAndDelete({ _id: id, isDeleted: true });
        if (!note) return res.status(404).send("File not found in trash");
        res.status(200).send("File permanently deleted");
    } catch (err) {
        res.status(400).send("Failed to permanently delete file");
    }
})

// Empty entire trash (delete all trashed files)
app.delete('/api/notes/trash', async (req, res) => {
    try {
        const result = await Notes.deleteMany({ isDeleted: true });
        res.status(200).json({ 
            message: "Trash emptied successfully", 
            deletedCount: result.deletedCount 
        });
    } catch (err) {
        res.status(400).json({ error: "Failed to empty trash" });
    }
})

// Restore a file from trash
app.put('/api/notes/restore/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Notes.findOneAndUpdate(
            { _id: id, isDeleted: true },
            { isDeleted: false },
            { new: true }
        );
        if (!note) return res.status(404).send("File not found in trash");
        res.status(200).json({ message: "File restored successfully", note });
    } catch (err) {
        res.status(400).send("Failed to restore file");
    }
})

// folder routes 

app.get('/api/folders', async (req, res) => {
    try {
        const folders = await Folder.find();
        res.status(200).json(folders);
    } catch (err) {
        console.error("Error fetching folders:", err);
        res.status(500).json({ error: err.message });
    }
})

app.get('/api/folders/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const folder = await Folder.findById(id).populate('files');
        if (!folder) return res.status(404).json({ message: "Folder not found" });
        
        console.log("Folder found:", folder);
        console.log("Files in folder:", folder.files);
        
        res.status(200).json(folder);
    } catch (err) {
        console.error("Error fetching folder:", err);
        res.status(500).json({ error: err.message });
    }
})

app.post("/api/create-folder", async (req, res, next) => {
   const { foldername, selectedFiles } = req.body;

    try {
        const folder = new Folder({ foldername, files: selectedFiles })
        await folder.save();

        res.status(200).json({ message: "Folder saved" });
    }
    catch (err) {
        console.error("Error saving folder:", err);
        res.status(400).json({ message: "Folder not saved", error: err.message });
    }
})

app.listen(3000, () => {
    console.log("server created");
});