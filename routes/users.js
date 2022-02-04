const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/login", async function (req, res, next) {
  const { name, password } = req.body;
  const user = await User.findOne({ name });
  if (!user) {
    return res.status(400).json({ message: `${name} не найден` });
  }
  const isPassVal = bcrypt.compareSync(password, user.password);
  if (!isPassVal) {
    return res.status(400).json({ message: `Неправильный пароль` });
  }
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
    },
  });
});

router.post( "/register", [
    check("name", "Поле не должен быть пустым!").notEmpty(),
    check("password", "Пароль должон быть меньше 3 и болше 12").isLength({ min: 3, max: 12}),
  ],
  async function (req, res, next) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
          return res.status(400).json({message: `Некоректный запрос`, errors})
      }
      const { name, password } = req.body;
      console.log(name, password);
      const userCondid = await User.findOne({ name });
      if (userCondid) {
        return res.status(400).json({ message: `Пользователь с таким ${name} уже существует` });
      }
      const hassPassword = await bcrypt.hash(password, 8);
      const user = await new User({ name, password: hassPassword });
      const newUser = await user.save();
      if (newUser) {
        return res.json({ message: "Пользователь был создан" });
      } else {
        return res.json({ message: "Ошибка гдето!" });
      }
    } catch (err) {
      res.send({ message: "Ошибка Сервера" });
    }
  }
);

module.exports = router;
