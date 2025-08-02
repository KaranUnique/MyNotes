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

    const Notedata = await Notes.find();
    res.status(200).json(Notedata); // now fetch the data in frontend using fetch
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
    const { filename, file } = req.body;

    try {
        const updateNote = await Notes.findByIdAndUpdate(
            id,
            { filename, file },
            { new: true }
        );
        if (!updateNote) return res.status(404).send("Note not found");
    }

    catch (err) {
        res.status(500).send(err);
    }
})

app.post('/api/note-save', async (req, res, next) => {

    const { filename, content } = req.body;
    // console.log(req.body.content);
    // console.log(req.body.filename);
    const existingfile = await Notes.findOne({ filename });
    if (existingfile) {
        return res.status(409).json({ message: "Filename already exsist", type: "DUPLICATE_FILENAME" });
    }

    try {
        const note = new Notes({ filename, file: content });
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
        const note = await Notes.findByIdAndDelete(id);

        if (!note) return res.status(404).send("File not found");

        res.status(200).send("page is deleted");
    }
    catch (err) {
        res.status(400).send("File not deleted");
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