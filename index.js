const express= require('express');
const dotenv= require("dotenv");
const app = express();
dotenv.config();
const notifyRoutes= require('./routes/notifyRoutes')



app.use(express.json());

app.use('/api/notify',notifyRoutes)

const PORT = process.env.PORT||4000;

app.listen(PORT,(req , res)=>{
    console.log(`Server is Up and Running ${PORT}`);
});


// const Apikey ='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'
// const sgMail= require('@sendgrid/mail')
// sgMail.setApiKey(Apikey);

// const message ={
//     to:'yahiaabbas03@gmail.com',
//     from:'rabbit.instant@gmail.com',
//     subject:'Hello World',
//     text:'hello ya yahia'

// }
// sgMail.send(message).then(response => console.log('Email is Sent')).catch(error =>console.log(error.message))





