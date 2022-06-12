const express = require('express');
const asyncHandler = require('express-async-handler')
const notifyRoute = express.Router();
const sgMail= require('@sendgrid/mail')
const Apikey = process.env.Apikey;
sgMail.setApiKey(Apikey);
const URLorder= 'https://twbb-orders.vercel.app/api/orders/';
const axios = require('axios');
const URLinventory= 'https://twbb-inventory.vercel.app/api/product/';

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
        subject:'Update On Your Order ',
        html:`<html>
        <head>
        
        </head>
        <body>
            <img src="https://img.freepik.com/free-photo/thank-you-your-order-card_53876-110287.jpg?w=2000" alt="basket" width="300" height="150">
            <h3 style="color:#124831">Your order is ${status}</h3>
            <p style="color:black">Dear Customer,</p>
            <p style="color:black">Thank you for ordering. Your order was created, these are the products you ordered:</p>
            <br>${cart}<br>
            Total is:${t}<br>
               <pre> 
      <strong>Best regards,</strong>
      <strong>Rabbit team</strong> 
      <img src="https://play-lh.googleusercontent.com/kb9F5xdW_wcfHcT0nvOHZDYrCDOMS5RvGvrGVF2msm-sBcaUx--w9QgBoDpXLewoiZ8p" alt="logo" width="50" height="50">
            </pre>
        </body>
      </html>`

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
        html:`<html>
        <head>
        </head>
        <body>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkN2_q4SoA87YVGRcB3E8P5YuseYW9CSK2yQ&usqp=CAU" alt="image of rabbit" width="300" height="150">
            <h1 style="color:#124831">Welcome to Rabbit! </h1>
            <P style="color:black"> We are very happy to welcome a new member to the Rabbit family.</P>
            <p style="color:black">Enjoy your new way of shopping, and get your groceries in just 20 Minutes!</p>
            <p style="color:black">Click on button to verify:  </p>
            <button><a href=' https://twbb-users.vercel.app/api/users/verify?emailtoken=${emailToken}' alt='Broken Link'>Click to verify</a></button> 
            <pre> 
      <strong>Best regards,</strong>
      <strong>Rabbit team</strong>
      
            </pre>
        </body>
      </html>`

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