const Document = require("../models/documentModel");

// 📌 Get All Documents
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching documents", error });
  }
};

// 📌 Create a New Document
const createDocument = async (req, res) => {
  try {
    const { name, content } = req.body;
    const newDocument = new Document({ name, content });
    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ message: "❌ Error creating document", error });
  }
};

// 📌 Update a Document
const updateDocument = async (req, res) => {
  try {
    const updatedDocument = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDocument) return res.status(404).json({ message: "Document not found" });
    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(500).json({ message: "❌ Error updating document", error });
  }
};

// 📌 Delete a Document
const deleteDocument = async (req, res) => {
  try {
    const deletedDocument = await Document.findByIdAndDelete(req.params.id);
    if (!deletedDocument) return res.status(404).json({ message: "Document not found" });
    res.status(200).json({ message: "✅ Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error deleting document", error });
  }
};

module.exports = { getDocuments, createDocument, updateDocument, deleteDocument };
