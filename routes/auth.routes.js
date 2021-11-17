const router = require('express').Router();
const UserModel = require('../models/User.model');
const bcrypt = require('bcryptjs');

router.get('/signin', (req, res, next) => {
    res.render('auth/signin.hbs')
})

router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs')
  })
  
  router.post('/signup', (req, res, next) => {
    const {username, password} = req.body

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    UserModel.create({username, password: hash})
    .then(() => {
        res.redirect('/')
    })
    .catch((err) => {
        next(err)
    })

  });

  router.post('/signin', (req, res, next) => {
    const {username, password} = req.body

    UserModel.find({username})
    .then((usernameResponse) => {
        if(usernameRespone.length){
            let userObj = usernameResponse[0]

            let isMatching = bcrypt.compareSync(password, userObj.password);
            if(isMatching){
                req.session.myProperty = userObj

                res.redirect('/profile')
            }
            else{
                res.render('auth/signin.hbs', {error: 'Password not matching'})
                return;
              }
          }
          else {
            res.render('auth/signin.hbs', {error: 'User email does not exist'})
            return;
          }
      })
      .catch((err) => {
        next(err)
      })
})

const checkLogIn = (req, res, next) => {
    if (req.session.myProperty) {
      //invokes the next available function
      next()
    } else {
      res.redirect('/signin')
    }
  };
  
  //CREATE /main ROUTE (PROTECTED AUTHENTICATION)
  router.get("/main", checkLogIn, (req, res, next) => {
    res.render("auth/main");
  });
  
  //CREATE /private ROUTE (PROTECTED AUTHENTICATION)
  router.get("/private", checkLogIn, (req, res, next) => {
    let myUserInfo = req.session.myProperty;
    res.render("auth/private", {
      name: myUserInfo.username
    });
  });
  
  //LOGOUT ROUTE
  router.get("/logout", (req, res, next) => {
    req.session.destroy()
    res.redirect("/signin")
  });
  
  module.exports = router;


module.exports = router;