import express,{Application, Request, Response} from 'express'
import * as dotenv from 'dotenv'
import './database/connection'


const app:Application = express()
const PORT:number = 3000
dotenv.config()
app.use(express.json())  


import userRoute from './routes/userRoute'


app.use("/",userRoute)







app.get("/",(req:Request,res:Response)=>{
    res.send("hello world")
})

app.listen(PORT,()=>{
    console.log("server has started at port ", PORT)
})
