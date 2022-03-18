function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/main')
    }
    return next()
}

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    return res.redirect('/signup')
}

 module.exports = {checkNotAuthenticated,checkAuthenticated}