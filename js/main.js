/*ALERT BOX*/
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

/*LOGIN*/
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

if(window.location.href.includes("chat.html")) {
  /*FORM LOCK*/
  document.querySelector("form.chat-form").addEventListener("submit", function(e) {
    e.preventDefault();
  });

  /*DATE*/
  const today = () => {
    let date = new Date();
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  /*CHAT LAYOUT*/
  const chatbox = document.querySelector('.chatbox');
  chatbox.innerHTML = `
    <div class="ringing-container">
      <div class="phone"></div>
      <div class="phone-alo-text">Chamando...</div>
    </div>
  `;

  //Scroll
  chatbox.scrollTop = chatbox.scrollHeight;

  //Prohibited
  let textarea = document.querySelector("form.chat-form textarea");
  let micButton = document.querySelector("button.mic");
  let sendButton = document.querySelector("button.send");
  textarea.disabled = true;
  micButton.disabled = true;
  sendButton.disabled = true;
  micButton.classList.remove("mic");
  micButton.classList.add("fakeMic");
  document.querySelector("div.input-nav").style.cursor = "not-allowed";
  textarea.style.cursor = "not-allowed";
  sendButton.style.cursor = "not-allowed";

  //Typing
  const typing = `
    <div class="chat-row chat-row-last">
      <div class="chat-bubble">
        <div class="typing">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  `;
  const saga = (message) => {
    chatbox.innerHTML = `
      <div class="chat-row chat-row-left">
        <div class="chat-card left-chat">
          <div class="chat-user">
            <div class="avatar">
              <img src="images/saga.png" alt="Saga" />
            </div>
            <p>Saga</p>
          </div>
          <p>${message}</p>
          <span class="time">${today()}</span>
        </div>
      </div>
    `
  }
  let pulsingWaitingTime = (Math.floor(Math.random() * 21) + 10) * 1000;
  const sagaIsTyping = setTimeout(() => {
    chatbox.innerHTML = typing;
    setTimeout(() => {
      saga("Alô?");
      textarea.disabled = false;
      micButton.disabled = false;
      sendButton.disabled = false;
      micButton.classList.remove("fakeMic");
      micButton.classList.add("mic");
      document.querySelector("div.input-nav").style.removeProperty("cursor");
      textarea.style.removeProperty("cursor");
      sendButton.style.removeProperty("cursor");
    }, 4000)
  }, pulsingWaitingTime);

  /*STOPWATCHING*/
  const stopwatching = () => {
    let startTime= 0;
    let elapsedTime = 0;
    let currentTime = 0;
    let interval;
    let paused = true;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    let miliseconds = 0;
    
    if(paused) {
      paused = false;
      startTime = Date.now() - elapsedTime;
      document.querySelector("#stopwatch").innerHTML = "00:00:00";
      interval = setInterval(() => {
        currentTime = Date.now() - startTime;
        hours = Math.floor((currentTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((currentTime % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((currentTime % (1000 * 60)) / 1000);
        // miliseconds = Math.floor((currentTime % 1000) / 10);
    
        hours = hours.toString().padStart(2,"0");
        minutes = minutes.toString().padStart(2,"0");
        seconds = seconds.toString().padStart(2,"0");
        // miliseconds = miliseconds.toString().padStart(2,"0");
    
        document.querySelector("#stopwatch").innerHTML = `${hours}:${minutes}:${seconds}`

        if(minutes == "40") {
          document.querySelector("#stopwatch").style.color = "#FF2200";
        }

        if(minutes == "45") {
          document.querySelector("#stopwatch").style.color = "#991400";
        }
      }, 1000);
    }
  }
  stopwatching()

  /*PROGRESS BAR*/
  const progressBar = () => {
    const progressText = document.querySelector("#progress");
    const progressValue = document.querySelector("#progressBar");
    let lastStatus = progressValue.dataset.status || "0";

    const updateProgress = (newStatus) => {
      progressText.innerText = newStatus + "%";
      progressValue.style.width = newStatus + "%";
    };
    updateProgress(lastStatus);

    setInterval(() => {
      let currentStatus = progressValue.dataset.status;
      if(currentStatus !== lastStatus) {
        updateProgress(currentStatus);
        lastStatus = currentStatus;
      }
    }, 50);
  };
  progressBar();

  /*START RECORDING COUNTDOWN*/
  let startCountdown = 3;
  let counter = startCountdown;
  let countdown;
  micButton.addEventListener("mousedown", (e) => {
    e.preventDefault();
    document.querySelector("div.recording").classList.add("show-recording");
    document.querySelector("div.recording").innerHTML = "";
    document.querySelector("div.recording").innerHTML = `
      <div class="recording-alert">
      <h4>Iniciando gravação em</h4>
      <div class="recording-time">${counter}</div>
      <p>Mantenha pressionado para prosseguir</p>
      <p>ou solte para cancelar</p>
      <div class="triangle">
        <div class="triangle-down"></div>
      </div>
    `;

    countdown = setInterval(() => {
      counter--;
      document.querySelector("div.recording-time").innerText = counter;
      if(counter === 0) {
        counter = startCountdown;
        clearInterval(countdown);
        document.querySelector("div.recording").innerHTML = "";
        document.querySelector("div.chat-gears").classList.add("chat-gears-out-of-stage");
        document.querySelector("div.input-nav > p").classList.add("chat-gears-out-of-stage");

        setTimeout(() => {
          document.querySelector("div.recording-stage").classList.add("recording-stage-display");
          document.querySelector("div.recording-stage").innerHTML = `
            <div class="recording-button">
              <div class="fixed-circle animated">
                <div class="stop-icon"></div>
              </div>
            </div>
          `
          techSolutionsSoeakTool();
          document.querySelector("div.recording-stage div.fixed-circle").addEventListener("click", () => {
            document.querySelector("div.recording-stage").classList.remove("recording-stage-display");
            document.querySelector("div.recording-stage").innerHTML = "";
            document.querySelector("div.chat-gears").classList.remove("chat-gears-out-of-stage");
            document.querySelector("div.input-nav > p").classList.remove("chat-gears-out-of-stage");
            counter = startCountdown;
          });
        }, 500)
      }
    }, 1000);
  });

  micButton.addEventListener("mouseup", (e) => {
    e.preventDefault();
    clearInterval(countdown);
    counter = startCountdown;
    document.querySelector("div.recording").classList.remove("show-recording");
  });

  /*MESSAGE SUBMISSION*/
  const messageText = textarea.value.trim();

  //Textarea Expanded
  textarea.addEventListener('input', () => {
    if(textarea.value.length > 0) {
      textarea.classList.add('expanded');
      micButton.classList.add("mic-off");
    }else {
      micButton.classList.remove("mic-off");
    }
  });

  //Message Input
  const chatMessageInput = (message) => {
    let messageLayout;
    const messageText = textarea.value.trim();
    if(messageText === "") {
      return;
    }else {
      messageLayout = `
        <div class="chat-row chat-row-right">
          <div class="chat-card right-chat">
            <p>${message}</p>
            <span class="time">${today()}</span>
          </div>
        </div>
      `
    }
    
    document.querySelector("div.chatbox").innerHTML += messageLayout;
    textarea.value = "";
    micButton.classList.remove("mic-off");
    textarea.classList.remove("expanded");
    document.querySelector('.chatbox').scrollTop = document.querySelector('.chatbox').scrollHeight;
  }

  textarea.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatMessageInput(textarea.value);
    }
  });
  sendButton.addEventListener("click", (e) => {
    e.preventDefault();
    chatMessageInput(textarea.value);
  });

  /*SPEECH RECOGNITION FUNCTION*/
  function techSolutionsSoeakTool() {
    if(!("webkitSpeechRecognition" in window)) {
      alertBox("❌", "ERRO", "O reconhecimento de fala não é suportado neste navegador.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    let currentMessageElement = null;
    let currentMessageParagraph = null; 
    recognition.interimResults = true;
    recognition.lang = "pt-BR";

    let isRecording = false;

    recognition.addEventListener("start", () => {
        const chatbox = document.querySelector("div.chatbox");
        const chatRowDiv = document.createElement('div');
        chatRowDiv.className = "chat-row chat-row-right";
        const chatCardDiv = document.createElement('div');
        chatCardDiv.className = "chat-card right-chat";
        const paragraph = document.createElement('p');
        const timeSpan = document.createElement('span');
        timeSpan.className = "time";
        timeSpan.textContent = today();

        chatCardDiv.appendChild(paragraph);
        chatCardDiv.appendChild(timeSpan);
        chatRowDiv.appendChild(chatCardDiv);
        
        chatbox.appendChild(chatRowDiv);
        
        currentMessageParagraph = paragraph;
        document.querySelector('.chatbox').scrollTop = document.querySelector('.chatbox').scrollHeight;
    });


    recognition.addEventListener("result", (e) => {
      //const transcript = e.results[0][0].transcript;
      const currentTranscript = Array.from(e.results)
        .map(result => result[0].transcript)
        .join('');
      if(currentMessageParagraph) {
        currentMessageParagraph.textContent = currentTranscript;
      }
      document.querySelector('.chatbox').scrollTop = document.querySelector('.chatbox').scrollHeight;
    });

    recognition.addEventListener("erro", (e) => {
      alertBox("❌", "ERRO", "Erro no reconhecimento de fala.");
      console.error(e.error);
      isRecording = false;
      currentMessageParagraph = null;
      document.querySelector("div.recording-stage").classList.remove("recording-stage-display");
      document.querySelector("div.recording-stage").innerHTML = "";
      document.querySelector("div.chat-gears").classList.remove("chat-gears-out-of-stage");
      document.querySelector("div.input-nav > p").classList.remove("chat-gears-out-of-stage");
    });

    recognition.addEventListener("end", (e) => {
      currentMessageElement = null;
      document.querySelector("div.recording-stage").classList.remove("recording-stage-display");
      document.querySelector("div.recording-stage").innerHTML = "";
      document.querySelector("div.chat-gears").classList.remove("chat-gears-out-of-stage");
      document.querySelector("div.input-nav > p").classList.remove("chat-gears-out-of-stage");
    });

    if(!isRecording) {
      recognition.start();
      isRecording = true;
    }else {
      recognition.stop();
      isRecording = false;
    }
  }
}