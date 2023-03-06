const app = require('./app')
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config({path : './config.env'})
const DB = process.env.DB_CLOUD.replace('<PASSWORD>',process.env.DB_PASSWORD);
mongoose.connect(DB).then(()=>{
    console.log("DB connected succesfully")
}).catch(err =>{
    console.log(err);
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT} port`);
  });


