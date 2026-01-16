/**
 * chat.js - Chat Interface and AI Search Functionality
 * Handles chat interface, message rendering, voice recognition, and knowledge base search
 */

/* ============================================
   DATA LOADING
   ============================================ */

const knowledgeBaseUrl = "/js/knowledge-base-data.json";
let searchData = [];

/**
 * Loads knowledge base data for AI responses
 */
const loadKnowledgeBase = async () => {
  try {
    const data = await fetchJSON(knowledgeBaseUrl);
    if (data) {
      searchData = data;
      console.log("Database has been loaded successfully!");
    }
  } catch (error) {
    console.error("Error loading knowledge base:", error);
  }
};

/* ============================================
   AI SEARCH FUNCTIONALITY
   ============================================ */

/**
 * Searches knowledge base for matching answer
 * @param {string} userInput - User's question or search term
 * @returns {string} Answer from knowledge base or default message
 */
const findAnswer = (userInput) => {
  const questionInput = userInput.toLowerCase();
  const results = searchData.find(item =>
    item.question.toLowerCase().includes(questionInput) ||
    item.tags.some(tag => questionInput.includes(tag.toLowerCase()))
  );

  if (results) {
    return results.answer;
  } else {
    return "Sorry, I could not find the answer to that question. Please try again or ask another.";
  }
};

/* ============================================
   CHAT UI MANAGEMENT
   ============================================ */

const chatbox = document.querySelector('.chatbox');
const chatForm = document.querySelector("form.chat-form");
const textarea = document.querySelector("form.chat-form textarea");
const micButton = document.querySelector("button.mic");
const sendButton = document.querySelector("button.send");

/**
 * Prevents default form submission
 */
const preventFormSubmit = () => {
  if (chatForm) {
    chatForm.addEventListener("submit", function(e) {
      e.preventDefault();
    });
  }
};

/**
 * Initializes chat interface in disabled state
 */
const initializeChatUI = () => {
  if (!chatbox || !textarea || !micButton || !sendButton) {
    return;
  }

  chatbox.scrollTop = chatbox.scrollHeight;
  textarea.disabled = true;
  micButton.disabled = true;
  sendButton.disabled = true;
  micButton.classList.remove("mic");
  micButton.classList.add("fakeMic");

  const inputNav = document.querySelector("div.input-nav");
  if (inputNav) {
    inputNav.style.cursor = "not-allowed";
  }

  textarea.style.cursor = "not-allowed";
  sendButton.style.cursor = "not-allowed";
};

/**
 * Enables chat interface for user interaction
 */
const enableChatUI = () => {
  if (!textarea || !micButton || !sendButton) {
    return;
  }

  textarea.disabled = false;
  micButton.disabled = false;
  sendButton.disabled = false;
  micButton.classList.remove("fakeMic");
  micButton.classList.add("mic");

  const inputNav = document.querySelector("div.input-nav");
  if (inputNav) {
    inputNav.style.removeProperty("cursor");
  }

  textarea.style.removeProperty("cursor");
  sendButton.style.removeProperty("cursor");
};

/* ============================================
   MESSAGE RENDERING
   ============================================ */

const typingIndicator = `
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

/**
 * Renders Saga AI response in chat
 * @param {string} message - Message to display
 */
const renderSagaMessage = (message) => {
  const typingIndicator = document.querySelector(".chat-row-last");
  if (typingIndicator) {
    typingIndicator.remove();
  }

  const formattedMessage = message.replace(/\n/g, '<br>');

  if (chatbox) {
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
          <span class="time">${getCurrentTime()}</span>
        </div>
      </div>
    `;
    chatbox.scrollTop = chatbox.scrollHeight;
  }
};

/**
 * Renders user message in chat
 * @param {string} message - User's message text
 */
const renderUserMessage = (message) => {
  if (!message || message.trim() === "") {
    return;
  }

  const messageLayout = `
    <div class="chat-row chat-row-right">
      <div class="chat-card right-chat">
        <p>${message}</p>
        <span class="time">${getCurrentTime()}</span>
      </div>
    </div>
  `;

  if (chatbox && textarea) {
    chatbox.innerHTML += messageLayout;
    textarea.value = "";
    micButton.classList.remove("mic-off");
    textarea.classList.remove("expanded");
    chatbox.scrollTop = chatbox.scrollHeight;
  }
};

/**
 * Processes user message and triggers AI response
 * @param {string} message - User's message text
 */
const processUserMessage = (message) => {
  if (!message || message.trim() === "") {
    return;
  }

  renderUserMessage(message);

  setTimeout(() => {
    if (chatbox) {
      chatbox.innerHTML += typingIndicator;
      chatbox.scrollTop = chatbox.scrollHeight;

      setTimeout(() => {
        const response = findAnswer(message);
        renderSagaMessage(response);
      }, 1500);
    }
  }, 500);
};

/* ============================================
   VOICE RECORDING
   ============================================ */

let startCountdown = 3;
let counter = startCountdown;
let countdown;

/**
 * Initializes speech recognition for voice input
 */
