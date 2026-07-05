const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Design = require("../models/Design");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "PersoPrint",
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Utilisez JPG, PNG, GIF ou WEBP.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post("/", upload.single("image"), async (req,res)=>{

try{

if(!req.file){

return res.status(400).json({
message:"Aucun fichier"
})

}

const design=await Design.create({

name:req.file.originalname,

imageUrl:req.file.path,

category:"Rock"

})

res.json(design)

}

catch(err){

res.status(500).json({

message:err.message

})

}

})
router.get("/designs", async (req, res) => {
  try {

    const result = await cloudinary.search
      .expression("folder:PersoPrint")
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    const images = result.resources.map((img) => ({
      id: img.asset_id,
      name: img.filename,
      imageUrl: img.secure_url
    }));

    res.json(images);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message
    });
  }
});
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Fichier trop volumineux. Max 5MB.' });
    }
  }
  res.status(500).json({ message: error.message });
});

module.exports = router;