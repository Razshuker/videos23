const express = require("express");
const { VideoModel, validateVideo } = require("../models/videoModel");
const { auth } = require("../middlewares/auth")
const router = express.Router();

router.get("/", async (req, res) => {
    const perPage = req.query.perPage || 5;
    const page = req.query.page - 1 || 0;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? -1 : 1;
    const category = req.query.category;
    try {
        let filterFind = {};
        filterFind = category ? { category_code: category } : {};
        // if (category) {
        //     filterFind = { category_code: category }
        // }
        let data = await VideoModel.find(filterFind)
            .limit(perPage)
            .skip(perPage * page)
            .sort({ [sort]: reverse })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})
router.get("/count", async (req, res) => {
    let perPage = req.query.perPage || 5;
    try {
        const count = await VideoModel.countDocuments({});
        res.json({ count, pages: Math.ceil(count / perPage) })
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/single/:id", async (req, res) => {
    try {
        const id = req.params.id
        let data = await VideoModel.findOne({ _id: id });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})


router.post("/", auth, async (req, res) => {
    let validBody = validateVideo(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let video = new VideoModel(req.body);
        video.user_id = req.tokenData._id;
        await video.save();
        res.json(video)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.put("/:id", auth, async (req, res) => {
    let validBody = validateVideo(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let id = req.params.id;
        let data;
        if (req.tokenData.role == "admin") {
            data = await VideoModel.updateOne({ _id: id }, req.body);
        } else {
            data = await VideoModel.updateOne({ _id: id, user_id: req.tokenData._id }, req.body);
        }
        res.json(data)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.delete("/:id", auth, async (req, res) => {
    try {
        let id = req.params.id;
        let data;
        if (req.tokenData.role == "admin") {
            data = await VideoModel.deleteOne({ _id: id });
        } else {
            data = await VideoModel.deleteOne({ _id: id, user_id: req.tokenData._id });
        }
        res.json(data)
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;