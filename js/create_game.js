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
        friendDiv.style.display = 'flex'; // Добавляем display:flex
    
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
    
        // Создаем кнопку
        const inviteButton = document.createElement('button');
        inviteButton.type = 'button';
        inviteButton.classList.add('btn', 'btn-outline-primary');
        inviteButton.textContent = '+';
        inviteButton.style.marginRight = '20px'; // Добавляем отступ 
    
        // Добавляем обработчик событий на кнопку
        inviteButton.addEventListener('click', inviteToGame);
        inviteButton.setAttribute('data-user-login', i.login);
    
        // Добавляем элементы внутрь контейнера
        statusButtonContainer.appendChild(statusDiv);
        statusButtonContainer.appendChild(inviteButton);
    
        // Добавляем контейнер ниже nameDiv внутри friendDiv
        friendDiv.appendChild(nameDiv);
        friendDiv.appendChild(statusButtonContainer);
      });
    });
    
    
}

async function inviteToGame(event) {
  const userLogin = event.target.dataset.userLogin;
  //ну тут просто будет функция удаления из базы

  //сначала надо отправить уведомление второму игроку что его вызывают в игру типа
  const response22 = await fetch(`/inviteToGame/${userLogin}`);
  const data22 = await response22.json();

  // Находим элементы уведомлений
  const successAlert = document.getElementById('alert-success');
  const errorAlert = document.getElementById('alert-error');

  //для этого нужно в базе заполнить таблицы и дождаться ответа
  // Проверяем статус ответа
  if(data22.status == "error") {
    // Показываем уведомление об ошибке
    successAlert.style.display = "none ";
    errorAlert.style.display = "block";
    errorAlert.innerText = data22.error;

    // Устанавливаем таймер на скрытие уведомления 
    setTimeout(() => {
      errorAlert.style.display = "none";
    }, 3000);
  } else {
    // Показываем уведомление об успешном отправлении приглашения
    errorAlert.style.display = "none";
    successAlert.style.display = "block";
    successAlert.innerText = data22.success;

    // Устанавливаем таймер на скрытие уведомления
    setTimeout(() => {
      successAlert.style.display = "none";
    }, 3000);
    
     //теперь тут надо обновлять функцию которая проверяет таблицу Has_responce
     

  }

}




//функция показа уведомления о заявке в друзья (она должна быть на всех экранах)
async function showNotification() {
  const responseName = await fetch('/takeNewFriendName');
  const responseNameData = await responseName.json();
  console.log("я работаю");

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

      // Удаляем уведомление через 7 секунд
      setTimeout(() => {
        notification.classList.add("fade-out");
        notification.remove();
      }, 7000);
    });
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
  
function handleReject(event) {
  const userLogin = event.target.dataset.userLogin;
  
}


///функция чтоб пригласить человечка в игру


// Проверяем каждые 5 секунд есть ли заявки в друзья
async function hasFollowers() 
{
  const response1 = await fetch('/hasFollowers');
  const data1 = await response1.json();

//если заявоки есть то показываем уведомление
  if(data1.has_some==1){
    showNotification();
  }

}



async function hasResponce() 
{
  const response1 = await fetch('/hasResponce'); //должен вместе с успехом возвращать номер игры
  const data1 = await response1.json();

//если есть ответ на приглашение в игру то идем и узнаем ее номер
  if(data1.Has_responce==1){
      
      console.log("есть ответ!");

    // const idResponceFrom = data1.id_from; //айди того кто принял наше приглашение
    // const response2 = await fetch(`/whatNumber/${idResponceFrom}`); //узнаем номер игры который в базе данных
    // const data2 = await response1.json();

    // //если есть ответ значит есть и номер игры
        const idGame = data1.idResponce_data;
        window.location.href = `/game/${idGame}/goBlack`; 
        
       
    //потом надо будет удалить единицу о том что нас пригласили или как-то отметить 
    //что мы уже в игре чтоб приглашение больше не приходило хотя оно уже и так не будет 
    //приходить на странице с игрой их нет но там надо будет как то проверять есть ли еще какие-то другие прилашения

  }

}




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
        //айди игры
        const idGame = data.idGame;
        console.log("строка клиента 327 айди игры "+idGame);

        const whitePlayer = data.id_white;
        const blackPlayer = data.id_black;



        // const idGame = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;

        //тут переходит человечек которого позвали
        window.location.href = `/game/${idGame}/goWhite`;

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

// каждые 5 секунд проверяет есть ли приглашения в игру
document.addEventListener("DOMContentLoaded", () => {
  setInterval(() => {
    hasInvitations();
  }, 5000);
});

// // каждые 3 секунды проверяет есть ли ответ на приглашение в игру
// document.addEventListener("DOMContentLoaded", () => {
//   setInterval(() => {
//     hasResponce(); 
//   }, 3000);
// });



//показывает уведомления каждые 10 секунд что есть заявки в друзья
document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
      hasFollowers();
    }, 10000);
});    

// каждые 3 секунды проверяет есть ли ответ на приглашение в игру
document.addEventListener("DOMContentLoaded", () => {
  setInterval(() => {
    console.log("Проверяю есть ли ответ")
    hasResponce(); 
  }, 3000);
});

getFriends();