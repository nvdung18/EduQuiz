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
        const latestLearningChain = await getLatestLearningChain(userID)
        let learnedDays = latestLearningChain.learnedDays
        learnedDays.push(new Date)

        latestLearningChain.learnedDays = learnedDays
        latestLearningChain.save()
    } catch (error) {
        throw error
    }
}

const getNowDateInLearningChain = async (userID) => {
    try {
        let { month, year, day } = getCurrentMonthAndYear()

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

function getWeekDays() {
    try {
        const today = new Date();
        const dayOfWeek = today.getDay(); // Lấy thứ của ngày hiện tại (Chủ Nhật = 0, Thứ 2 = 1, ..., Thứ 7 = 6)
        const startDate = new Date(today); // Sao chép ngày hiện tại để tính ngày bắt đầu của tuần
        startDate.setDate(today.getDate() - dayOfWeek); // Lùi lại đến Chủ Nhật của tuần hiện tại

        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            weekDays.push(date);
        }
        return weekDays;
    } catch (error) {
        throw error
    }
}

const getLearningChainOfWeek = async (weekDays, userID) => {
    try {
        let learningChain = []
        for (let i = 0; i < weekDays.length; i++) {
            let { month, year, day } = await getYearMonthDayByDate(weekDays[i])
            let learning = []
            learning = await LearningChainModel.find({
                userID: userID,
                learnedDays: {
                    $elemMatch: {
                        $gte: new Date(year, month - 1, day),
                        $lt: new Date(year, month - 1, day + 1)
                    }
                }
            })

            if (learning.length > 0) {
                learningChain.push({
                    year: year,
                    month: month,
                    day: day,
                    isLearning: true
                })
            } else {
                learningChain.push({
                    year: year,
                    month: month,
                    day: day,
                    isLearning: false
                })
            }
        }

        return learningChain
    } catch (error) {
        throw error
    }
}

const getYearMonthDayByDate = async (date) => {
    try {
        var dateObject = new Date(date);
        var day = dateObject.getDate();
        var month = dateObject.getMonth() + 1;
        var year = dateObject.getFullYear();
        return { month, year, day }
    } catch (error) {
        throw error
    }
}

module.exports = {
    newMonthLearningChain,
    getLatestLearningChain,
    newDayInLearningChain,
    getNowDateInLearningChain,
    getWeekDays,
    getLearningChainOfWeek,
}