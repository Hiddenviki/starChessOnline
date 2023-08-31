async function getUserName() {
    const response = await fetch('/userLogin');
    const data = await response.json();
    const name = data.name;
    const score = data.score;
    document.getElementById('user-name').textContent = name;
    document.getElementById('user-score').textContent = score;

  }


  async function getUserScore() {
    const response = await fetch('/userScore');
    const data = await response.json();
    const score = data.score;
    document.getElementById('user-score').textContent = score;

  }


  //топ 3 игрока
async function getTop3() 
{
    const response = await fetch('/top3');
    const data = await response.json();
      
    const friendsDiv = document.getElementById('user-top');
    friendsDiv.innerHTML = ''; // очистить div перед добавлением новых данных


    // проходим по всем элементам массива и добавляем их в div
    //у нас странный массив в котором массивы поэтому двойной цикл стремный
    data.rows1.forEach((top) => {
    const friendDiv = document.createElement('div');
    friendDiv.style.display = 'flex';
    friendDiv.style.justifyContent = 'space-between';
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = ` ${top.login} : `;
    
    const scoreSpan = document.createElement('span');
    scoreSpan.textContent = top.score;
    scoreSpan.classList.add('friend-score');

    friendDiv.appendChild(nameSpan);
    friendDiv.appendChild(scoreSpan);
    
    friendsDiv.appendChild(friendDiv);
})};


  async function myOnline() {
    const response = await fetch('/online');
  }


// Получить кнопку выхода
const logoutButton = document.getElementById('logout-button');

// Добавить обработчик события click на кнопку выхода
logoutButton.addEventListener('click', function() {
  // Выполнить AJAX-запрос для вызова функции на сервере
  fetch('/offline', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin'
  })
  .then(response => response.json())
  .then(data => {
    // Обработать ответ от сервера (если требуется)
    console.log(data);
  })
  .catch(error => {
    // Обработать ошибку (если требуется)
    console.error(error);
  });
});


//друзья из базы
async function getFriends() {
  const response = await fetch('/getFriends');
  const data = await response.json();

  const friendsDiv = document.getElementById('user-friends');
  friendsDiv.innerHTML = ''; // очистить div перед добавлением новых данных
  

  // проходим по всем элементам массива и добавляем их в div
  //у нас странный массив в котором массивы поэтому двойной цикл стремный
  data.friend_data.forEach((friend) => {
    friend.forEach((i) => {
      const friendDiv = document.createElement('div');
      friendDiv.classList.add('friend-div');
      friendsDiv.appendChild(friendDiv);
  
      const nameDiv = document.createElement('div');
      nameDiv.textContent = ` ${i.login} : `;
      nameDiv.classList.add('name-div');
      friendDiv.appendChild(nameDiv);
  
      // Создаем контейнер для кнопки и статуса
      const statusButtonContainer = document.createElement('div');
      statusButtonContainer.classList.add('status-button-container');
      statusButtonContainer.style.display = 'flex'; // Добавляем display:flex
  
      const statusDiv = document.createElement('div');
      statusDiv.classList.add('status-div');
      if (i.active == 0) {
        statusDiv.classList.add('offline'); // Добавляем класс "offline" для серого индикатора
      } else {
        statusDiv.classList.add('online'); // Добавляем класс "online" для зеленого индикатора
      }
      statusDiv.style.marginTop = '10px'; // Добавляем отступ сверху
  
  
      // Создаем кнопку "-"
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.classList.add('btn', 'btn-outline-danger');
      removeButton.textContent = '-';
      removeButton.style.marginRight = '10px'; // Добавляем отступ справа
      removeButton.setAttribute('data-user-login', i.login);
  
      // Добавляем обработчик событий на кнопку "-"
      removeButton.addEventListener('click', () => {
        // Действие при нажатии на кнопку "-"
        //вот это надо вынести отдельной функцией и дописать удаление из друзей
      });
  
      // Добавляем элементы внутрь контейнера
      statusButtonContainer.appendChild(statusDiv);
      statusButtonContainer.appendChild(removeButton);
  
      // Добавляем контейнер ниже nameDiv внутри friendDiv
      friendDiv.appendChild(nameDiv);
      friendDiv.appendChild(statusButtonContainer);
    });
  });
  
  
}

