const mongoose = require('mongoose');
const Utils = require('../helpers/Utils')

const humiditySchema = mongoose.Schema({
    fid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        trim: true
    },
    temperature: {
        type: Number,
        trim: true
    },
    heater: {
        type: String,
        trim: true
    },
    fun: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        trim: true
    },
    createdAt:{
        type: String,
        default: new Utils().rightNow()
    },
    updatedAt:{
        type: String,
        default: new Utils().rightNow()
    }
});

const Farm = mongoose.model('Humidity', humiditySchema);

module.exports = Farm;