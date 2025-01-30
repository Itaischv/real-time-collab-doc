Handle documents routes

import express from "express";
import Document from "../models/Document";
import authenticateUser from "../middlewares/authentication.js";
const router = express.Router();

router.post('/', authenticateUser, async(req, res) => {
    try {
        const { title, body } = req.body;
        const newDoc = new Document({title: title, body: body, author: req.user.email});
        await newDoc.save();
        res.status(201).json({ message: "New doc created!", document: newDoc });
    } catch(e) {
        console.error(e);
        res.status(400).json({ error: `Error saving a document: ${e}` });
    }
});

router.get('/', authenticateUser, async(req, res) => {
    try {
      const userId = req.user.id
      const documents = await Document.find({ owner_id: userId })
    } catch(e) {
        res.status(400).json({ error: `Error fetching documents: ${e}` });
    }
});

// Get a single document

router.put('/:id', authenticateUser, async (req,res) => {
    try {
        const { id } = req.params;
        const document = await Document.findOne({ _id: id, owner_id: req.user.id });
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
        const { title, body } = req.body;
        await document.update( {
            title: title || document.title,
            body: body || document.body
        }).then(() => {
            res.status(200).json({ message: "Document updated successfully", document });
        })


    } catch(e) {
        res.status(500).json({ error: `Error updating document: ${e}` });
    }
})

export default router;