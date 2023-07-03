var express = require('express');
const session = require('express-session');
var router = express.Router();
const multer = require("multer")
const firebase = require("firebase/app")
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage")
const config = require("../configs/firebase.config")


firebase.initializeApp(config.firebaseConfig)

const storage = getStorage()

const uploadImgIntoFirebase = async (req, res, next) => {
    var storageRef = ref(storage, `files/${req.file.originalname}`)

    console.log(req.file);
    try {
        await uploadBytes(storageRef, req.file.buffer)
        const downloadURL = await getDownloadURL(storageRef);
        res.send(["file uploaded", downloadURL])
    } catch (error) {
        console.log(err);
        res.send("upload failed")
    }
}
module.exports = {
    uploadImgIntoFirebase,
}