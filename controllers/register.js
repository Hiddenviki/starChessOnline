const express = require('express');
const router = express.Router();
const { response } = require('express')
const db = require('../routes/db-config') 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//регистрация с транзакцией комментарии пропали ну и ладно затто работает
router.post("/register", async (req, res) => {
  try {
      const { email, login, password1: Npassword1, password2: Npassword2 } = req.body;
      if (!email || !Npassword1 || !(Npassword1 == Npassword2) || !login) {
          return res.json({ status: "error", error: "Заполните все поля, либо проверьте правильность паролей" });
      } else {
          const [result] = await db.promise().execute('SELECT email FROM StartrackChessOnline.Authorization WHERE email = ?', [email]);
          if (result[0]) return res.json({ status: "error", error: "Пользователь с таким email уже зарегистрирован" });
          const [result2] = await db.promise().execute('SELECT login FROM StartrackChessOnline.Authorization WHERE login = ?', [login]);
          if (result2[0]) return res.json({ status: "error", error: "Пользователь с таким логином уже зарегистрирован" });
          const password = await bcrypt.hash(Npassword1, 8);
          const connection = await db.promise().getConnection();
          try {
              await connection.beginTransaction();
              const [result3] = await connection.execute('INSERT INTO StartrackChessOnline.Authorization (login, password, email) VALUES (?, ?, ?)', [ login, password, email]);
              const userId = result3.insertId; 
              await connection.execute('INSERT INTO StartrackChessOnline.Activity (login, id) VALUES (?, ?)', [ login, userId ]);
              await connection.execute('INSERT INTO StartrackChessOnline.Has_followers (id) VALUES (?)', [ userId]);
              await connection.execute('INSERT INTO StartrackChessOnline.Statistics (id, login) VALUES (?, ?)', [userId, login ]);
              await connection.execute('INSERT INTO StartrackChessOnline.Has_invitation (id) VALUES (?)', [userId]);
              await connection.commit();
              res.json({ status: "success", success: "Пользователь зарегистрирован!" });
          } catch (error) {
              await connection.rollback();
              console.error('Транзакция не удалась', error);
              res.json({ status: "error", error: "Внутренняя ошибка базы"});
          } finally {
              await connection.release();
          }
      }
  } catch (err) {
      console.log("что-то нетак с регистрацией")
      res.json({ status: "error", error: "Ошибка регистрации"});
  }
});

module.exports = router;