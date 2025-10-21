import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configuration de multer pour sauvegarder les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Chemin vers le dossier public/uploads du client
    const uploadPath = path.join(
      __dirname,
      "../../../../client/public/uploads"
    );

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Utiliser le nom fourni dans le body ou générer un nom unique
    const playerName = file.originalname.split(".")[0] || "player";
    const extension = path.extname(file.originalname);
    const fileName = `${playerName.toLowerCase()}${extension}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    // Accepter seulement les images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Seules les images sont autorisées"));
    }
  },
});

// Route pour uploader une image
router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucune image fournie" });
    }

    const fileName = req.file.filename;

    res.json({
      message: "Image uploadée avec succès",
      fileName: fileName,
      path: `/uploads/${fileName}`,
    });
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error);
    res.status(500).json({ error: "Erreur lors de l'upload de l'image" });
  }
});

export default router;
