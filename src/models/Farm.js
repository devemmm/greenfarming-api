const mongoose = require('mongoose');

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
    humidities:{
        type: Array,
        default: []
    }
},{
    timestamps: true
});


farmSchema.virtual('humidity', {
    ref: 'Humidity',
    localField: '_id',
    foreignField: 'fid'
})

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;