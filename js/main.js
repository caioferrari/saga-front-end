/**
 * main.js - Global Utilities and Functions
 * Contains utility functions used across multiple pages
 */

/* ============================================
   GLOBAL ALERT SYSTEM
   ============================================ */

/**
 * Displays an alert box with a single OK button
 * @param {string} emojicon - Emoji or icon to display
 * @param {string} alertTitle - Title of the alert
 * @param {string} alertMessage - Message content
 */
const alertBox = (emojicon, alertTitle, alertMessage) => {
  const alertContainer = document.querySelector("#alert");

  if (alertContainer) {
    alertContainer.classList.add("alert-container");
    alertContainer.innerHTML = `
      <div class="alert">
        <span class="alert-message-icon">${emojicon}</span>
        <h1>${alertTitle}</h1>
        <p>${alertMessage}</p>
        <a title="OK">OK</a>
      </div>
    `;

    const okButton = alertContainer.querySelector("a[title='OK']");
    if (okButton) {
      okButton.addEventListener("click", () => {
        alertContainer.classList.remove("alert-container");
        alertContainer.innerHTML = "";
      });
    }
  }
};

/**
 * Displays a confirmation prompt with Yes/Cancel buttons
 * @param {string} emojicon - Emoji or icon to display
 * @param {string} alertTitle - Title of the prompt
 * @param {string} alertMessage - Message content
 */
const promptBox = (emojicon, alertTitle, alertMessage) => {
  const alertContainer = document.querySelector("#alert");

  if (alertContainer) {
    alertContainer.classList.add("alert-container");
    alertContainer.innerHTML = `
      <div class="alert">
        <span class="alert-message-icon">${emojicon}</span>
        <h1>${alertTitle}</h1>
        <p>${alertMessage}</p>
        <a title="Yes">Yes</a>
        <a title="Cancel">Cancel</a>
      </div>
    `;
  }
};

/**
 * Displays a loading indicator
 */
const loadingBox = () => {
  const alertContainer = document.querySelector("#alert");

  if (alertContainer) {
    alertContainer.classList.add("alert-container");
    alertContainer.innerHTML = `
      <div class="loading">
        <img src="../images/loading.gif" alt="Loading..." />
      </div>
    `;
  }
};

/**
 * Closes any open prompt or alert box
 */
const closePrompt = () => {
  const alertContainer = document.querySelector("#alert");

  if (alertContainer) {
    alertContainer.innerHTML = "";
    alertContainer.classList.remove("alert-container");
  }
};

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Generates HTML options list from array
 * @param {Array} list - Array of strings to convert to <li> elements
 * @returns {string} HTML string of list items
 */
const generateOptions = (list) => {
  if (!list || !Array.isArray(list)) {
    return '';
  }

  return list.map(item => `<li>${item}</li>`).join('');
};

/**
 * Formats a date string to localized format
 * @param {string} dateStr - Date string to format
 * @returns {string} Formatted date string
 */
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Returns current time in 12-hour format
 * @returns {string} Formatted time string
 */
const getCurrentTime = () => {
  const date = new Date();
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
};

/**
 * Generates user avatar initials from full name
 */
