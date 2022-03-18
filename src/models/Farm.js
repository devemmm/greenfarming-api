const mongoose = require('mongoose');
const Utils = require('../helpers/Utils')

const farmSchema = mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    province: {
        type: String,
        trim: true
    },
    district: {
        type: String,
        trim: true
    },
    sector: {
        type: String,
        trim: true
    },
    cell: {
        type: String,
        trim: true
    },
    village: {
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


farmSchema.virtual('farmData', {
    ref: 'FarmData',
    localField: '_id',
    foreignField: 'fid'
})

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;