
import express from "express";
import fs from "fs"
import cors from "cors"
import nodemailer from "nodemailer"
import cron from "node-cron"

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: false }))

let flag = false;
const notifyUser = async () => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port : 465,
        secure: true,
        auth: {
            user: "gaurangtyagi7@gmail.com",
            pass : "rqhhxyfravzryhtb"
        }
    })
    const info = await transporter.sendMail({
        from: "gaurangtyagi7@gmail.com",
        to: "gaurangtyagi7@gmail.com",
        subject: "Reminder",
        html : "<h1>Need to buy medicines<h1>"
    })
    return info;
}

app.get("/", (req, res) => {
    let data = fs.readFileSync("shops.json",{encoding:"utf-8"})
    data = JSON.parse(data)
    let temp = Array()
    data.forEach(ele => {
        temp.push(ele.Medicines)
    })
    res.header({ 'content-type': "application/json" })
    res.status(200).json(temp)
})
app.post("/getList", (req, res) => {
    let { d,days } = req.body
    d= d.split(",")
    const calc = (ammountLeft) => {
        let data = fs.readFileSync("shops.json",{encoding:"utf-8"})
        data = JSON.parse(data)
        let daysLeft = []
        let iter = 0;
        data.forEach((shops) => {
            const { Medicines } = shops
            Medicines.forEach((med, index) => {
                const {perPack,perDay,Price} = med
                let left = (Math.round(days - (parseInt(ammountLeft[iter++]) / perDay)))
                let needed = left * perDay
                needed = Math.ceil(needed / perPack)
                let name = Object.keys(med)[0]
                daysLeft.push({name,needed,price:needed*parseInt(Price)})
            })
        })
        flag = true;
        return daysLeft
    }
    const result = calc(d)
    res.json(result)
})

app.listen(5000);

cron.schedule("0 0 */1 * *", () => {
    if (flag) {
        let msg = notifyUser();
        console.log(msg.messageId)
        flag = false;
    }
    
})