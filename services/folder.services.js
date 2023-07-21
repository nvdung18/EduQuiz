const FolderModel = require("../model/folder.model")

const createFolder = async (folder) => {
    const newFolder = new FolderModel(folder)
    return await newFolder.save()
}

const getAllFoldersByUserID = async (userID) => {
    return await FolderModel.find({ userID: userID })
}


module.exports = {
    createFolder,
    getAllFoldersByUserID,
}