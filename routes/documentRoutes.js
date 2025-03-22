const express = require("express");
const { getDocuments, createDocument, updateDocument, deleteDocument } = require("../controllers/documentController");

const router = express.Router();

// 📌 Route to Get All Documents
router.get("/", getDocuments);

// 📌 Route to Create a New Document
router.post("/", createDocument);

// 📌 Route to Update a Document by ID
router.put("/:id", updateDocument);

// 📌 Route to Delete a Document by ID
router.delete("/:id", deleteDocument);

module.exports = router;
