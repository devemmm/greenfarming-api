const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        trim: true,
        default: 'active'
    },
    userType: {
        type: String,
        trim: true,
        default: 'user'
    },
    avatar: {
        type: String,
        trim: true,
        default: 'https://w7.pngwing.com/pngs/867/694/png-transparent-user-profile-default-computer-icons-network-video-recorder-avatar-cartoon-maker-blue-text-logo.png'
    },
    farms: {
        type: Array,
        default:[]
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('farm', {
    ref: 'Farm',
    localField: '_id',
    foreignField: 'uid'
})


userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async(email, password) => {

    if (!email || !password) {
        throw new Error('You must provide email and password')
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Email Not Found !!!')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Wrong Password !!!')
    }

    return user

}

// Hash the plain text password before save
userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User