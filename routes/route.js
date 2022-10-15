const router = require("express").Router()
const {signIn, signUp, find} = require("../lib/functions")


router.get("/", (req, res)=>{
    res.render("index")
})

router.get('/signup', (req, res)=>{
  res.render("signup")
})

router.get('/login', (req, res)=>{
  res.render("login")
})

router.post("/signup", (req, res)=>{
  signUp(req.body)
  .then(data=>{
    console.log(data)
    res.json({ status: true, message: 'Inscription validée'})
  })
  .catch(e=>{
    console.log(e)
    res.json({status: false, error: e})
  })

})

router.post("/login_check", (req, res)=>{
  console.log(req.body)
  signIn(req.body)
  .then(user=>{
    res.json({status: true, data: user})
  })
  .catch(e=>{
    res.json({status: false, error: e})
  })
})

router.get("/index", (req, res)=>{
  find("conseils")
  .then(datas=>{
    res.render("conseils", {conseils: datas})
  })
})

router.post("/message/:senderId/:receiverId", (req, res)=>{
  console.log(req.body)
  res.send(req.params)
})

module.exports = router