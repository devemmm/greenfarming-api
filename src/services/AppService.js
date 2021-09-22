const User = require('../models/User')
const Humidity = require('../models/Humidity')
const Farm = require('../models/Farm')

const signup = async(userInformation)=>{
    try {
        const { fname, lname, phone, email, password } = userInformation

        if(!fname || !lname || !phone || !email || !password){
            throw new Error("missing required information please check your inputs");
        }

        const user = new User({
            ...userInformation
        })

        return await user.save();
    } catch (error) {
        throw new Error(error.message)
    }
}

const signin = async(email, password)=>{
    if(!email || !password){
        throw new Error('you must provide email and password')
    }

    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();

        return {
            user,
            token
        }

    } catch (error) {
        throw new Error(error.message)
    }
}

const signout = async(req)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)

        await req.user.save()

        return {message: 'successfull'}
    } catch (error) {
        throw new Error(error.message)
    }
}


const signoutall = async(req)=>{
    try {
        req.user.tokens = []

        await req.user.save()

        return {message: 'successfull'}
    } catch (error) {
        throw new Error(error.message)
    }
}

const deleteAccount = async(req)=>{
    try {
        await req.user.remove()

        return {user: req.user}
    } catch (error) {
        throw new Error(error.message)
    }
}


const findByPK = async(type, pk)=>{
    switch(type){
        case 'farm':
            return await Farm.findById(pk)
        case 'user':
            return await User.findById(pk)
        default: 
            return null;
    }
}


// ------------------------- FARM -------------------------------------
const registerFarm = async(farmDetails)=>{
    try {
        const {uid, province, district, sector, cell, village}  = farmDetails

        if(!uid || !province || !district || !sector || !cell || !village){
            throw new Error("missing required information")
        }

        const user = await findByPK('user', uid);

       
        const farm = new Farm({
            ...farmDetails
        });

        user.farms = user.farms.concat(farm._id);

        await user.save();
        return await farm.save();
    } catch (error) {
        throw new Error(error.message)
    }
}




// ----------------------- HUMIDITY -----------------------------------
const notifyHumidity = async(humidityDetails)=>{
    try {
        const {fid, temperature, heater, fun, status } = humidityDetails

        if(!fid || !temperature || !heater || !fun || !status){
            throw new Error('missing required values')
        }

        if(fid.length !== 24){
            throw new Error('wrong farm')
        }

        const farm = await findByPK('farm', fid);

        if(!farm){
            throw new Error('Farm not found');
        }

        const humidity = new Humidity({
            ...humidityDetails
        });

        farm.humidities = farm.humidities.concat(humidity._id);

        await farm.save();
        return await humidity.save();

    } catch (error) {
        throw new Error(error.message);
    }
}








// ----------- FUNCTION AND VARIABLES EXPORTATION------------------------
module.exports = { 
    signup, 
    signin, 
    signout, 
    signoutall, 
    deleteAccount,
    registerFarm,
    notifyHumidity 
}