const express = require('express');
const { notifyHumidity } = require('../services/AppService')

const router = express.Router();

router
    .get('/humidity', async(req, res)=>{
        res.status(200).json({message: 'ok'})
    })

    .post('/users/notify/humidity/:fid', async(req, res)=>{
        try {

            req.body.fid = req.params.fid

            const humidity = await notifyHumidity(req.body)
            return res.status(201).json({ status: 201, error: true, message: 'sucessfull', humidity})
        } catch (error) {
            res.status(400).json({ status: 400, error: true, message: 'failed', errorMessage: error.message})
        }
    })

    .get('/**', (req, res)=>{
        res.status(404).json({ status: 400, error: true, message: 'not found', errorMessage: "router not found"})
    })

    .post('/**', (req, res)=>{
        res.status(404).json({ status: 400, error: true, message: 'not found', errorMessage: "router not found"})
    })

    .patch('**', (req, res)=>{
        res.status(404).json({ status: 400, error: true, message: 'not found', errorMessage: "router not found"})
    })

    .delete('**', (req, res)=>{
        res.status(404).json({ status: 400, error: true, message: 'not found', errorMessage: "router not found"})
    })


module.exports = router;