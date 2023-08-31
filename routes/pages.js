 
const express = require('express');
const router = express.Router()

const jwt = require("jsonwebtoken");
const db = require('../routes/db-config') 

const mime = require("mime");


router.get("/", (req, res) => {
    res.render("index.ejs")
})

router.get("/register", (req, res) => {
    res.render("register.ejs")
})


router.get("/login", (req, res) => { 
    res.render("login.ejs")
})

router.get("/account", (req, res) => {
    res.render("account.ejs")
})


router.get("/create_game", (req, res) => {
    res.render("create_game.ejs")
})


router.get("/stars", (req, res) => {
    res.sendFile("img/stars.jpeg", { root: "./" }); 
})

router.get("/rules", (req, res) => {
    res.sendFile("rules.html", { root: "./" }); 
})



/////штуки для загрузки стилей у игры
router.get("/styleGame", (req, res) => {
  res.sendFile("TemplateData/style.css", { root: "./" }); 
})

router.get("/favicon", (req, res) => {
  res.sendFile("TemplateData/favicon.ico", { root: "./" }); 
})

router.get("/BuildStuffData", (req, res) => {
  res.set({
    'Content-Type': 'application/gzip',
    'Content-Encoding': 'gzip'
  });
  res.sendFile("Build/Buildv2.data.gz", { root: "./", dotfiles: "allow" }); 
});


router.get("/BuildStuffWasm", (req, res) => {
  res.setHeader("Content-Type", mime.getType("wasm"));
  res.setHeader("Content-Encoding", "gzip");
  res.sendFile("Build/Buildv2.wasm.gz", { root: "./", dotfiles: "allow" });
});

router.get("/favicon", (req, res) => {
  res.sendFile("TemplateData/favicon.ico", { root: "./" }); 
})
 ///////////////////////тут
router.get("/unity-logo-dark.png", (req, res) => {
  res.sendFile("TemplateData/unity-logo-dark.png", { root: "./" }); 
})

router.get("/progress-bar-empty-dark.png", (req, res) => {
  res.sendFile("TemplateData/progress-bar-empty-dark.png", { root: "./" }); 
})

router.get("/progress-bar-full-dark.png", (req, res) => {
  res.sendFile("TemplateData/progress-bar-full-dark.png", { root: "./" }); 
})

router.get("/webgl-logo.png", (req, res) => {
  res.sendFile("TemplateData/webgl-logo.png", { root: "./" }); 
})

router.get("/fullscreen-button.png", (req, res) => {
  res.sendFile("TemplateData/fullscreen-button.png", { root: "./" }); 
})


//оп оп
router.get("/BuildStuffFramework", (req, res) => {

  // res.setHeader("Content-Type", mime.getType("wasm")); // итак работает
  //тут только что поменяла
  res.setHeader("Content-Type", "application/javascript"); //и так почему-то тоже работает
  res.setHeader("Content-Encoding", "gzip");

  res.sendFile("Build/Buildv2.framework.js.gz", { root: "./", dotfiles: "allow" }); 
});

router.get("/BuildStuffLoader", (req, res) => {
  res.setHeader("Content-Type", mime.getType("wasm"));
  // res.setHeader("Content-Encoding", "gzip");
  res.sendFile("Build/Buildv2.loader.js", { root: "./", dotfiles: "allow" });
})








//////////для черных и белых теперь////////////


//белые

//епределала
router.get("/WhiteData", (req, res) => {
  res.set({
    'Content-Type': 'application/gzip',
    'Content-Encoding': 'gzip'
  });
  res.sendFile("White/Build/White.data.gz", { root: "./", dotfiles: "allow" }); 
});

//переделала
router.get("/WhiteWasm", (req, res) => {
  res.setHeader("Content-Type", mime.getType("wasm"));
  res.setHeader("Content-Encoding", "gzip");
  res.sendFile("White/Build/White.wasm.gz", { root: "./", dotfiles: "allow" });
});

//переделала
router.get("/WhiteFramework", (req, res) => {
  //тут только что поменяла
  res.setHeader("Content-Type", "application/javascript"); //и так почему-то тоже работает
  res.setHeader("Content-Encoding", "gzip");

  res.sendFile("White/Build/White.framework.js.gz", { root: "./", dotfiles: "allow" }); 
});
//переделала
router.get("/WhiteLoader", (req, res) => {
  res.setHeader("Content-Type", mime.getType("wasm"));
  // res.setHeader("Content-Encoding", "gzip");
  res.sendFile("White/Build/White.loader.js", { root: "./", dotfiles: "allow" });
})


