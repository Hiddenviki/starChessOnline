const form = document.querySelector('form');



form.addEventListener("submit",() => 
{
    const login = {
        login: login1.value,
        password: password.value
    }
    // console.log("Тут у нас логин "+login[0]+login[1]);
    // console.log("Тут у нас значение логин1 "+login1.value);
    fetch("api/login", {
    method: "POST",
    body: JSON.stringify(login),
    headers:
    {
      "Content-Type":"application/json"
    }
    }).then(response => response.json())
    .then(data => 
      {
        if(data.status == "error") {
          success.style.display = "none "
          error.style.display = "block"
          error.innerText = data.error
        } else {

          window.location.href = '/account';
          error.style.display = "none"
          success.style.display = "block"
          success.innerText = data.success
          
        }
      })
        
})
