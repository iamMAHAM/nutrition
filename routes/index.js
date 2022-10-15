const router = require("express").Router()
const {query, where, collection, getDocs} = require("firebase/firestore")
const { db } = require("../lib/firebaseConfig")
const { getAll, saveDoc, } = require("../lib/firestoreLib")
router.get("/", (req, res)=>{
    res.render("index")
})

router.get("/jobs", async(req, res)=>{
  console.log(req.params)
  getAll("jobs/VRkvZyTfyd7a0VbfAPsz/toulouse", (jobs)=>{
      res.render("jobs", {jobs: jobs})
  })
})

router.get("/in", (req, res)=>{
    res.render("in")
})

router.get("/con", (req, res)=>{
    res.render("con")
})

router.post("/inscrip", (req, res)=>{
    console.log(req.body)
    saveDoc("users", req.body)
    res.send(JSON.stringify({status: 'ok', message: "success"}))

})

router.post("/connex", (req, res)=>{
  console.log(req.body)
  const q = query(collection(db, "users"), where("email", "==", req.body.email), where("password", "==", req.body.password))
  getDocs(q).then(snap=>{
    if (snap.docs.length){//docuement exists
        res.send(JSON.stringify({status: "ok", message: "connexion avec succes"}))
    }else{
        res.send(JSON.stringify({status: "false", message: "utilisateur non trouvé"}))
    }
  })


})
module.exports = router