///черные

//епределала
router.get("/BlackData", (req, res) => {
  res.set({
    'Content-Type': 'application/gzip',
    'Content-Encoding': 'gzip'
  });
  res.sendFile("Black/Build/Black.data.gz", { root: "./", dotfiles: "allow" }); 
});

//переделала
router.get("/BlackWasm", (req, res) => {
  res.setHeader("Content-Type", mime.getType("wasm"));
  res.setHeader("Content-Encoding", "gzip");
  res.sendFile("Black/Build/Black.wasm.gz", { root: "./", dotfiles: "allow" });
});

//переделала
router.get("/BlackFramework", (req, res) => {
  //тут только что поменяла
  res.setHeader("Content-Type", "application/javascript"); //и так почему-то тоже работает
  res.setHeader("Content-Encoding", "gzip");

  res.sendFile("Black/Build/Black.framework.js.gz", { root: "./", dotfiles: "allow" }); 
});
//переделала
router.get("/BlackLoader", (req, res) => {
  res.setHeader("Content-Type", mime.getType("wasm"));
  // res.setHeader("Content-Encoding", "gzip");
  res.sendFile("Black/Build/Black.loader.js", { root: "./", dotfiles: "allow" });
})











//здесь берем никнейм пользователя по айди
//исправлено
router.get('/userLogin', async (req, res) => {
    try {

      const token = req.cookies.userRegistered;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      
      const [rows1] = await db.promise().query('SELECT * FROM StartrackChessOnline.Authorization WHERE id = ?', [userId]);
      const user = rows1[0];

      res.json({ name: user.login, score: user.score }); // здесь возвращается имя пользователя
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Неверный токен' });
    }
});

//здесь берем очки пользователя по айди
//исправлено
router.get('/userScore', async (req, res) => {
    try {
      const token = req.cookies.userRegistered;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      
      const [rows1] = await db.promise().query('SELECT score FROM StartrackChessOnline.Statistics WHERE id = ?', [userId]);
      const user = rows1[0];

      res.json({ score: user.score }); 
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Неверный токен' });
    }
});

//функция которая ищет друзей по айди пользователя
async function getFriendsData(userId) {
  const friendDataArray = [];

  try {
    const [friendIds] = await db.promise().query('SELECT my_friend_id FROM StartrackChessOnline.Friends WHERE my_id = ?', [userId]);

    if (friendIds.length !== 0) {
      for (let i = 0; i < friendIds.length; i++) {
        const [friendData] = await db.promise().query('SELECT login, active FROM StartrackChessOnline.Activity WHERE id = ?', [friendIds[i].my_friend_id]);
        friendDataArray.push(friendData);
      }
    }

    return friendDataArray;
  } catch (error) {
    console.error(error);
    throw new Error('Не удалось получить данные друзей');
  }
}

//уфнкция которая ищет друзей пользователя по его айди
async function getFriendsData(userId) {
  try {
    const [friendIds] = await db.promise().query('SELECT my_friend_id FROM StartrackChessOnline.Friends WHERE my_id = ?', [userId]);

    const friendIdsArray = friendIds.map(friend => friend.my_friend_id);
    
    if (friendIdsArray.length === 0) {
      return [];
    }
    
    const [friendDataArray] = await db.promise().query('SELECT login, active FROM StartrackChessOnline.Activity WHERE id IN (?)', [friendIdsArray]);

    return friendDataArray;
  } catch (error) {
    console.error(error);
    throw new Error('Не удалось получить данные друзей');
  }
}

//уфнкция которая ищет логин пользователя по его айди
async function getLoginData(userId) {
    try {
        const [login] = await db.promise().query('SELECT login FROM StartrackChessOnline.Authorization WHERE id = ?', [userId]);
        return login[0].login;
    } catch (error) {
        console.error(error);
        throw new Error('Не удалось получить данные польщователя');
    }
}

