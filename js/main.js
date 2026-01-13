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

const updateCasesOverview = () => {
  const casesData = {
    gold: 15,
    silver: 23,
    bronze: 8,
    platinum: 12,
    titanium: 5,
    dsat: 3
  };

  const totalCases = Object.values(casesData).reduce((acc, val) => acc + val, 0);

  if(document.getElementById('totalTickets')) {
    document.getElementById('totalTickets').textContent = totalCases;
  }
  if(document.getElementById('goldCases')) {
    document.getElementById('goldCases').textContent = casesData.gold;
  }
  if(document.getElementById('silverCases')) {
    document.getElementById('silverCases').textContent = casesData.silver;
  }
  if(document.getElementById('bronzeCases')) {
    document.getElementById('bronzeCases').textContent = casesData.bronze;
  }
  if(document.getElementById('platinumCases')) {
    document.getElementById('platinumCases').textContent = casesData.platinum;
  }
  if(document.getElementById('titaniumCases')) {
    document.getElementById('titaniumCases').textContent = casesData.titanium;
  }
  if(document.getElementById('dsatCases')) {
    document.getElementById('dsatCases').textContent = casesData.dsat;
  }

  const updateProgressBar = (barId, value) => {
    const bar = document.getElementById(barId);
    if(bar && totalCases > 0) {
      const percentage = (value / totalCases) * 100;
      bar.style.width = `${percentage}%`;
      bar.style.transition = 'width 0.5s ease-in-out';
    }
  };

  updateProgressBar('goldBar', casesData.gold);
  updateProgressBar('silverBar', casesData.silver);
  updateProgressBar('bronzeBar', casesData.bronze);
  updateProgressBar('platinumBar', casesData.platinum);
  updateProgressBar('titaniumBar', casesData.titanium);
  updateProgressBar('dsatBar', casesData.dsat);
};

if(window.location.pathname == "/main.html") {
  updateCasesOverview();
}
