const express= require('express');
const dotenv= require("dotenv");
const app = express();
dotenv.config();
const notifyRoutes= require('./routes/notifyRoutes')
const cors = require('cors')

app.use(cors({origin: true, credentials: true}));
app.use(express.json());

app.use('/api/notify',notifyRoutes)

const PORT = process.env.PORT||4000;

app.listen(PORT,(req , res)=>{
    console.log(`Server is Up and Running ${PORT}`);
});






