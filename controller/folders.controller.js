var createError = require('http-errors')
const FolderServices=require("../services/folder.services")

const newFolder = async (req, res, next) => {
    try {
        let {titleFolder,descriptionFolder}=req.body
        let userID=res.get("Authorization")
        let folder={
            title:titleFolder,
            description:descriptionFolder,
            userID:userID
        }

        let isSuccess=await FolderServices.createFolder(folder)
        if(!isSuccess) throw createError.InternalServerError()
        
        res.redirect('back')
    } catch (error) {
        next(error)
    }
}

const getAllFolders=async (req,res,next)=>{
    try {
        let userID=res.get("Authorization")
        const allFolders=await FolderServices.getAllFoldersByUserID(userID)
        
        if(!allFolders) throw createError.InternalServerError()
        
        res.status(200).render("all_folder",{allFolders:allFolders})
    } catch (error) {
        next(error)
    }
}

module.exports={
    newFolder,
    getAllFolders,
}