//функция показа уведомления немного порнографична но работает
async function showNotification() {
  const responseName = await fetch('/takeNewFriendName');
  const responseNameData = await responseName.json();

  responseNameData.friend_data.forEach((friend) => {
    friend.forEach((i) => {
      // Создаем новый элемент div для уведомления
      const notification = document.createElement("div");
      notification.classList.add("alert", "alert-success", "alert-dismissible", "new-follower-alert");

      notification.setAttribute("role", "alert");

      // Создаем заголовок уведомления
      const header = document.createElement("h8");
      header.classList.add("alert-heading");
      header.textContent = "Заявка в друзья";

      // Создаем текст уведомления
      const text = document.createElement("p");
      text.innerHTML = `${i.login} хочет добавить вас в друзья!`;

      // Создаем кнопки уведомления
      const acceptBtn = document.createElement("button");
      acceptBtn.classList.add("btn", "btn-success");
      acceptBtn.textContent = "Принять";

      const rejectBtn = document.createElement("button");
      rejectBtn.classList.add("btn", "btn-danger");
      rejectBtn.textContent = "Отклонить";

      acceptBtn.classList.add("btn", "btn-success", "btn-accept");
      rejectBtn.classList.add("btn", "btn-danger", "btn-reject");          
      
      
      //добавляем атрибут data-user-id на каждую кнопку чтою распознать кого именно отклонили или приняли
      acceptBtn.setAttribute('data-user-login', i.login);
      rejectBtn.setAttribute('data-user-login', i.login);
      
      //добавляем обработчик на каждую кнопку
      acceptBtn.addEventListener('click', handleAccept);
      rejectBtn.addEventListener('click', handleReject);
      

      const closeBtn = document.createElement("button");
      closeBtn.setAttribute("type", "button");
      closeBtn.classList.add("btn-close");
      closeBtn.setAttribute("aria-label", "Close");

      //оживляем кнопку закрытия уведомления
      closeBtn.addEventListener("click", () => {
        notification.classList.add("fade-out");
        setTimeout(() => {
          notification.remove();
        }, 500);
      });

      // Добавляем созданные элементы в уведомление
      notification.appendChild(header);
      notification.appendChild(text);
      notification.appendChild(acceptBtn);
      notification.appendChild(rejectBtn);
      notification.appendChild(closeBtn);

      // Добавляем уведомление на страницу
      document.body.appendChild(notification);

      // Плавно появляем уведомление
      setTimeout(() => {
      notification.classList.add("fade-in");
      }, 10);

      // Удаляем уведомление через 5 секунд
      setTimeout(() => {
        notification.classList.add("fade-out");
        notification.remove();
      }, 7000);
    });
  });
}


//функция которая просто показывает подписчиков в квадратике