//уфнкция которая ищет айди пользователя по его логину
function getIdData(userLogin) {
  try {

    const [id1] = db.promise().query('SELECT id FROM StartrackChessOnline.Authorization WHERE login = ?', [userLogin]);
    console.log("Что в id1: " + JSON.stringify(id1));
    console.log("Что в id1[0].id: " + JSON.stringify(id1[0].id));
      // const query = 'SELECT id FROM StartrackChessOnline.Authorization WHERE login = ?';
      // console.log(`Выполняется запрос: ${query} с параметрами ${[userLogin]}`);
      // const [id1] = await db.promise().query(query, [userLogin]);
    return id1[0].id;
  } catch (error) {
    console.error(error);
    throw new Error('Не удалось получить данные польщователя');
  }
}

//отправка заявки в друзья
router.get('/followFriend/:userLogin', async (req, res) => {
  const userLogin= req.params.userLogin;
  
  const token = req.cookies.userRegistered;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id; //наш айди
  const connection = await db.promise().getConnection();

  try {

    console.log("elfkz. "+userLogin);
      await connection.beginTransaction();
      //сначала ищем айдишник этого человечка в базе
      const [rows1] = await db.promise().query('SELECT id FROM StartrackChessOnline.Authorization WHERE login = ?', [userLogin]);
      const friendID = rows1[0];
      // console.log("айди и имя нового друга  "+ friendID.id +  newFriendName);

      //теперь добавляем наc в подписчики  друга
      // connection.query('UPDATE StartrackChessOnline.Friends SET my_friend_id = ? WHERE my_id = ?', [friendID.id, userId]);
      await connection.execute('UPDATE StartrackChessOnline.Has_followers SET has_followers = 1 WHERE id = ?', [friendID.id]);
      //а потом в подробную таблицу заявок
      // connection.query('UPDATE StartrackChessOnline.Friends SET my_friend_id = ? WHERE my_id = ?', [userId,friendID.id]);
      await connection.execute('INSERT INTO StartrackChessOnline.Follow_data (id_from, id_to) VALUES (?, ?)', [userId, friendID.id]);

      // console.log("Теперь вы и "+ newFriendName+ " друзья!");

      await connection.commit();
      res.json({ status: "success", success: "Отправили заявку в друзья!"});
      
  } catch (error) {
    console.error(error);
    await connection.rollback();
    console.error('Транзакция не удалась, заявка не отправлена', error);
    res.json({ status: "error", error: "Внутренняя ошибка работы базы"});
  }finally {
      //закрываем соединение транзакции
      await connection.release();
  }
});

//фнкция которая поисковик
router.get('/findUser/:searchInput', async (req, res) => {
  const searchInput = req.params.searchInput;
  
  const token = req.cookies.userRegistered;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    // Получаем список друзей пользователя
    const friendsArray = await getFriendsData(userId);
    let userLogin = await getLoginData(userId);
  
    // Получаем список пользователей, удовлетворяющих поисковому запросу
    const [users] = await db.promise().query('SELECT login, active FROM StartrackChessOnline.Activity WHERE login LIKE ?', [`%${searchInput}%`]);
  
    // Фильтруем пользователей, удаляя тех, кто уже является другом пользователя лии является самим пользователем(типачтоб не искать самих себя)
    const filteredUsers = users.filter(user => {
      const isFriend = friendsArray.some(friend => (friend.login === user.login || user.login===userLogin));
      return !isFriend;
    });

    res.json({ users: filteredUsers });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Не нашев и что-то сломав' });
  }
});



//здесь ищем топ 3 игрока
router.get('/top3', async (req, res) => {
    let topDataArray = [];
    try 
    {

    //выбираю 3 айди у кого самые большие очки в игре(больше побед)
        const [rows1] = await db.promise().query('SELECT id, login, score FROM StartrackChessOnline.Statistics ORDER BY score DESC LIMIT 3');
        for(let i = 0; i < rows1.length; i++){
            topDataArray.push(rows1[i]);
        }
        // console.log("Что в topDataArray: " + JSON.stringify(topDataArray));
        // console.log("Что в rows1: " + JSON.stringify(rows1));
         
        //в респонс кладем массив с данными пользователей
        res.json({ rows1: topDataArray }); 

    } catch (error) 
    {
        console.error(error);
        res.status(401).json({ error: 'что-то с топ 3' });
    }
});

router.get('/online', async (req, res) => {
    try {

        const token = req.cookies.userRegistered;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        db.query('UPDATE StartrackChessOnline.Activity SET active = 1 WHERE id = ?', [userId]);
        console.log("Пользователь теперь онлайн!");

    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Что-то не срослось с онлайном' });
    }
});
  
