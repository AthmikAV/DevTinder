const express = require('express');

const app = express();

app.use('/test',(req,res)=>{
    res.send('Hello athmik');
})

app.listen(3000,()=>{
    console.log("server is created");
});