async function showFollowers(){
  //получаем имя человечка из базы(от кого заявочка)
  const responseName = await fetch('/takeNewFriendName');
  const responseNameData = await responseName.json();

  const friendsDiv = document.getElementById('user-followers');
  friendsDiv.innerHTML = ''; // очистить div перед добавлением новых данных

  //во-вторых добавляем имена в квадратик в аккаунте
  responseNameData.friend_data.forEach((friend) => {
    friend.forEach((i) => {
  
      const friendDiv = document.createElement('div');
      friendDiv.classList.add('friend-container');
  
      const friendName = document.createElement('span');
      friendName.textContent = `${i.login}`;
      friendDiv.appendChild(friendName);
  
      const btnsDiv = document.createElement('div'); // создаем div для кнопок
      btnsDiv.style.display = 'inline-block';
  
      const acceptBtn = document.createElement('button');
      acceptBtn.textContent = 'Принять';
      acceptBtn.classList.add('btn', 'btn-outline-success', 'accept-friend-btn');
      
  
      const rejectBtn = document.createElement('button');
      rejectBtn.textContent = 'Отклонить';
      rejectBtn.classList.add('btn', 'btn-outline-danger', 'reject-friend-btn');
      rejectBtn.style.marginLeft = '10px'; // добавляем отступ слева

      //добавляем атрибут data-user-id на каждую кнопку чтою распознать кого именно отклонили или приняли
      acceptBtn.setAttribute('data-user-login', i.login);
      rejectBtn.setAttribute('data-user-login', i.login);

      acceptBtn.addEventListener('click', handleAccept);
      rejectBtn.addEventListener('click', handleReject);
  
      btnsDiv.appendChild(acceptBtn); // добавляем кнопки в отдельный div
      btnsDiv.appendChild(rejectBtn);
  
      friendDiv.appendChild(btnsDiv); // добавляем div с кнопками к div с логином
  
      friendsDiv.appendChild(friendDiv);
    })
  });
}

//функция для принятия заявки в друзья
async function handleAccept(event) {
  const userLogin = event.target.dataset.userLogin;

  // Отправляем запрос на сервер для добавления друга
  const response = await fetch(`/addFriend/${userLogin}`);
  const data = await response.json();

  // Находим элементы уведомлений
  const successAlert = document.getElementById('alert-success');
  const errorAlert = document.getElementById('alert-error');

  // Проверяем статус ответа
  if(data.status == "error") {
    // Показываем уведомление об ошибке
    successAlert.style.display = "none ";
    errorAlert.style.display = "block";
    errorAlert.innerText = data.error;

    // Устанавливаем таймер на скрытие уведомления об ошибке
    setTimeout(() => {
      errorAlert.style.display = "none";
    }, 3000);
  } else {
    // Показываем уведомление об успешном добавлении друга
    errorAlert.style.display = "none";
    successAlert.style.display = "block";
    successAlert.innerText = data.success;

    // Устанавливаем таймер на скрытие уведомления об успешном добавлении друга
    setTimeout(() => {

      successAlert.style.display = "none";
    }, 3000);
  }
}

//отклоняем зааявку в друзья
async function handleReject(event) {
  const userLogin = event.target.dataset.userLogin;

    // Отправляем запрос на сервер для удалении заявки
  const response = await fetch(`/rejectFriend/${userLogin}`);
  const data = await response.json();
      // Находим элементы уведомлений
  const successAlert = document.getElementById('alert-success');
  const errorAlert = document.getElementById('alert-error');

  // Проверяем статус ответа
  if(data.status == "error") {
    // Показываем уведомление об ошибке
    successAlert.style.display = "none ";
    errorAlert.style.display = "block";
    errorAlert.innerText = data.error;

    // Устанавливаем таймер на скрытие уведомления об ошибке
    setTimeout(() => {
      errorAlert.style.display = "none";
    }, 3000);
  } else {
    // Показываем уведомление об успешном удалении заявки
    errorAlert.style.display = "none";
    successAlert.style.display = "block";
    successAlert.innerText = data.success;

    // Устанавливаем таймер на скрытие уведомления об успешном удалении заявки
    setTimeout(() => {

      successAlert.style.display = "none";
    }, 3000);
  }



}



// Проверяем каждые 5 секунд
async function hasFollowers() 
{
  const response1 = await fetch('/hasFollowers');
  const data1 = await response1.json();

  //если заявок нет
  if(data1.has_some==0){
    document.getElementById('user-followers').textContent = "Нет заявок";
  }
  else{
    //во-первых показываем уведомление
    showNotification();

  }  

}

const friendsElement = document.getElementById("user-friends");
const foundUserElement = document.getElementById("found-users");

const closeButton = document.getElementById("close-find");

