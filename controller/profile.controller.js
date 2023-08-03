const UserServices=require("../services/user.services")
const learningChainServices=require("../services/learning_chain.services")

const getProfileUser=async(req,res,next)=>{
    try {
        let userID=res.get("Authorization")
        let profile=await UserServices.getProfileByUserID(userID)
        res.render("profile",{profile:profile})
    } catch (error) {
        
    }
}

const getLearningChainOfMonth=async(req,res,next)=>{
    try {
        let userID=res.get("Authorization")
        let {currYear,currMonth}=req.query
        
        let learningChain=await learningChainServices.getLearningChainOfMonth(userID,currMonth,currYear)
        console.log(learningChain);
        if(learningChain==undefined){
            learningChain=[]
            learningChain.learnedDays=[]
        }
        res.send(["ok",learningChain.learnedDays])
        res.send("ok")
    } catch (error) {
        
    }
}

module.exports={
    getProfileUser,
    getLearningChainOfMonth,
}