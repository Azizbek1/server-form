const mongoose = require('mongoose');

module.exports =  start = async  () => {
    try{
       await mongoose.connect(process.env.DB_URL).then(() =>{
        console.log(`Mongoga Ofline ulandik`);
      })
    }
    catch(e) {
      console.log(e)
    }
}