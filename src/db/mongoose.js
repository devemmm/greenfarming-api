const moongose = require("mongoose");
moongose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false
    })
    .then(() => {
        return console.log("Connected To Database");
    })
    .catch((error) => {
        console.log(error)
        return console.log("Unable to Connect To Database try Again");
    });