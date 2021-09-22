const mongoose = require('mongoose');

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
    }
}, {
    timestamps: true
});

const Farm = mongoose.model('Humidity', humiditySchema);

module.exports = Farm;