router.get('/offline', async (req, res) => {
    try {

        const token = req.cookies.userRegistered;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        db.query('UPDATE StartrackChessOnline.Activity SET active = 0 WHERE id = ?', [userId]);
        console.log("Пользователь больше НЕ онлайн");

    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Что-то не срослось с офлайном' });
    }
});

//ищем друзей, которые уже добавлены
router.get('/getFriends', async (req, res) => {
    let friendDataArray = [];
    try {
        
        const token = req.cookies.userRegistered;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
    
        const [friendIds] = await db.promise().query('SELECT my_friend_id FROM StartrackChessOnline.Friends WHERE my_id = ?', [userId]);
        if(friendIds.length !== 0){
            //console.log("У юзера есть друзья")
            // console.log("Что в friendIds: " + JSON.stringify(friendIds));
            // console.log("Что в friendIds[0]?: " + JSON.stringify(friendIds[0]));

            //заполняю массив данными друзей по их айди
            for(let i = 0; i < friendIds.length; i++){
                const [friendData] = await db.promise().query('SELECT login, active FROM StartrackChessOnline.Activity WHERE id = ?', [friendIds[i].my_friend_id]);
                friendDataArray.push(friendData);
            }

            // console.log("Что в friendDataArray: " + JSON.stringify(friendDataArray));
 
            //в респонс кладем массив с данными пользователей
            res.json({ friend_data: friendDataArray }); 
        }
        else{
            console.log("У юзера пока что нет друзей(");
            res.json({ friend_data: friendDataArray }); 
        }
      
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'какая-то ошибка с друзьями' });
    }
});


//что-то типа bool но возвращает 1 если есть заявки в друзья и 0 если их нет
router.get('/hasFollowers', async (req, res) => {
    try {
      const token = req.cookies.userRegistered;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      
      const [rows1] = await db.promise().query('SELECT has_followers FROM StartrackChessOnline.Has_followers WHERE id = ?', [userId]);
      const has = rows1[0];
      //все ок

      res.json({ has_some: has.has_followers }); // здесь возвращается 1 или 0
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Неверный токен' });
    }
});



router.get('/takeNewFriendName', async (req, res) => {
    let friendDataArray = [];
    try {
        
        const token = req.cookies.userRegistered;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
    
        const [friendIds] = await db.promise().query('SELECT id_from FROM StartrackChessOnline.Follow_data WHERE id_to = ?', [userId]);
        if(friendIds.length !== 0){
            // console.log("нашли подписчика с айди " + JSON.stringify(friendIds));
            // console.log("Что в friendIds[0]?: " + JSON.stringify(friendIds[0]));

            //заполняю массив данными друзей по их айди
            for(let i = 0; i < friendIds.length; i++){
                const [friendData] = await db.promise().query('SELECT login FROM StartrackChessOnline.Activity WHERE id = ?', [friendIds[i].id_from]);
                friendDataArray.push(friendData);
            }

            // console.log("Что в заявках: " + JSON.stringify(friendDataArray));
 
            //в респонс кладем массив с данными пользователей
            res.json({ friend_data: friendDataArray }); 
        }
        else{
            // console.log("У юзера пока что нет подписчиков");
            res.json({ friend_data: friendDataArray }); 
        }
      
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'какая-то ошибка с подписчиками' });
    }
});