//ивент листенер для поиска людей
document.getElementById("search-btn").addEventListener("click", function(event){

  event.preventDefault();

  var searchInput = document.getElementById("search-input").value;
  fetch(`/findUser/${searchInput}`)
  .then(response => response.json())
  .then(data => {

    friendsElement.style.display = "none"; //убираем друзей
    closeButton.style.display = "block"; //появляем кнопку закрытия
    closeButton.style.float = "right"; //переносим кнопку закрытия вправо
    foundUserElement.style.display = "block"; //проявляем штуки для найденых пользователей

    if (data.length != 0) {
      foundUserElement.innerHTML = ''; // очистить div перед добавлением новых данных

      data.users.forEach((user) => {
        const foundDiv = document.createElement('div');
        
        const statusDiv = document.createElement('div');
        statusDiv.classList.add('status-div');
        if (user.active == 1) {
          statusDiv.classList.add('online'); // Добавляем класс "online" для зеленого индикатора
        } else {
          statusDiv.classList.add('offline'); // Добавляем класс "offline" для серого индикатора
        }
        statusDiv.style.marginLeft = '20px'; // Добавляем отступ сверху
        
      
        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.classList.add('btn', 'btn-outline-primary');
        addButton.textContent = '+';
        addButton.setAttribute('data-user-login', user.login);

        addButton.addEventListener('click', followFriend);
        
        const userText = document.createElement('span');
        userText.textContent = user.login;

        foundDiv.appendChild(userText);
        foundDiv.appendChild(statusDiv);
        foundDiv.appendChild(addButton);

        // Применение CSS для расположения элементов в одну строку
        [userText, statusDiv, addButton].forEach(element => {
        element.style.display = 'inline-block';
        });

        foundUserElement.appendChild(foundDiv);
      });

    } else {
      foundUserElement.innerHTML = "Пользователь не найден";
    }
  })
  .catch(error => {
    console.error(error);
    foundUserElement.innerHTML = "Ошибка поиска пользователя";
  });

});

async function followFriend(event) {
  const userLogin = event.target.dataset.userLogin;

  // Отправляем запрос на сервер для удалении заявки
  const response = await fetch(`/followFriend/${userLogin}`);
  const data = await response.json();
      // Находим элементы уведомлений
  const successAlert = document.getElementById('alert-success');
  const errorAlert = document.getElementById('alert-error');

  // Проверяем статус ответа
  if(data.status == "error") {
    // Показываем уведомление об ошибке
    successAlert.style.display = "none ";
    errorAlert.style.display = "block";
    errorAlert.innerText = data.error;

    // Устанавливаем таймер на скрытие уведомления об ошибке
    setTimeout(() => {
      errorAlert.style.display = "none";
    }, 3000);
  } else {
    // Показываем уведомление об успешном удалении заявки
    errorAlert.style.display = "none";
    successAlert.style.display = "block";
    successAlert.innerText = data.success;

    // Устанавливаем таймер на скрытие уведомления об успешном удалении заявки
    setTimeout(() => {

      successAlert.style.display = "none";
    }, 3000);
  }
  // Действие при нажатии на кнопку отправить заявку в друзья
  

};



//тут по нажатию на крестик убирается окно где результаты поиска и показывается окно друзей
closeButton.addEventListener('click', function() {

  friendsElement.style.display = 'block'; //проявляем место для друзей
  closeButton.style.display = "none"; //убираем кнопку закрытия
  foundUserElement.style.display = "none"; //убираем место для найденых пользователей

});
  



////////для уведомлений о приглашении в игру 

