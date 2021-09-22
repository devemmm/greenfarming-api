require('./db/mongoose')
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const electronicsRoutes = require('./routes/electronicsRoutes')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(userRoutes);
app.use(electronicsRoutes)

app.listen(port, ()=>console.log(`Server is running on port ${port}`));