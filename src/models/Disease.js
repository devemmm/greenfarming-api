const mongoose = require('mongoose')

const diseaseSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    type: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        required: true
    }
}, {
    timestamps: true
})

const Disease = mongoose.model('Disease', diseaseSchema)

module.exports = Disease;



