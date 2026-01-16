/* ALERT BOX */
const alertBox = (emojicon, alertTitle, alertMessage) => {
  document.querySelector("#alert").classList.add("alert-container");
  document.querySelector("#alert").innerHTML = `
    <div class="alert">
      <span class="alert-message-icon">${emojicon}</span>
      <h1>${alertTitle}</h1>
      <p>${alertMessage}</p>
      <a title="OK">OK</a>
    </div>
  `
  document.querySelector("#alert a[title='OK']").addEventListener("click", () => {
    document.querySelector("#alert").classList.remove("alert-container");
    document.querySelector("#alert").innerHTML = "";
  });
}
// alertBox("⚠️", "ALERTA", "Mensagem importante");

/* PROMPT */
const promptBox = (emojicon, alertTitle, alertMessage) => {
  document.querySelector("#alert").classList.add("alert-container");
  document.querySelector("#alert").innerHTML = `
    <div class="alert">
      <span class="alert-message-icon">${emojicon}</span>
      <h1>${alertTitle}</h1>
      <p>${alertMessage}</p>
      <a title="Yes">Yes</a>
      <a title="Cancel">Cancel</a>
    </div>
  `
  // document.querySelector("#alert a[title='OK']").addEventListener("click", () => {
  //   document.querySelector("#alert").classList.remove("alert-container");
  //   document.querySelector("#alert").innerHTML = "";
  // });
}
// promptBox("⚠️", "ALERTA", "Mensagem importante");

/* LOADING BOX */
const loadingBox = () => {
  document.querySelector("#alert").classList.add("alert-container");
  document.querySelector("#alert").innerHTML = `
    <div class="loading">
      <img src="../images/loading.gif" alt="Loading..." />
    </div>
  `
}
//loadingBox();

/* LOGIN */
if(window.location.pathname == "/" || window.location.pathname == "/index.html") {
  setTimeout(() => {
    document.querySelector("div.login-container").classList.add("login-container-effect");
  }, 1000)
  let errorsFlag;
  document.querySelector("#login").addEventListener("submit", function(e) {
    let ldap = document.querySelector("[name='ldap']");
    let password = document.querySelector("[name='password']");
    let errorsFlag = false;
    
    if(ldap.value == "" && errorsFlag == false) {
      e.preventDefault();
      errorsFlag = true;
      alertBox("⚠️", "", "Add your ldap");
    }
    if(password.value == "" && errorsFlag == false) {
      e.preventDefault();
      errorsFlag = true;
      alertBox("⚠️", "", "Add your password");
    }
  });
  document.addEventListener("click", function(e) {
    if(e.target.title == "OK") {
      errorsFlag = false;
    }
  });
}

/*AVATAR*/
const avatar = () => {
  const userAvatars = document.querySelectorAll("#userAvatar");
  const userNames = document.querySelectorAll("#userName");

  userNames.forEach((nameElement, index) => {
    const nameText = nameElement.innerText.trim();
    if(!nameText) return;

    const parts = nameText.split(" ");
    const initials = (parts[0][0] + (parts.length > 1 ? parts.pop()[0] : "")).toUpperCase();
    
    if(userAvatars[index]) {
      userAvatars[index].innerHTML = initials;
    }
  });
}
avatar();