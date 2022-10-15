const express = require("express")
const app = express()
const routes = require("./routes/route")

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.set("view engine", "ejs")

app.use("/", routes)


app.listen(3000, ()=>{
  console.log("server demmaré sur le port 3000")
})
