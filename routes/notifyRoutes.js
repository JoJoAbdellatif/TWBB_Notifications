const express = require('express');
const asyncHandler = require('express-async-handler')
const notifyRoute = express.Router();
const sgMail= require('@sendgrid/mail')
const Apikey = process.env.Apikey;
sgMail.setApiKey(Apikey);
const URLorder= 'http://localhost:2000/api/orders/';
const axios = require('axios');
const URLinventory= 'http://localhost:5000/api/product/';

notifyRoute.get('/update', asyncHandler(async(req , res) => {
    const orderId = req.query.orderId;
    url = URLorder+"getOrder/"+orderId

    const order = await axios.get(url)
    data = Object.assign(order.data)
    const email = data.Email
    const s = data.Status
    const status = s.toLowerCase()

    let total =0
    let purchacelist=[];
    let cart =""
    for (let i = 0; i < data.Items.length; i++) {
        const price = await axios.get(URLinventory+"price/"+data.Items[i].ProductId)
        const detail = await axios.get(URLinventory+"details/"+data.Items[i].ProductId)
        const prPrice =Object.assign(price.data)
        const prdetail =Object.assign(detail.data)
        const obj = {'ProductName':prdetail.productName,'Productprice':prPrice.productPrice,'Quantity':data.Items[i].Quantity}
         cart =cart+ `Name: ${prdetail.productName}    Price:${prPrice.productPrice} Quantity:${data.Items[i].Quantity} <br>`
        total = total+parseInt(prPrice.productPrice)*data.Items[i].Quantity
        
        purchacelist.push(obj)
      }
    let t = total/100
    

    const message ={
        to:email,
        from:'rabbit.instant@gmail.com',
        subject:'Update On Your Order',
        html:`<h1>Your Order Is ${status} </h1><p>
        Dear Valued Customer,<br>
        We hope you're having a great day. We wanted to tell you, your order is ${status}
        This order contains:<br>
        <br>${cart}<br>
        Total is:${t}<br>
        
        Best Regards,<br>
        Rabbit Team
        <img src="../template/images/image-1.png">
        </p>`

    }
    sgMail.send(message).then(response => console.log('Email is Sent')).catch(error =>console.log(error.message))
    console.log(email)
    res.send("Email Sent")
}))

notifyRoute.get('/register', asyncHandler(async(req , res) => {
    
    const email = req.query.userEmail;
    const emailToken = req.query.userEmailToken;
    const message ={
        to:email,
        from:'rabbit.instant@gmail.com',
        subject:'Rabbit Verify Your Email',
        html:`<p>
        Hello,Thanks For Choosing Rabbit For All Your Daily Needs.<br>
        Please Copy and paste this link to verify your account:
       <br>
        <button><a href=' http://localhost:8000/api/users/verify?emailtoken=${emailToken}' alt='Broken Link'>Click to verify</a></button>
        <br>
        Best Regards,<br>
        Rabbit Team
        <img src="../template/images/image-1.png">
        </p>`

    }
    try{
        sgMail.send(message).then(response => console.log('Email is Sent')).catch(error =>console.log(error.message))
        console.log(email)
        res.send("Email Sent")
    }catch(error){
        res.status(500)
        res.send("Oops Something went wrong")    
    }
}))

module.exports = notifyRoute;