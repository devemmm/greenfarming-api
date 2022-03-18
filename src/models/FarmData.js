const mongoose = require('mongoose');
const Utils = require('../helpers/Utils')
const farmDataSchema = mongoose.Schema({
    fid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm',
        required: true
    },
    heater: {
        type: Number,
        trim: true,
        default: 0
    },
    fun: {
        type: Number,
        trim: true,
        default: 0
    },
    temperature: {
        type: Number,
        trim: true
    },
    humidity: {
        type: Number,
        trim: true
    },
    status: {
        type: String,
        trim: true,
        default: 'success'
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

const FarmData = mongoose.model('FarmData', farmDataSchema);

module.exports = FarmData;