const initializeSpeechRecognition = () => {
  if (!("webkitSpeechRecognition" in window)) {
    alertBox("❌", "ERROR", "Speech recognition is not supported in this browser.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  let currentMessageParagraph = null;
  let finalTranscript = "";

  recognition.interimResults = true;
  recognition.lang = "pt-BR";

  recognition.addEventListener("start", () => {
    const chatRowDiv = document.createElement('div');
    chatRowDiv.className = "chat-row chat-row-right";
    const chatCardDiv = document.createElement('div');
    chatCardDiv.className = "chat-card right-chat";
    const paragraph = document.createElement('p');
    const timeSpan = document.createElement('span');
    timeSpan.className = "time";
    timeSpan.textContent = getCurrentTime();

    chatCardDiv.appendChild(paragraph);
    chatCardDiv.appendChild(timeSpan);
    chatRowDiv.appendChild(chatCardDiv);
    if (chatbox) {
      chatbox.appendChild(chatRowDiv);
    }

    currentMessageParagraph = paragraph;
    if (chatbox) {
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  });

  recognition.addEventListener("result", (e) => {
    const currentTranscript = Array.from(e.results)
      .map(result => result[0].transcript)
      .join('');

    if (currentMessageParagraph) {
      currentMessageParagraph.textContent = currentTranscript;
    }

    finalTranscript = currentTranscript;
    if (chatbox) {
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  });

  recognition.addEventListener("end", () => {
    const recordingStage = document.querySelector("div.recording-stage");
    if (recordingStage) {
      recordingStage.classList.remove("recording-stage-display");
      recordingStage.innerHTML = "";
    }

    const chatGears = document.querySelector("div.chat-gears");
    const inputNavParagraph = document.querySelector("div.input-nav > p");
    if (chatGears) {
      chatGears.classList.remove("chat-gears-out-of-stage");
    }
    if (inputNavParagraph) {
      inputNavParagraph.classList.remove("chat-gears-out-of-stage");
    }

    if (finalTranscript.trim() !== "") {
      setTimeout(() => {
        if (chatbox) {
          chatbox.innerHTML += typingIndicator;
          chatbox.scrollTop = chatbox.scrollHeight;

          setTimeout(() => {
            const response = findAnswer(finalTranscript);
            renderSagaMessage(response);
          }, 1500);
        }
      }, 500);
    }
  });

  recognition.addEventListener("error", (e) => {
    console.error("Speech recognition error:", e.error);
  });

  recognition.start();
};

/**
 * Handles microphone button interactions for voice recording
 */
const setupMicrophoneButton = () => {
  if (!micButton) {
    return;
  }

  micButton.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const recordingDiv = document.querySelector("div.recording");
    if (recordingDiv) {
      recordingDiv.classList.add("show-recording");
      recordingDiv.innerHTML = `
        <div class="recording-alert">
          <h4>Iniciando gravação em</h4>
          <div class="recording-time">${counter}</div>
          <p>Mantenha pressionado para prosseguir</p>
          <p>ou solte para cancelar</p>
          <div class="triangle">
            <div class="triangle-down"></div>
          </div>
        </div>
      `;
    }

    countdown = setInterval(() => {
      counter--;
      const recordingTime = document.querySelector("div.recording-time");
      if (recordingTime) {
        recordingTime.innerText = counter;
      }

      if (counter === 0) {
        counter = startCountdown;
        clearInterval(countdown);
        if (recordingDiv) {
          recordingDiv.innerHTML = "";
        }

        const chatGears = document.querySelector("div.chat-gears");
        const inputNavParagraph = document.querySelector("div.input-nav > p");
        if (chatGears) {
          chatGears.classList.add("chat-gears-out-of-stage");
        }
        if (inputNavParagraph) {
          inputNavParagraph.classList.add("chat-gears-out-of-stage");
        }

        setTimeout(() => {
          const recordingStage = document.querySelector("div.recording-stage");
          if (recordingStage) {
            recordingStage.classList.add("recording-stage-display");
            recordingStage.innerHTML = `
              <div class="recording-button">
                <div class="fixed-circle animated">
                  <div class="stop-icon"></div>
                </div>
              </div>
            `;
          }

          initializeSpeechRecognition();

          const fixedCircle = document.querySelector("div.recording-stage div.fixed-circle");
          if (fixedCircle) {
            fixedCircle.addEventListener("click", () => {
              const recordingStage = document.querySelector("div.recording-stage");
              if (recordingStage) {
                recordingStage.classList.remove("recording-stage-display");
                recordingStage.innerHTML = "";
              }

              const chatGears = document.querySelector("div.chat-gears");
              const inputNavParagraph = document.querySelector("div.input-nav > p");
              if (chatGears) {
                chatGears.classList.remove("chat-gears-out-of-stage");
              }
              if (inputNavParagraph) {
                inputNavParagraph.classList.remove("chat-gears-out-of-stage");
              }
              counter = startCountdown;
            });
          }
        }, 500);
      }
    }, 1000);
  });

  micButton.addEventListener("mouseup", (e) => {
    e.preventDefault();
    clearInterval(countdown);
    counter = startCountdown;
    const recordingDiv = document.querySelector("div.recording");
    if (recordingDiv) {
      recordingDiv.classList.remove("show-recording");
    }
  });
};

/* ============================================
   MESSAGE INPUT HANDLERS
   ============================================ */

/**
 * Sets up keyboard and button listeners for message submission
 */
const setupMessageListeners = () => {
  if (textarea) {
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        processUserMessage(textarea.value);
      }
    });
  }

  if (sendButton) {
    sendButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (textarea) {
        processUserMessage(textarea.value);
      }
    });
  }
};

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initializes chat with welcome message
 */
const initializeChat = () => {
  initializeChatUI();
  preventFormSubmit();

  setTimeout(() => {
    if (chatbox) {
      chatbox.innerHTML = typingIndicator;
    }

    setTimeout(() => {
      renderSagaMessage("How can I help you?");
      enableChatUI();
    }, 2000);
  }, 2000);

  setupMicrophoneButton();
  setupMessageListeners();
};

loadKnowledgeBase();
initializeChat();
