const { extractTextFromPDF } = require("../services/pdfService");

exports.uploadMaterial = async (req, res) => {
  try {
    const filePath = req.file.path;

    const text = await extractTextFromPDF(filePath);

    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};