//добавляем человечка в друзья 
router.get('/addFriend/:newFriendName', async (req, res) => {

    const newFriendName = req.params.newFriendName; //логин того кого мы ищем
    const connection = await db.promise().getConnection();

    const token = req.cookies.userRegistered;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; //наш айди
    const userLogin = getLoginData(userId);

    try {

        await connection.beginTransaction();
        //сначала ищем айдишник этого человечка в базе
        const [rows1] = await db.promise().query('SELECT id FROM StartrackChessOnline.Authorization WHERE login = ?', [newFriendName]);
        const friendID = rows1[0];
        // console.log("айди и имя нового друга  "+ friendID.id +  newFriendName);

        //теперь добавляем нам друга
        // connection.query('UPDATE StartrackChessOnline.Friends SET my_friend_id = ? WHERE my_id = ?', [friendID.id, userId]);
        await connection.execute('INSERT INTO StartrackChessOnline.Friends (my_friend_id, my_id) VALUES (?, ?)', [friendID.id, userId]);
        //а потом другу добавляем нас
        // connection.query('UPDATE StartrackChessOnline.Friends SET my_friend_id = ? WHERE my_id = ?', [userId,friendID.id]);
        await connection.execute('INSERT INTO StartrackChessOnline.Friends (my_friend_id, my_id) VALUES (?, ?)', [userId, friendID.id]);

        //теперь нужно удалить айди нового друга из таблицы Follow_data
        await connection.execute('DELETE FROM StartrackChessOnline.Follow_data WHERE id_from = ? AND id_to = ?', [friendID.id, userId]);
        console.log(`удалили 1 позицию из Follow_data`);
        console.log("Теперь вы и "+ newFriendName+ " друзья!");

        await connection.commit();
        res.json({ status: "success", success: "Теперь вы и "+ newFriendName+ " друзья!"});
        
    } catch (error) {
      console.error(error);
      await connection.rollback();
      console.error('Транзакция не удалась, друг не добавлен', error);
      res.json({ status: "error", error: "Внутренняя ошибка работы базы"});
    }finally {
        //теперь смотрим есть ли еще подписки у нашего айди в таблице Follow_data 
        //и если больше нет то в таблицу Has_followers ставим 0
        const [rows2] = await db.promise().query('SELECT id_from FROM StartrackChessOnline.Follow_data WHERE id_to = ?', [userId]);
        if(rows2.length == 0){
            await connection.query('UPDATE StartrackChessOnline.Has_followers SET has_followers = 0 WHERE id = ?', [userId]);
            console.log("у нас больше нет подписчиков!")
        }else{
            console.log("У нас еще есть подписчики!");
        }

        //закрываем соединение транзакции
        await connection.release();
    }
});

//токлоняем заявку в друзья
router.get('/rejectFriend/:newFriendName', async (req, res) => {

  const newFriendName = req.params.newFriendName; //логин того кого мы ищем
  console.log("Имя тюбика: ",newFriendName)
  const connection = await db.promise().getConnection();

  const token = req.cookies.userRegistered;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id; //наш айди
  const userLogin = getLoginData(userId);

  try {

      await connection.beginTransaction();
      //сначала ищем айдишник этого человечка в базе
      const [rows1] = await db.promise().query('SELECT id FROM StartrackChessOnline.Authorization WHERE login = ?', [newFriendName]);
      const friendID = rows1[0];
      console.log("айди и имя отклоненного друга  "+ friendID.id +  newFriendName);

      await connection.execute('DELETE FROM StartrackChessOnline.Follow_data WHERE id_from = ? AND id_to = ?', [friendID.id, userId]);
      console.log(`удалили 1 позицию из Follow_data`);
      console.log("Вы отклонили заявку "+ newFriendName+ " в друзья");

      await connection.commit();
      res.json({ status: "success", success: "Вы отклонили заявку "+ newFriendName+ " в друзья"});
      
  } catch (error) {
    console.error(error);
    await connection.rollback();
    console.error('Транзакция не удалась, заявка не отклонена', error);
    res.json({ status: "error", error: "Внутренняя ошибка работы базы"});
  }finally {
      //теперь смотрим есть ли еще подписки у нашего айди в таблице Follow_data 
      //и если больше нет то в таблицу Has_followers ставим 0
      const [rows2] = await db.promise().query('SELECT id_from FROM StartrackChessOnline.Follow_data WHERE id_to = ?', [userId]);
      if(rows2.length == 0){
          await connection.query('UPDATE StartrackChessOnline.Has_followers SET has_followers = 0 WHERE id = ?', [userId]);
          console.log("у нас больше нет подписчиков!")
      }else{
          console.log("У нас еще есть подписчики!");
      }

      //закрываем соединение транзакции
      await connection.release();
  }
});

////////////////////////////////////ниже для экрана создания игры////////////////////////////////////
  


