const express = require('express');
const db = require("./routes/db-config")
const app = express();
const PORT = process.env.PORT || 3001;
const cookie = require("cookie-parser");
app.use("/js", express.static(__dirname + "/js", { "Content-Type": "application/javascript" }));
app.use("/css",express.static(__dirname + "/css"));
app.set("views","./views");
app.set("view engine", "ejs");
app.use(cookie());
app.use(express.json());


db.getConnection(function(err, connection) {
    if (err) throw err;

    // проверка соединения с базой данных
  connection.ping(function (err) {
    if (err) {
      console.error('Ошибка соединения с базой данных: ' + err.stack);
    } else {
      console.log('Соединение с базой данных установлено');
      
    }

    // освобождение соединения
    connection.release();
  });
});

app.use("/", require("./routes/pages"));
app.use("/api", require("./controllers/login"));


app.listen(PORT); 
