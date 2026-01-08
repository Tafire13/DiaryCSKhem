const User = require('../models/Users')

exports.getPageLogin = (req, res) => {
    res.render('login')
}

exports.postLogin = (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.render('login')
    }

    User.FindByUsername(username, (user) => {
        if (user) {
            LoggedIn(req, res, user)
        } else {
            User.createUser(username, 0, (success) => {
                if (success) {
                    User.FindByUsername(username, (newUser) => {
                        LoggedIn(req, res, newUser)
                    })
                } else {
                    res.render('login')
                }
            })
        }
    })
}

const LoggedIn = (req, res, user) => {
    req.session.isLoggedIn = true
    req.session.user = {
        uid: user.uid,
        username: user.username,
        role: user.role
    }

    req.session.save(() => {
        res.redirect('/')
    })
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};