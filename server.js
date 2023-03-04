const app = require('./app')
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config({path : './config.env'})

mongoose.connect(process.env.DB_LOCAL).then(()=>{
    console.log("DB connected succesfully")
}).catch(err =>{
    consoel.log(err);
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT} port`);
  });


