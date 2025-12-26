if(window.location.href.includes("chat.html")) {
  document.querySelector("form.chat-form").addEventListener("submit", function(e) {
    e.preventDefault();
  });

  const today = () => {
    let date = new Date();
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  const chatbox = document.querySelector('.chatbox');
  let textarea = document.querySelector("form.chat-form textarea");
  let micButton = document.querySelector("button.mic");
  let sendButton = document.querySelector("button.send");

  chatbox.scrollTop = chatbox.scrollHeight;

  textarea.disabled = true;
  micButton.disabled = true;
  sendButton.disabled = true;
  micButton.classList.remove("mic");
  micButton.classList.add("fakeMic");
  document.querySelector("div.input-nav").style.cursor = "not-allowed";
  textarea.style.cursor = "not-allowed";
  sendButton.style.cursor = "not-allowed";

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

  const addSagaMessage = (message) => {
    const messageLayout = `
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
    `;

    const lastTyping = chatbox.querySelector('.chat-row-last');
    if (lastTyping) {
      lastTyping.remove();
    }

    chatbox.innerHTML += messageLayout;
    chatbox.scrollTop = chatbox.scrollHeight;
  }

  const showTyping = () => {
    const lastTyping = chatbox.querySelector('.chat-row-last');
    if (!lastTyping) {
      chatbox.innerHTML += typing;
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }

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

  const sagaIsTyping = setTimeout(() => {
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
    }, 2000)
  }, 2000);

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

  textarea.addEventListener('input', () => {
    if(textarea.value.length > 0) {
      textarea.classList.add('expanded');
      micButton.classList.add("mic-off");
    }else {
      micButton.classList.remove("mic-off");
    }
  });

  const askSaga = async (question) => {
    if (!supabaseClient) {
      addSagaMessage("Sorry, the system is not configured yet. Please contact your administrator.");
      return;
    }

    try {
      const apiUrl = `${SUPABASE_URL}/functions/v1/ask-saga`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Saga');
      }

      const data = await response.json();

      if (data.error) {
        addSagaMessage("I apologize, but I encountered an error. Please try again or contact support.");
        return;
      }

      let responseMessage = data.answer;

      if (data.sources && data.sources.length > 0) {
        responseMessage += "\n\nRelated topics you might find helpful:";
        data.sources.forEach((source, index) => {
          responseMessage += `\n${index + 1}. ${source.title}`;
        });
      }

      addSagaMessage(responseMessage);
    } catch (error) {
      console.error('Error asking Saga:', error);
      addSagaMessage("I apologize, but I'm having trouble connecting to the knowledge base. Please try again later.");
    }
  }

  const chatMessageInput = async (message) => {
    const messageText = message.trim();
    if(messageText === "") {
      return;
    }

    const messageLayout = `
      <div class="chat-row chat-row-right">
        <div class="chat-card right-chat">
          <p>${messageText}</p>
          <span class="time">${today()}</span>
        </div>
      </div>
    `;

    chatbox.innerHTML += messageLayout;
    textarea.value = "";
    micButton.classList.remove("mic-off");
    textarea.classList.remove("expanded");
    chatbox.scrollTop = chatbox.scrollHeight;

    showTyping();
    await askSaga(messageText);
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

  function techSolutionsSoeakTool() {
    if(!("webkitSpeechRecognition" in window)) {
      alertBox("Error", "", "Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    let currentMessageElement = null;
    let currentMessageParagraph = null;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let isRecording = false;
    let finalTranscript = '';

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
        chatbox.scrollTop = chatbox.scrollHeight;
    });

    recognition.addEventListener("result", (e) => {
      const currentTranscript = Array.from(e.results)
        .map(result => result[0].transcript)
        .join('');

      if(currentMessageParagraph) {
        currentMessageParagraph.textContent = currentTranscript;
        finalTranscript = currentTranscript;
      }
      chatbox.scrollTop = chatbox.scrollHeight;
    });

    recognition.addEventListener("error", (e) => {
      console.error('Speech recognition error:', e.error);
      isRecording = false;
      currentMessageParagraph = null;
      document.querySelector("div.recording-stage").classList.remove("recording-stage-display");
      document.querySelector("div.recording-stage").innerHTML = "";
      document.querySelector("div.chat-gears").classList.remove("chat-gears-out-of-stage");
      document.querySelector("div.input-nav > p").classList.remove("chat-gears-out-of-stage");
    });

    recognition.addEventListener("end", async (e) => {
      currentMessageElement = null;
      document.querySelector("div.recording-stage").classList.remove("recording-stage-display");
      document.querySelector("div.recording-stage").innerHTML = "";
      document.querySelector("div.chat-gears").classList.remove("chat-gears-out-of-stage");
      document.querySelector("div.input-nav > p").classList.remove("chat-gears-out-of-stage");

      if (finalTranscript.trim() !== '') {
        showTyping();
        await askSaga(finalTranscript);
        finalTranscript = '';
      }
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
