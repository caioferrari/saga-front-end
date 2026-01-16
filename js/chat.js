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
 * Normalizes text by removing accents and converting to lowercase
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

/**
 * Extracts meaningful words from text (removes common stop words)
 * @param {string} text - Text to process
 * @returns {Array} Array of meaningful words
 */
const extractKeywords = (text) => {
  const stopWords = [
    'o', 'a', 'os', 'as', 'um', 'uma', 'de', 'do', 'da', 'dos', 'das',
    'em', 'no', 'na', 'nos', 'nas', 'para', 'pelo', 'pela', 'por',
    'com', 'como', 'que', 'se', 'e', 'ou', 'mas', 'eu', 'tu', 'ele',
    'ela', 'nos', 'vos', 'eles', 'elas', 'este', 'esse', 'aquele',
    'esta', 'essa', 'aquela', 'meu', 'teu', 'seu', 'nosso', 'vosso',
    'muito', 'pouco', 'todo', 'algum', 'nenhum', 'outro', 'mesmo',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
    'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were'
  ];

  const normalized = normalizeText(text);
  const words = normalized.split(/\s+/);

  return words.filter(word =>
    word.length > 2 && !stopWords.includes(word)
  );
};

/**
 * Calculates similarity score between two sets of words
 * @param {Array} words1 - First set of words
 * @param {Array} words2 - Second set of words
 * @returns {number} Similarity score (0-1)
 */
const calculateWordOverlap = (words1, words2) => {
  if (words1.length === 0 || words2.length === 0) return 0;

  const set1 = new Set(words1);
  const set2 = new Set(words2);

  let matches = 0;
  set1.forEach(word => {
    if (set2.has(word)) {
      matches++;
    }
  });

  return matches / Math.max(set1.size, set2.size);
};

/**
 * Calculates string similarity using character-level comparison
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score (0-1)
 */
const calculateStringSimilarity = (str1, str2) => {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);

  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  if (s1.includes(s2) || s2.includes(s1)) {
    return 0.8;
  }

  const bigrams1 = new Set();
  const bigrams2 = new Set();

  for (let i = 0; i < s1.length - 1; i++) {
    bigrams1.add(s1.substring(i, i + 2));
  }

  for (let i = 0; i < s2.length - 1; i++) {
    bigrams2.add(s2.substring(i, i + 2));
  }

  let intersection = 0;
  bigrams1.forEach(bigram => {
    if (bigrams2.has(bigram)) {
      intersection++;
    }
  });

  const union = bigrams1.size + bigrams2.size - intersection;
  return union > 0 ? intersection / union : 0;
};

/**
 * Scores an item from knowledge base against user input
 * @param {Object} item - Knowledge base item
 * @param {string} userInput - User's question
 * @returns {number} Relevance score
 */
const scoreItem = (item, userInput) => {
  const userKeywords = extractKeywords(userInput);
  const questionKeywords = extractKeywords(item.question);
  const titleKeywords = extractKeywords(item.title);
  const normalizedInput = normalizeText(userInput);

  let score = 0;

  const questionOverlap = calculateWordOverlap(userKeywords, questionKeywords);
  score += questionOverlap * 10;

  const titleOverlap = calculateWordOverlap(userKeywords, titleKeywords);
  score += titleOverlap * 8;

  const questionSimilarity = calculateStringSimilarity(userInput, item.question);
  score += questionSimilarity * 7;

  const titleSimilarity = calculateStringSimilarity(userInput, item.title);
  score += titleSimilarity * 5;

  item.tags.forEach(tag => {
    const tagNormalized = normalizeText(tag);
    if (normalizedInput.includes(tagNormalized)) {
      score += 6;
    }

    const tagKeywords = extractKeywords(tag);
    const tagOverlap = calculateWordOverlap(userKeywords, tagKeywords);
    score += tagOverlap * 4;
  });

  userKeywords.forEach(keyword => {
    const normalizedQuestion = normalizeText(item.question);
    const normalizedTitle = normalizeText(item.title);

    if (normalizedQuestion.includes(keyword)) {
      score += 3;
    }
    if (normalizedTitle.includes(keyword)) {
      score += 2;
    }
  });

  return score;
};

/**
 * Searches knowledge base for matching answer with improved accuracy
 * @param {string} userInput - User's question or search term
 * @returns {string} Answer from knowledge base or default message
 */
const findAnswer = (userInput) => {
  if (!userInput || userInput.trim().length < 3) {
    return "Por favor, faça uma pergunta mais específica.";
  }

  const scoredResults = searchData.map(item => ({
    item: item,
    score: scoreItem(item, userInput)
  }));

  scoredResults.sort((a, b) => b.score - a.score);

  const bestMatch = scoredResults[0];
  const threshold = 5;

  if (bestMatch && bestMatch.score >= threshold) {
    console.log(`Match found with score: ${bestMatch.score.toFixed(2)}`);
    console.log(`Question: ${bestMatch.item.question}`);
    return bestMatch.item.answer;
  } else {
    const topMatches = scoredResults.slice(0, 3).filter(r => r.score > 0);

    if (topMatches.length > 0) {
      let response = "Não encontrei uma resposta exata, mas talvez uma destas perguntas possa ajudar:\n\n";
      topMatches.forEach((match, index) => {
        response += `${index + 1}. ${match.item.question}\n`;
      });
      response += "\nPor favor, tente reformular sua pergunta ou escolha uma das opções acima.";
      return response;
    }

    return "Desculpe, não encontrei uma resposta para essa pergunta na minha base de conhecimento. Por favor, tente reformular sua pergunta ou entre em contato com um especialista.";
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
