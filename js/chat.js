/*AI*/
const url = "/js/knowledge-base-data.json";
let searchData = [];

fetch(url).then(response => response.json()).then(data => {
  searchData = data; // Armazena os dados do JSON globalmente
  console.log("Database has been loaded successfully!");
}).catch((err) => {console.log(err)});

const findAnswer = (userInput) => {
  const questionInput = userInput.toLowerCase();
  const results = searchData.find(item => 
    item.question.toLowerCase().includes(questionInput) || 
    item.tags.some(tag => questionInput.includes(tag.toLowerCase()))
  );

  if(results) {
    return results.answer;
  }else {
    return "Sorry, I could not find the answer to that question. Please try again or ask another.";
  }
}

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
  const typingIndicator = document.querySelector(".chat-row-last");
  if(typingIndicator) {
    typingIndicator.remove()
  };

  const formattedMessage = message.replace(/\n/g, '<br>');

  chatbox.innerHTML += `
    <div class="chat-row chat-row-left">
        <div class="chat-card left-chat">
        <div class="chat-user">
            <div class="avatar">
            <img src="images/saga.png" alt="Saga" />
            </div>
            <p>Saga</p>
        </div>
        <p>${formattedMessage}</p>
        <span class="time">${today()}</span>
        </div>
    </div>
    `
    chatbox.scrollTop = chatbox.scrollHeight;
}
// Initialization (Welcome message)
setTimeout(() => {
  chatbox.innerHTML = typing;
  setTimeout(() => {
    saga("How can I help you?");
    textarea.disabled = false;
    micButton.disabled = false;
    sendButton.disabled = false;
    micButton.classList.remove("fakeMic");
    micButton.classList.add("mic");
    document.querySelector("div.input-nav").style.removeProperty("cursor");
    textarea.style.removeProperty("cursor");
    sendButton.style.removeProperty("cursor");
  }, 2000);
}, 2000);

/*MESSAGE SUBMISSION*/
const chatMessageInput = (message) => {
  if(message.trim() === "") {
    return
  };
  const messageLayout = `
      <div class="chat-row chat-row-right">
      <div class="chat-card right-chat">
          <p>${message}</p>
          <span class="time">${today()}</span>
      </div>
      </div>
  `;
  
  chatbox.innerHTML += messageLayout;
  
  textarea.value = "";
  micButton.classList.remove("mic-off");
  textarea.classList.remove("expanded");
  chatbox.scrollTop = chatbox.scrollHeight;

  //Saga answering
  setTimeout(() => {
    chatbox.innerHTML += typing; // Typign animation
    chatbox.scrollTop = chatbox.scrollHeight;

    setTimeout(() => {
      const response = findAnswer(message); // Search in the JSON
      saga(response); // Show the final answer
    }, 1500); // "Thinking time"
  }, 500);
}

// Listeners de envio
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

/*SPEECH RECOGNITION FUNCTION*/
function techSolutionsSoeakTool() {
  if(!("webkitSpeechRecognition" in window)) {
    alertBox("❌", "ERRO", "O reconhecimento de fala não é suportado neste navegador.");
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  let currentMessageParagraph = null; 
  let finalTranscript = ""; // Variável para guardar o texto final falado
  
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
    const currentTranscript = Array.from(e.results)
      .map(result => result[0].transcript)
      .join('');
    
    if(currentMessageParagraph) {
      currentMessageParagraph.textContent = currentTranscript;
    }
    
    // Atualiza o texto final conforme o reconhecimento processa
    finalTranscript = currentTranscript; 
    document.querySelector('.chatbox').scrollTop = document.querySelector('.chatbox').scrollHeight;
  });

  // Evento quando a gravação termina de fato
  recognition.addEventListener("end", () => {
    document.querySelector("div.recording-stage").classList.remove("recording-stage-display");
    document.querySelector("div.recording-stage").innerHTML = "";
    document.querySelector("div.chat-gears").classList.remove("chat-gears-out-of-stage");
    document.querySelector("div.input-nav > p").classList.remove("chat-gears-out-of-stage");

    // SE houver texto capturado, dispara a resposta do Saga
    if (finalTranscript.trim() !== "") {
      setTimeout(() => {
        chatbox.innerHTML += typing; // Mostra o indicador de digitando
        chatbox.scrollTop = chatbox.scrollHeight;

        setTimeout(() => {
          const response = findAnswer(finalTranscript); // Busca no banco de dados
          saga(response); // Responde usando o layout correto (com <br> e ícone do Saga)
        }, 1500); 
      }, 500);
    }
  });

  recognition.addEventListener("error", (e) => {
    console.error(e.error);
    // Limpeza de UI em caso de erro...
  });
  
  recognition.start();
}
