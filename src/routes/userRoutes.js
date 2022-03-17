const express = require('express');
const {
    signup,
    signin,
    signout,
    signoutall,
    deleteAccount,
    registerFarm,
    getAllDisease,
    registerDisease
} =  require('../services/AppService')
const requireAuthorization = require('../middleware/requireAuth');


const router = express.Router();

router
    .get('/', (req, res)=>{
        return res.status(200).json({ status: 200, route: '/', routeName: 'index',message: 'ok'});
    })

    .post('/users/signup', async(req, res)=>{

        try {
            const user = await signup(req.body)

            return res.status(201).json({ status: 201, error: false, message: 'sucessfull', user})

        } catch (error) {
            res.status(400).json({ status: 400, error: true, message: 'failed', errorMessage: error.message})
        }
    })

    .post('/users/signin', async(req, res)=>{
        try {
            const {email, password } = req.body;
            const {user, token} = await signin(email, password)

            console.log(user);
            return res.status(200).json({ status: 200, error: false, message: 'sucessfull', user, token})

        } catch (error) {
            console.log(error.message);
            res.status(400).json({ status: 400, error: true, message: 'failed', errorMessage: error.message})
        }
    })

    .post('/users/signout', requireAuthorization, async(req, res)=>{
        try {
            const { message } = await signout(req)

            if(message !== "successfull"){
                throw new Error("something went wrong")
            }
            return res.status(200).json({ status: 200, error: false, message: 'sucessfull'})

        } catch (error) {
            res.status(400).json({ status: 400, error: true, message: 'failed', errorMessage: error.message})
        }
    })

    .post('/users/signoutall', requireAuthorization, async(req, res)=>{
        try {
            const { message } = await signoutall(req)

            if(message !== "successfull"){
                throw new Error("something went wrong")
            }
            return res.status(200).json({ status: 200, error: false, message: 'sucessfull'})

        } catch (error) {
            res.status(400).json({ status: 400, error: true, message: 'failed', errorMessage: error.message})
        }
    })

    // admin
    .get('/users/users', (req, res)=>{
        res.send('ok')
    })

    .get('/users/me', requireAuthorization,(req, res)=>{
        return res.status(200).json({ status: 200, error: true, message: 'sucessfull', user: req.user})
    })

    //developemnt
    .patch('/users/me', (req, res)=>{
        res.send('ok')
    })

    .delete('/users/me', requireAuthorization, async(req, res)=>{
        try {
            const { user } = await deleteAccount(req)

            return res.status(200).json({ status: 200, error: false, message: 'sucessfull', user})
        } catch (error) {
            res.status(400).json({ status: 400, error: true, message: 'failed', errorMessage: error.message})
        }
    })

    // ------------------------------- FARM -----------------------------------------------
    .post('/users/farm', requireAuthorization, async(req, res)=>{
        try {
            req.body.uid = req.user._id
            const farm = await registerFarm(req.body)

            return res.status(201).json({ status: 201, error: false, message: 'sucessfull', farm})
        } catch (error) {
            res.status(400).json({ status: 400, error: true, message: 'failed', errorMessage: error.message})
        }
    })

    // --------------------------------TRANDING DISEASE---------------------
    .get('/disease', async(req, res)=>{
        try {
            const diseases = await getAllDisease()

            return res.status(201).json({ status: 200, error: false, message: 'sucessfull', data: diseases})
        } catch (error) {
            res.status(400).json({ status: 400, error: true, message: 'failed', errorMessage: error.message})
        }
    })

    .post('/disease', async(req, res)=>{
        try {
            const disease = await registerDisease(req.body)

            return res.status(201).json({ status: 201, error: false, message: 'sucessfull', disease})
        } catch (error) {
            res.status(400).json({ status: 400, error: true, message: 'failed', errorMessage: error.message})
        }
    })


module.exports = router;
