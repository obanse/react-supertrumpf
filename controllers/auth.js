const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Users = require('../models/user');

exports.getUser = (req, res) => {
  console.log(req.params)
  Users.findById(req.params.id)
    .then(user => {
      if (user)
        res.status(200).json(user);
      else
        res.status(404).json({ message: 'User not found!' })
    })
    .catch(() => {
      res.status(500).json({
        message: 'Fetching user failed!'
      });
    });
};

exports.registerUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const isHitUser = !!(req.body.hitbnr && req.body.hitmbn && req.body.hitpass);
      const user = new Users({
        u_email: req.body.email,
        u_pass: hash,
        hit_bnr: req.body.hitbnr,
        hit_mbn: req.body.hitmbn,
        hit_pass: req.body.hitpass,
        isHitUser: isHitUser,
        isEnabled: false
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: 'Invalid authentication credentials! --> ' + err.toString()
          });
        });
    });
}

exports.loginUser = (req, res) => {
  let fetchedUser;
  Users.findOne({ u_email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed!' });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.u_pass);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({ message: 'Authentication failed!' })
      }
      const token = jwt.sign(
        { email: fetchedUser.u_email, userId: fetchedUser._id },
        process.env.JWT_SECRET_SALT,
        { expiresIn: "8h" }
      );
      console.log(token);
      res.status(200).json({ token: token, expiresIn: 3600, userId: fetchedUser._id, isHitUser: fetchedUser.isHitUser });
    })
    .catch(() => {
      res.status(401).json({
        message: 'Invalid authentication credentials!'
      });
    });
}

exports.updateUser = (req, res) => {
  const isHitUser = !!(req.body.hitbnr && req.body.hitmbn && req.body.hitpass);
  const user = new Users({
    _id: req.params.id,
    u_email: req.body.email,
    hit_bnr: req.body.hitbnr,
    hit_mbn: req.body.hitmbn,
    hit_pass: req.body.hitpass,
    isHitUser: isHitUser
  });
  Users.updateOne({ _id: req.params.id }, user)
    .then(result => {
      if (result.n > 0 && result.nModified > 0) {
        res.status(200).json({ message: 'Update successful!' });
      } else if (result.n > 0 && result.nModified === 0) {
        res.status(200).json({ message: 'Nothing changed!' });
      } else {
        res.status(401).json({ message: 'Not authorized!' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Couldn't update user data!" });
    });
}
