
const { db, storage, rtdb, auth } = require("./configs")
const { ref, uploadBytes,getDownloadURL } = require("firebase/storage")
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, onAuthStateChanged,signOut, updateProfile, sendPasswordResetEmail } = require("firebase/auth")
const { collection, doc, addDoc, getDoc, getDocs, where, query, deleteDoc, setDoc, updateDoc, orderBy, serverTimestamp: sT} = require("firebase/firestore")
const { set, ref: dbref, remove, get } = require("firebase/database")
const { uuidv4 } = require("@firebase/util")

/**********CONST VARIABLES********************/
const users = collection(db, "users")
const datas = collection(db, "datas")

Object.filter = (obj, predicate) => 
Object.keys(obj)
      .filter( key => predicate(obj[key]) )
      .reduce( (res, key) => (res[key] = obj[key], res), {}
);

/*************FUNCTIONS*********************/
const findOne = (col="", id="")=>{
    return new Promise(async (resolve, reject)=>{
        const docRef = doc(db, col, id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()){
            let found = docSnap.data()
            found.id = docSnap.id
            resolve(found)
            return
        }
        reject("notFound")
    })
}

const find = (col, order=false)=>{
    return new Promise(async (resolve)=>{
        const result = []
        let qs = null
        if (!order){
            qs = await getDocs(collection(db, col))
        } else{
            qs = await getDocs(query(collection(db, col), orderBy(order)))
        }
        qs.docs.map((doc) => {
            let toPush = doc.data()
            toPush.id = doc.id
            result.push(toPush)
        })
        resolve(result)
    })
}

const saveOne = (col="", d)=>{
    return new Promise(async (resolve)=>{

      const q = await addDoc(collection(db, col), d)
      d.id = q.id
      resolve(d)
    })
}
const setOne = async (col="", data={}, id='', first=false)=>{
    data.id = id
    first ? data.registratedAt = sT() : ''
    await setDoc(doc(db, col, id), data)
}

const save = async (col="", docs=[])=>{
    docs.map(async (doc) =>{
        await addDoc(collection(db, col), doc)
    })
}

const override = async (col="", id="", news={})=>{
	await setDoc(doc(db, col, id), news)
}


const deleteOne = async (col="", id="")=>{
    await deleteDoc(doc(db, col, id))
}

const updateOne = async(col="", id="", ...args)=>{
	await updateDoc(doc(db, col, id), ...args)
}

const signUp = async (form)=>{
    return new Promise((resolve, reject)=>{
      const q = query(collection(db, "users"), where("email", "==", form.email))
      getDocs(q)
      .then(snap=>{
        if (snap.docs.length){
          reject('Utilisateur existe deja')
        }else{
          saveOne("users", form)
          .then(()=>{resolve(form)})
          .catch(e => reject(e.code ? e?.code : e?.message))
        }
      })
    })
}

const signIn = async (form)=>{
    return new Promise((resolve, reject)=>{
      const q = query(collection(db, "users"), where("email", "==", form.email), where("password", "==", form.password))
      getDocs(q)
      .then(snap=>{
        snap.docs.length
          ? resolve(snap.docs[0].data())
          : reject('Utilisateur non trouvé')
      })
    })
}

const setData = (info, receiver, message)=>{
    const banned = ['email', 'password', 'birth']
    const inter = {}
    if (message){
      inter.lastMessage = {
          senderId: message.senderId,
          date: new Date(message.timestamp).toLocaleString().split(" ")[1].slice(0, 5),
          message: message.message
      }
    }
    for (const [k, v] of Object.entries(info)){
      banned.includes(k) ? '' : inter[k] = v
    }
    set(receiver, inter)
}

const useRightRef = (path, from, to, id)=>{
    return [dbref(rtdb, `${path}/${from}/${to}/${id}`), dbref(rtdb, `${path}/${to}/${from}/${id}`)]
}

const sendMessage = async (senderId, receiverId, message)=>{
    return new Promise((resolve, reject)=>{
        const id = uuidv4()
        const [senderRef, receiverRef] = useRightRef("messages", senderId, receiverId, id)
        const [senderInfoRef, receiverInfoRef] = useRightRef("messages", receiverId, senderId, "info")
        message.id = id
        message.senderId = senderId
        message.timestamp = Date.now()
        set(senderRef, message) // save message to sender collection
        set(receiverRef, message) // save message to receiver collection
        findOne("users", receiverId) // find receiver user info
        .then(receiverInfo=> {
            setData(receiverInfo, receiverInfoRef, message) // save receiver information to sender
        })
        .catch(e=>reject(e.message))
        findOne("users", senderId) // find sender user info
        .then(senderInfo=>{
            setData(senderInfo, senderInfoRef, message) // save sender information to reciver
            resolve(message)
        })
        .catch(e=>reject(e.message))
    })
}

const deleteMessage = (senderId, receiverId, id)=>{
    return new Promise((resolve, reject)=>{
        const [senderRef, receiverRef] = useRightRef("messages", senderId, receiverId, id)
        remove(senderRef)
        .then(()=>{
            remove(receiverRef)
            resolve()
        })
        .catch(e=>reject(e?.message))
    })
}

const uploadImage = (path, file)=>{
    return new Promise(async (resolve, reject)=>{
        const Imagesref = ref(storage, path)
        await uploadBytes(Imagesref, file).then((snapshot) => {
            getDownloadURL(snapshot.ref)
            .then(url=>resolve(url))
          }).catch(e=>reject(e.message))
    }).catch(e=>reject(e.message))
}


module.exports = {
  findOne,
  find,
  saveOne,
  updateOne,
  setOne,
  signIn,
  signUp,
  sendMessage,
  deleteMessage,
  uploadImage,
  deleteOne,
}