//что-то типа bool но возвращает 1 если есть приглашения в игру и 0 если нет
router.get('/hasInvitations', async (req, res) => {
    try {
      const token = req.cookies.userRegistered;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      
      const [rows1] = await db.promise().query('SELECT Has_invitation FROM StartrackChessOnline.Has_invitation WHERE id = ?', [userId]);
      const has = rows1[0];
      // console.log("Что в rows1: " + JSON.stringify(rows1));
      // console.log("У нас есть приглашение");
      //тут все хорошо выводит и работает

      res.json({ has_some: has.Has_invitation }); // здесь возвращается 1 или 0
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Неверный токен' });
    }
});
router.get('/takeNewGameName', async (req, res) => {
    let friendDataArray = [];
    try {
        
        const token = req.cookies.userRegistered;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
    
        const [friendIds] = await db.promise().query('SELECT id_from FROM StartrackChessOnline.Invitation_data WHERE id_to = ?', [userId]);
        if(friendIds.length !== 0){
            // console.log("нашли подписчика с айди " + JSON.stringify(friendIds));
            // console.log("Что в friendIds[0]?: " + JSON.stringify(friendIds[0]));

            //заполняю массив данными друзей по их айди
            for(let i = 0; i < friendIds.length; i++){
                const [friendData] = await db.promise().query('SELECT login FROM StartrackChessOnline.Activity WHERE id = ?', [friendIds[i].id_from]);
                friendDataArray.push(friendData);
            }

            //в респонс кладем массив с данными пользователей
            res.json({ friend_data: friendDataArray }); 
        }
        else{
            // console.log("У юзера пока что нет подписчиков");
            res.json({ friend_data: friendDataArray }); 
        }
      
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'какая-то ошибка с логином приглашающего в игру' });
    }
});


router.get('/createGame/:userLogin', (req, res) => {

  const userLogin = req.params.userLogin; //логин того кто нас приглашает в игру
  let userId; // объявляем переменную за пределами блока .then()
  db.promise().query('SELECT id FROM StartrackChessOnline.Authorization WHERE login = ?', [userLogin])
  .then(([rows]) => {
    console.log("mmmm "+JSON.stringify(rows));
    userId = rows[0].id; // присваиваем значение переменной внутри блока .then()
    console.log("id " + userId);

    //теперь юзаем этот айди как-то
    const token = req.cookies.userRegistered;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const OurId = decoded.id; //наш айди
    // const OurLogin = getLoginData(OurId); //наш логин
    try {
      //через транзакцию почему-то не работает
  
      console.log("465: "+userId);
  
  
      db.query('UPDATE StartrackChessOnline.Has_invitation SET Has_invitation = 0 WHERE id = ?', [OurId]);
      db.execute('DELETE FROM StartrackChessOnline.Invitation_data WHERE id_from = ? AND id_to = ?', [userId, OurId]);
  
      //импровезированный рандомайзер
      const var1 = OurId;
      const var2 = userId;
      const randomNum = Math.floor(Math.random() * 2); // 0 или 1
  
      let column1, column2;
      if (randomNum === 0) {
        column1 = var1;
        column2 = var2;
      } else {
        column1 = var2;
        column2 = var1;
      }

      //рандомно генерирую айди для игры
      const idGame = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;
      
      db.execute('INSERT INTO StartrackChessOnline.Games (id_black, id_white) VALUES (?, ?)', [column1, column2]);

      //кладем в Responce_data номер игры которвы мы сгенерировал
      db.execute('INSERT INTO StartrackChessOnline.Responce_data (idResponce_data, id_from, id_to, has_accepted) VALUES (?, ?, ?, ?)', [idGame, OurId, userId, 1]);

      //и в Has_responce ставим единичку типа мы согласиись играть
      db.query('UPDATE StartrackChessOnline.Has_responce SET Has_responce = 1 WHERE id = ?', [userId]);

      res.json({ status: "success", success: "Игра создается", id_black: column1, id_white: column2, idGame: idGame});
  
    }catch(error){      
      console.error(error);
  
      console.error('Игра не создалась', error);
      res.json({ status: "error", error: "Внутренняя ошибка работы базы"});
    }
    
  })
  .catch((err) => {
    console.error(err);
  });



});

//это новое для игры без регистрации
router.get("/game", (req,res)=>{

  res.render("game.ejs")

});



router.get("/game/:gameId/go", (req,res)=>{
  const gameId = req.params.gameId;
  console.log("тут у нас "+gameId);
  res.render("game.ejs")

});

router.get("/game/:gameId/goWhite", (req,res)=>{

  const gameId = req.params.gameId;
  console.log("тут у нас "+gameId);
  res.render("whiteGame.ejs")

});

router.get("/game/:gameId/goBlack", (req,res)=>{

  const gameId = req.params.gameId;
  console.log("тут у нас "+gameId);
  res.render("blackGame.ejs")

});


