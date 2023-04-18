const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
    title: String,
    info: String,
    video_url: String,
    category_code: String,
    img_url: String,
    views: {
        type: Number, default: 0
    },
    likes: {
        type: String, default: 0
    },
    date_created: {
        type: Date, default: Date.now
    },
    user_id: String,
    conpany: {
        type: String, default: "youtube"
    },
})
exports.VideoModel = mongoose.model("videos", schema)

exports.validateVideo = (_reqBody) => {
    let joiSchema = Joi.object({
        title: Joi.string().min(2).max(150).required(),
        info: Joi.string().min(2).max(900).required(),
        video_url: Joi.string().min(2).max(400).required(),
        category_code: Joi.string().min(2).max(100).required(),
        img_url: Joi.string().min(2).max(400).allow(null, "")
    })
    return joiSchema.validate(_reqBody)
}