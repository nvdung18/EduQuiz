const setLocalUserInfor = async (req, res, next) => {
    try {
        res.locals.userID=res.get("Authorization")
        res.locals.userInfor = req.params.userinfo
        next()
    } catch (error) {
        next(error);
    }
};

module.exports={
    setLocalUserInfor,
}