//функция показа уведомления о приглашении в игру (она должна быть на всех экранах)
async function showInvitationNotification() {
  console.log("Я работаю");
  const responseName = await fetch('/takeNewGameName');
  const responseNameData = await responseName.json();

  responseNameData.friend_data.forEach((friend) => {
    friend.forEach((i) => {
      console.log("______++++______");
      // Создаем новый элемент div для уведомления
      const notification2 = document.createElement("div");
      notification2.classList.add("alert", "alert-primary", "alert-dismissible", "new-invitation-alert");

      notification2.setAttribute("role", "alert");

      // Создаем заголовок уведомления
      const header = document.createElement("h8");
      header.classList.add("alert-heading");
      header.textContent = "Новая игра";

      // Создаем текст уведомления
      const text = document.createElement("p");
      text.innerHTML = `${i.login} приглашает вас в игру!`;

      // Создаем кнопки уведомления
      const acceptGameBtn = document.createElement("button");
      acceptGameBtn.classList.add("btn", "btn-outline-primary");
      acceptGameBtn.textContent = "Принять";

      const rejectGameBtn = document.createElement("button");
      rejectGameBtn.classList.add("btn", "btn-outline-danger");
      rejectGameBtn.textContent = "Отклонить";

      acceptGameBtn.classList.add("btn", "btn-outline-primary", "btn-accept2");
      rejectGameBtn.classList.add("btn", "btn-outline-danger", "btn-reject2");          
      
      
      //добавляем атрибут data-user-login на каждую кнопку чтою распознать кого именно отклонили или приняли
      acceptGameBtn.setAttribute('data-user-login', i.login);
      rejectGameBtn.setAttribute('data-user-login', i.login);    
      
      //добавляем обработчик на каждую кнопку
      acceptGameBtn.addEventListener('click', handleAcceptGame);
      rejectGameBtn.addEventListener('click', handleRejectGame);
      
      // Добавляем созданные элементы в уведомление
      notification2.appendChild(header);
      notification2.appendChild(text);
      notification2.appendChild(acceptGameBtn);
      notification2.appendChild(rejectGameBtn);

      // Добавляем уведомление на страницу
      document.body.appendChild(notification2);

      // Плавно появляем уведомление
      setTimeout(() => {
      notification2.classList.add("fade-in");
      }, 10);      
      
      // Удаляем уведомление через 5 секунд
      setTimeout(() => {
        notification2.classList.add("fade-out");
        notification2.remove();
      }, 5000);

      
    });
  });
}

//функция для принятия приглашения в игру
function handleAcceptGame(event) {
const userLogin = event.target.dataset.userLogin; //логин того кто приглашает
console.log("+Принимаю игру от ++"+userLogin);

// Отправляем запрос на сервер для присоединения к игре
//там в таблицу Game заносим два айди (рандомно белый и черный) и присваеваем игре номер

fetch(`/createGame/${userLogin}`)
  .then(response => response.json())
  .then(data => {
    if(data.status=="success")
    {
      //генерирую айди игры
    
      const idGame = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;

      //тут переходит человечек которого позвали
      window.location.href = `/game/${idGame}/go`;

    }
    else{
      console.log("Неудача");
    }
  })
  .catch(error => console.error(error));
}

//функция для отмены приглашения в игру
function handleRejectGame(event) {
const userLogin = event.target.dataset.userLogin;
//ну тут просто будет функция удаления из базы

}


async function hasInvitations() 
{
const response1 = await fetch('/hasInvitations');
const data1 = await response1.json();

//если заявок нет
if(data1.has_some==1){
  showInvitationNotification();
}

}

// каждые 3 секунды проверяет есть ли приглашения в игру
document.addEventListener("DOMContentLoaded", () => {
setInterval(() => {
  hasInvitations();
}, 5000);
});



 // вызываем функции при загрузке страницы 
  myOnline();
  getUserName();
  getUserScore();
  getTop3();

  //при загрузке выводим инфу сразу(не удалять так и надо чтоб еще и снизу вызывалась)
  getFriends();

  //при загрузке выводим инфу сразу(не удалять так и надо чтоб еще и снизу вызывалась)
  showFollowers();

//показывает уведомления каждые 10 секунд что есть заявки в друзья
  document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
      hasFollowers();
    }, 10000);
  });



  //каждые 5 секунд обновляем список друзей(по идее это нужно для онлайна)
  document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
      getFriends();
    }, 5000);
  });


