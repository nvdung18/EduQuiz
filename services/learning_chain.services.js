const LearningChainModel = require("../model/learningchain.model")

const newMonthLearningChain = async (userID) => {
    try {
        let newMonth = new LearningChainModel({
            userID: userID,
            month_year: new Date,
            learnedDays: [new Date]
        })
        await newMonth.save()
    } catch (error) {
        throw error
    }
}

const getLatestLearningChain = async (userID) => {
    try {
        let { month, year } = getCurrentMonthAndYear()
        let latestLearningChain = await LearningChainModel.find({
            userID: userID,
            $expr: {
                $and: [
                    { $eq: [{ $month: '$month_year' }, month] },
                    { $eq: [{ $year: '$month_year' }, year] }
                ]
            },
        })
        return latestLearningChain[0]
    } catch (error) {
        throw error
    }
}
const newDayInLearningChain = async (userID) => {
    try {
        const latestLearningChain=await getLatestLearningChain(userID)
        let learnedDays=latestLearningChain.learnedDays
        learnedDays.push(new Date)
        
        latestLearningChain.learnedDays=learnedDays
        latestLearningChain.save()
    } catch (error) {
        throw error
    }
}

const getNowDateInLearningChain = async (userID) => {
    try {
        let { month, year,day } = getCurrentMonthAndYear()

        let currentDate = await LearningChainModel.find({
            userID: userID,
            learnedDays: {
                $gte: new Date(year, month - 1, day),
                $lt: new Date(year, month - 1, day + 1)
            }
        })

        return currentDate[0]
    } catch (error) {
        throw error
    }
}

const getCurrentMonthAndYear = () => {
    var dateObject = new Date();
    var month = dateObject.getMonth() + 1;
    var year = dateObject.getFullYear();
    var day = dateObject.getDate()
    return { month, year, day }
}

module.exports = {
    newMonthLearningChain,
    getLatestLearningChain,
    newDayInLearningChain,
    getNowDateInLearningChain,
}