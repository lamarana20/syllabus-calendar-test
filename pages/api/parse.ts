import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import { parseSyllabus } from "../../utils/parseSyllabus";

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "File upload error" });

    // TypeScript : vérifier que files.file existe et est un fichier
    const fileArray = files.file;
    if (!fileArray || Array.isArray(fileArray) && fileArray.length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    try {
      const buffer = fs.readFileSync(file.filepath);
      const pdfData = await pdfParse(buffer);

      const result = parseSyllabus(pdfData.text);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error parsing PDF" });
    }
  });
}
