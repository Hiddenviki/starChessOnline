
const form = document.querySelector('form');

form.addEventListener("submit", (event) => 
{
    event.preventDefault();

    const register = {
        email: form.email.value,
        login: form.login.value,
        password1: form.password1.value,
        password2: form.password2.value
    }
    fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(register),
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

          window.location.href = '/login';
          error.style.display = "none"
          success.style.display = "block"
          success.innerText = data.success
        }
    })
});

