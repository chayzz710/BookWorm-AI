const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const UserdetailsModel = require("./models/Userdetails.js")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/userdetails");

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserdetailsModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("Success")
                } else {
                    res.json("Password is incorrect")
                }
            } else {
                res.json("No record existing")
            }
        })
})

app.post('/register', (req, res) => {
    try {
        UserdetailsModel.create(req.body)
            .then(Userdetails => res.json(users))
            .catch(err => res.json(err))
    } catch (err) {
        res.status(500).json({ error: "Registration failed", details: err.message });
    }
})

app.listen(5000, () => {
    console.log("Server is running")
})