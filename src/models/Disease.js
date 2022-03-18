const mongoose = require('mongoose')
const Utils = require('../helpers/Utils')

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
    },
    createdAt:{
        type: String,
        default: new Utils().rightNow()
    },
    updatedAt:{
        type: String,
        default: new Utils().rightNow()
    }
})

const Disease = mongoose.model('Disease', diseaseSchema)

module.exports = Disease;