//отправляем пришлашение поиграть в игру
router.get("/inviteToGame/:userLogin", async(req,res)=>{

  const userLogin = req.params.userLogin; //логин того кто нас приглашает в игру

  const token = req.cookies.userRegistered;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const OurId = decoded.id; //наш айди
  

  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();
    //заносим себя в таблицу ожидающих ответа по приглашению в игру //по умолчанию там ноль
    await connection.execute('INSERT INTO StartrackChessOnline.Has_responce (id) VALUES (?)', [OurId]);

    //сначала ищем айдишник этого человечка в базе (которого приглашаем)
    const [rows1] = await db.promise().query('SELECT id FROM StartrackChessOnline.Authorization WHERE login = ?', [userLogin]);
    const friendID = rows1[0];
    console.log("айди того кого приглашаем  "+ friendID.id + userLogin);

    //заносим сначала свой айди и чела которого приглашаем в таблицу invitation_data
    await connection.execute('INSERT INTO StartrackChessOnline.Invitation_data (id_from, id_to) VALUES (?, ?)', [OurId,friendID.id]);
    //а потом обновляем значение в таблице Has_invitation
    await connection.query('UPDATE StartrackChessOnline.Has_invitation SET Has_invitation = 1 WHERE id = ?', [friendID.id]);

    await connection.commit();
    res.json({ status: "success", success: "Приглашение отправлено!"});
  } catch (error) {
    console.error(error);
    await connection.rollback();
    console.error('Транзакция не удалась, приглашение не отправлено', error);
    res.json({ status: "error", error: "Внутренняя ошибка работы базы, приглашение не отправлено"});
  }finally {
    //закрываем соединение транзакции
    await connection.release();
}



})


//есть ли ответ на приглашение в игру
router.get('/hasResponce', async (req, res) => {

  const token = req.cookies.userRegistered;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id; //наш айди

  try {

    const [rows1] = await db.promise().query('SELECT Has_responce FROM StartrackChessOnline.Has_responce WHERE id = ?', [userId]);
    // console.log("Что в rows1????? " + JSON.stringify(rows1)+"\n");
    const [has] = rows1;
    // console.log("Что в rows1 там где Has_responce 22222: " + JSON.stringify(has.Has_responce));

    // console.log("У нас есть приглашение");
    //тут все хорошо выводит и работает
    if( has.Has_responce==0){
      res.json({ Has_responce: has.Has_responce});
    }
    else{
      //если приглашение есть то узнаем от кого и узнаем номер игры
      const [rows2] = await db.promise().query('SELECT id_from FROM StartrackChessOnline.Responce_data WHERE id_to = ?', [userId]);
      const [has2] = rows2;

      const [rows3] = await db.promise().query('SELECT idResponce_data FROM StartrackChessOnline.Responce_data WHERE id_from = ?', [has2.id_from]);
      const [has3] = rows3;

      console.log("--------\n--------");
      console.log("Идем в игру с номером 1 " + JSON.stringify(has3.idResponce_data));
      console.log("Идем в игру с номером 1.1 "+has3.idResponce_data);


      // db.execute('INSERT INTO StartrackChessOnline.White_move (idGame) VALUES (?)', [123]);
      // db.execute('INSERT INTO StartrackChessOnline.Black_move (idGame) VALUES (?)', [123]);
    

      console.log("--------\n--------");

      res.json({ Has_responce: has.Has_responce, idResponce_data: has3.idResponce_data }); // здесь возвращается 1 и айди игры
    }

  
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Неверный токен' });
  }
});




//отправляем пришлашение поиграть в игру
router.get("/whatNumber/:idResponceFrom", async(req,res)=>{

  const idResponceFrom = req.params.idResponceFrom; //логин того кто нас приглашает в игру

  const token = req.cookies.userRegistered;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const OurId = decoded.id; //наш айди

  try {

    const [rows1] = await db.promise().query('SELECT idResponce_data FROM StartrackChessOnline.Responce_data WHERE id_from = ? AND id_to = ?', [idResponceFrom,userId]);
    const idGame = rows1[0];

    // console.log("Что в rows1: " + JSON.stringify(rows1));
    // console.log("У нас есть приглашение");
    //тут все хорошо выводит и работает

    res.json({ idGame: has.idGame }); // здесь возвращается 1 или 0
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Неверный токен' });
  }


});






module.exports = router;

