const yup = require("yup");
var express = require('express');
const UserService = require('../../services/users/UserService.js');
const AccessTokenService = require('../../services/authentication/AccessTokenService.js');
const SecurityService = require('../../services/utils/SecurityService.js');
const AccessToken = require('../../models/authentication/AccessToken.js');
const { getNextDateTimeByHour } = require('../../helpers/datetime.js');
const { authMiddleware } = require('../../middlewares/authMiddleware.js');
var router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sha256 = require('crypto-js/sha256');
const { verifyJWT } = require('../../helpers/auth.js');

router.post('/register', async function (req, res, next) {
  try {
    const userService = new UserService();
    const registerSchemaValidation = yup.object({
      firstName: yup.string().required().min(3),
      lastName: yup.string().required().min(3),
      email: yup.string().required().email().test('unique email', 'email already registered', async value => {
        const user = await userService.where({ email: value });
        return !user;
      }),
      password: yup.string().required().min(8),
    });
    registerSchemaValidation.validate(req.body).then(async () => {
      const salt = bcrypt.genSaltSync(parseInt(process.env.PASSWORD_SALT));
      const user = await userService.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, salt),
      });
      if (!user) {
        return res.status(400).json({
          "message": "Error in register , Try again later",
        });
      }
      const token = await userService.generateToken(user._id, {
        auth: user._id,
      });
      await new AccessTokenService().create({
        userId: user._id,
        token: sha256(token).toString(),
        expiresAt: getNextDateTimeByHour(parseInt(process.env.TOKEN_EXPIRE_TIME_IN_HOUR)),
      });
      return res.json({
        "message": "User created successfully",
        "user": user,
        "token": token,
      });
    }).catch((err) => {
      return res.status(400).json({
        "message": "Validation error",
        "errors": err
      });
    });
  } catch (error) {
    return res.status(500).json({
      "message": "Server error",
    });
  }
});

router.post('/login', async function (req, res, next) {
  try {
    const userService = new UserService();
    const loginSchemaValidation = yup.object({
      email: yup.string().required().email(),
      password: yup.string().required(),
    });

    loginSchemaValidation.validate(req.body).then(async () => {
      const email = req.body.email;
      const password = req.body.password;

      const user = await userService.where({ email });

      if (!user) {
        return res.status(404).json({
          "message": "Not fond"
        });
      }

      const passwordCorrect = new SecurityService().comparePassword(password, user.password);

      if (passwordCorrect) {
        const token = await userService.generateToken(user._id, {
          auth: user._id,
        });
        await new AccessTokenService().create({
          userId: user._id,
          token: sha256(token).toString(),
          expiresAt: getNextDateTimeByHour(parseInt(process.env.TOKEN_EXPIRE_TIME_IN_HOUR)),
        });
        return res.json({
          "message": "Login was successful",
          "token": token,
          "user": user
        });
      }
      else {
        return res.status(403).json({
          "message": "Email or password is incorrect"
        });
      }
    }).catch((err) => {
      return res.status(400).json({
        "message": "Validation error",
        "errors": err
      });
    });
  } catch (error) {
    return res.status(500).json({
      "message": "Server error",
    });
  }

});

router.get('/me', authMiddleware, async function (req, res, next) {
  try {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    token = token.includes('Bearer ') ? token.replace('Bearer ', '') : token;
    const jwtVerify = await verifyJWT(token);
    return res.json({
      'data': jwtVerify?.user
    });
  } catch (error) {
    return res.status(500).json({
      "message": "Server error",
    });
  }
});

module.exports = router;
