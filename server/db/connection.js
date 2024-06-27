const mongoose = require('mongoose');

const url ='mongodb+srv://akshat:kingar123@cluster0.s7zx2zc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(url, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=> console.log('Connected to DB')).catch((e)=>console.log('Error',e))