const express = require("express");
const router = express.Router();
const Design = require("../models/Design");

router.get("/", async (req, res) => {

    try {

        const designs = await Design.find().sort({ createdAt: -1 });

        const images = designs.map(img => ({
            id: img._id,
            name: img.name,
            url: img.imageUrl
        }));

        res.json(images);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

module.exports = router;