const generateAvatars = () => {
  const userAvatars = document.querySelectorAll("#userAvatar");
  const userNames = document.querySelectorAll("#userName");

  userNames.forEach((nameElement, index) => {
    const nameText = nameElement.innerText.trim();

    if (!nameText) {
      return;
    }

    const parts = nameText.split(" ");
    const initials = (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();

    if (userAvatars[index]) {
      userAvatars[index].innerHTML = initials;
    }
  });
};

/**
 * Fetches JSON data from a URL
 * @param {string} url - URL to fetch data from
 * @returns {Promise<Object|null>} Parsed JSON data or null on error
 */
const fetchJSON = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error loading data from ${url}:`, error);
    return null;
  }
};

/**
 * Applies filters to a dataset based on search term and filter criteria
 * @param {Array} dataset - Array of objects to filter
 * @param {string} searchTerm - Search term to filter by
 * @param {Array<string>} searchFields - Fields to search in
 * @param {string} filterField - Field to apply additional filter on
 * @param {string} filterValue - Value to filter by (use "all" for no filter)
 * @returns {Array} Filtered dataset
 */
const applyDatasetFilters = (dataset, searchTerm, searchFields, filterField, filterValue) => {
  return dataset.filter(item => {
    const matchesSearch = searchFields.some(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], item);
      return value && String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });

    const matchesFilter = filterValue === "all" || item[filterField] === filterValue;

    return matchesSearch && matchesFilter;
  });
};

/**
 * Updates a progress bar width based on percentage
 * @param {string} barId - ID of the progress bar element
 * @param {number} value - Current value
 * @param {number} total - Total value (for percentage calculation)
 */
const updateProgressBar = (barId, value, total) => {
  const bar = document.getElementById(barId);

  if (bar && total > 0) {
    const percentage = (value / total) * 100;
    bar.style.width = `${percentage}%`;
    bar.style.transition = 'width 0.5s ease-in-out';
  }
};

/**
 * Converts URLs in text to clickable links
 * @param {string} text - Text containing URLs
 * @returns {string} Text with URLs converted to anchor tags
 */
const linkifyText = (text) => {
  const urlRegex = /((https?:\/\/|www\.)[^\s]+|(?<!@)([a-zA-Z0-9-]+\.)+(com|net|org|edu|gov|br|io|adv\.br|me|app)[^\s]*)/gi;

  return text.replace(urlRegex, (url) => {
    const cleanUrl = url.replace(/[.,]$/, "");
    let href = cleanUrl;

    if (!cleanUrl.startsWith('http')) {
      href = `https://${cleanUrl}`;
    }

    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a>`;
  });
};

/**
 * Converts cards text content to linkable URLs
 */
const linkifyCards = () => {
  const cards = document.querySelectorAll('.dashboard-card');
  const urlRegex = /((https?:\/\/|www\.)[^\s]+|(?<!@)([a-zA-Z0-9-]+\.)+(com|net|org|edu|gov|br|io|adv\.br|me|app)[^\s]*)/gi;

  cards.forEach(card => {
    const targets = card.querySelectorAll('.case-description .text-content p, .case-website span');

    targets.forEach(target => {
      const originalHTML = target.innerHTML;

      const newHTML = originalHTML.replace(urlRegex, (url) => {
        const cleanUrl = url.replace(/[.,]$/, "");
        let href = cleanUrl;

        if (!cleanUrl.startsWith('http')) {
          href = `https://${cleanUrl}`;
        }

        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${cleanUrl}</a>`;
      });

      target.innerHTML = newHTML;
    });
  });
};

/* ============================================
   READ MORE FUNCTIONALITY
   ============================================ */

/**
 * Initializes read more/less functionality for expandable text
 */
const initializeReadMore = () => {
  const readMoreButtons = document.querySelectorAll(".read-more-btn");

  readMoreButtons.forEach(btn => {
    const container = btn.closest(".profile-actions");
    const textContent = container?.querySelector(".text-content");

    if (!textContent) {
      return;
    }

    if (textContent.scrollHeight <= textContent.clientHeight) {
      btn.style.display = "none";
    }

    btn.addEventListener("click", () => {
      container.classList.toggle("expanded");

      if (container.classList.contains("expanded")) {
        btn.textContent = "Read Less";
      } else {
        btn.textContent = "Read More";
      }
    });
  });
};

/* ============================================
   PAGE-SPECIFIC INITIALIZATION
   ============================================ */

/**
 * Handles login page animations and validation
 */
const initializeLoginPage = () => {
  const currentPath = window.location.pathname;

  if (currentPath !== "/" && currentPath !== "/index.html") {
    return;
  }

  const loginContainer = document.querySelector("div.login-container");
  if (loginContainer) {
    setTimeout(() => {
      loginContainer.classList.add("login-container-effect");
    }, 1000);
  }

  let errorsFlag = false;
  const loginForm = document.querySelector("#login");

  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      const ldapField = document.querySelector("[name='ldap']");
      const passwordField = document.querySelector("[name='password']");
      errorsFlag = false;

      if (ldapField && ldapField.value === "" && !errorsFlag) {
        e.preventDefault();
        errorsFlag = true;
        alertBox("⚠️", "", "Add your ldap");
        return;
      }

      if (passwordField && passwordField.value === "" && !errorsFlag) {
        e.preventDefault();
        errorsFlag = true;
        alertBox("⚠️", "", "Add your password");
        return;
      }
    });

    document.addEventListener("click", function(e) {
      const target = e.target;

      if (target && target.title === "OK") {
        errorsFlag = false;
      }
    });
  }
};

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initializes all global functions
 */
const initializeGlobalFunctions = () => {
  generateAvatars();
  initializeReadMore();
  initializeLoginPage();
  linkifyCards();
};

initializeGlobalFunctions();
