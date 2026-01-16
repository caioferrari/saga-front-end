/**
 * formValidation.js - Form Validation and Custom Inputs
 * Contains all form validation logic, custom select components, and input masks
 */

/* ============================================
   REQUIRED FIELDS VALIDATION
   ============================================ */

/**
 * Validates required fields marked with aria-required="true"
 */
const validateRequiredFields = () => {
  document.addEventListener("submit", function (e) {
    const form = e.target;
    const fields = form.querySelectorAll("[aria-required='true']");
    let hasError = false;

    fields.forEach((field) => {
      if (field.value.trim() === "" && !hasError) {
        e.preventDefault();
        hasError = true;
        const errorMsg = field.getAttribute("aria-errormessage") || "Field Required";
        alertBox("⚠️", "", errorMsg);
        field.focus();
      }
    });
  }, true);
};

/* ============================================
   REGEX VALIDATION
   ============================================ */

/**
 * Validates specific fields using regex patterns
 */
const validateWithRegex = () => {
  document.addEventListener("submit", function (e) {
    const form = e.target;

    if (e.defaultPrevented) {
      return;
    }

    const caseIdField = document.getElementById("caseId");
    if (caseIdField) {
      const caseValue = caseIdField.value.trim();
      if (caseValue !== "") {
        const caseIdRegex = /^\d-\d{10,}$/;
        if (!caseIdRegex.test(caseValue)) {
          e.preventDefault();
          caseIdField.setAttribute("aria-invalid", "true");
          alertBox("⚠️", "", "Case ID is not valid.");
          caseIdField.focus();
          return;
        }
      }
    }

    const ga4Field = form.querySelector('[name="googleProductsGA4"]');
    if (ga4Field) {
      const ga4Value = ga4Field.value.trim();
      if (ga4Value !== "") {
        const ga4Regex = /^G-[A-Z0-9]{4,20}$/i;
        if (!ga4Regex.test(ga4Value)) {
          e.preventDefault();
          ga4Field.setAttribute("aria-invalid", "true");
          alertBox("⚠️", "", "GA4 ID is not valid.");
          ga4Field.focus();
          return;
        }
      }
    }

    const gtmField = form.querySelector('[name="googleProductsGTM"]');
    if (gtmField) {
      const gtmValue = gtmField.value.trim();
      if (gtmValue !== "") {
        const gtmRegex = /^GTM-[A-Z0-9]{4,20}$/i;
        if (!gtmRegex.test(gtmValue)) {
          e.preventDefault();
          gtmField.setAttribute("aria-invalid", "true");
          alertBox("⚠️", "", "GTM ID is not valid.");
          gtmField.focus();
          return;
        }
      }
    }

    const websiteField = form.querySelector('[name="websiteURL"]');
    if (websiteField) {
      const webValue = websiteField.value.trim();
      if (webValue !== "") {
        const webRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w-]+(\/[\w\d-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
        if (!webRegex.test(webValue)) {
          e.preventDefault();
          websiteField.setAttribute("aria-invalid", "true");
          alertBox("⚠️", "", "Website URL is not valid.");
          websiteField.focus();
          return;
        }
      }
    }
  });
};

/* ============================================
   CUSTOM SELECT COMPONENT
   ============================================ */

/**
 * Initializes custom select dropdowns with autocomplete and multi-select support
 */
const customSelect = () => {
  const allContainers = document.querySelectorAll('.custom-select-container');

  const closeAllLists = () => {
    allContainers.forEach(container => {
      const list = container.querySelector('.select-options');
      if (list) {
        list.style.display = 'none';
      }
    });
  };

  allContainers.forEach(container => {
    if (container.classList.contains('select-initialized')) {
      return;
    }

    const taskInput = container.querySelector('.task-input');
    const optionsList = container.querySelector('.select-options');
    const selectedTagsContainer = container.querySelector('.selected-tags');
    const hiddenInput = container.querySelector('.hidden-tasks-input');
    const trigger = container.querySelector('.select-trigger');
    const isMultiSelect = container.classList.contains('multi-select');

    if (!taskInput || !optionsList) {
      return;
    }

    container.classList.add('select-initialized');
    let selectedItems = [];

    optionsList.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) {
        return;
      }

      e.stopPropagation();
      const value = li.textContent;

      if (isMultiSelect) {
        if (!selectedItems.includes(value)) {
          selectedItems.push(value);
        }
      } else {
        selectedItems = [value];
      }

      renderTags();
      taskInput.value = '';
      optionsList.style.display = 'none';
      resetFilter();
    });

    taskInput.addEventListener('focus', (e) => {
      e.stopPropagation();
      closeAllLists();
      optionsList.style.display = 'block';
    });

    taskInput.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    taskInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      optionsList.style.display = 'block';

      const currentOptions = optionsList.querySelectorAll('li');
      currentOptions.forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(term) ? 'block' : 'none';
      });
    });

    const renderTags = () => {
      container.querySelectorAll('.tag').forEach(tag => tag.remove());

      selectedItems.forEach((item, index) => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `${item} <span class="remove-tag" data-index="${index}">&times;</span>`;
        selectedTagsContainer.insertBefore(tag, taskInput);
      });

      if (!isMultiSelect && selectedItems.length > 0) {
        taskInput.style.width = '2px';
        taskInput.placeholder = '';
      } else {
        taskInput.style.width = 'auto';
        const originalPlaceholder = taskInput.getAttribute('data-placeholder') || taskInput.placeholder;
        taskInput.placeholder = originalPlaceholder;
      }

      if (hiddenInput) {
        hiddenInput.value = isMultiSelect ? JSON.stringify(selectedItems) : (selectedItems[0] || "");
      }
    };

    selectedTagsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-tag')) {
        e.stopPropagation();
        const index = e.target.getAttribute('data-index');
        selectedItems.splice(index, 1);
        renderTags();
      }
    });

    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && taskInput.value === '' && selectedItems.length > 0) {
        selectedItems.pop();
        renderTags();
      }
    });

    const resetFilter = () => {
      optionsList.querySelectorAll('li').forEach(opt => opt.style.display = 'block');
    };

    trigger.addEventListener('click', (e) => {
      if (e.target === trigger || e.target === selectedTagsContainer) {
        e.stopPropagation();
        const isVisible = optionsList.style.display === 'block';
        closeAllLists();
        if (!isVisible) {
          taskInput.focus();
          optionsList.style.display = 'block';
        }
      }
    });
  });
};

if (!window.selectGlobalEventAdded) {
  document.addEventListener('click', () => {
    document.querySelectorAll('.select-options').forEach(list => {
      list.style.display = 'none';
    });
  });
  window.selectGlobalEventAdded = true;
}

/* ============================================
   CUSTOM TAG INPUT
   ============================================ */

/**
 * Initializes free-text tag input with comma/enter separation
 */
const textTagInput = () => {
  const allTextTagContainers = document.querySelectorAll('.text-tag-container');

  allTextTagContainers.forEach(container => {
    if (container.classList.contains('tags-initialized')) {
      return;
    }

    const input = container.querySelector('.tag-free-input');
    const tagsContainer = container.querySelector('.selected-tags');
    const hiddenInput = container.querySelector('.hidden-tasks-input');

    if (!input || !tagsContainer) {
      return;
    }

    container.classList.add('tags-initialized');
    let tags = [];

    const renderTags = () => {
      container.querySelectorAll('.tag').forEach(t => t.remove());

      tags.forEach((text, index) => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `${text} <span class="remove-tag" data-index="${index}">&times;</span>`;
        tagsContainer.insertBefore(tag, input);
      });

      if (hiddenInput) {
        hiddenInput.value = JSON.stringify(tags);
      }
    };

    input.addEventListener('keydown', (e) => {
      const value = input.value.trim();

      if ((e.key === ',' || e.key === 'Enter') && value !== "") {
        e.preventDefault();

        const cleanValue = value.replace(/,/g, '');

        if (cleanValue && !tags.includes(cleanValue)) {
          tags.push(cleanValue);
          renderTags();
        }
        input.value = '';
      }

      if (e.key === 'Backspace' && input.value === '' && tags.length > 0) {
        tags.pop();
        renderTags();
      }
    });

    tagsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-tag')) {
        const index = e.target.getAttribute('data-index');
        tags.splice(index, 1);
        renderTags();
      }
    });

    container.addEventListener('click', () => {
      input.focus();
    });
  });
};

/* ============================================
   FORM DATA LOADING
   ============================================ */

window.appConfigData = null;

/**
 * Loads global configuration JSON file
 * @returns {Promise<Object|null>} Configuration data or null on error
 */
const loadGlobalConfig = async () => {
  if (window.appConfigData) {
    return window.appConfigData;
  }

  try {
    const response = await fetch('/js/topics.json');
    window.appConfigData = await response.json();

    populateStaticFields();

    if (typeof initExistingTakeCards === "function") {
      initExistingTakeCards();
    }

    return window.appConfigData;
  } catch (error) {
    console.error("Error loading JSON:", error);
    return null;
  }
};

/**
 * Populates select fields with data from JSON configuration
 */
const populateStaticFields = async () => {
  const data = window.appConfigData;
  const containers = document.querySelectorAll('.custom-select-container');

  for (const container of containers) {
    const sourcePath = container.getAttribute('data-source');
    const optionsUl = container.querySelector('.select-options');
    const hiddenInput = container.querySelector('.hidden-tasks-input');

    if (hiddenInput && hiddenInput.name === "smeList") {
      try {
        const response = await fetch('/js/users.json');
        const users = await response.json();
        const activeSmes = users
          .filter(({ role, status }) => role === "SME" && status === "active")
          .map(user => user.fullName);

        if (optionsUl) {
          optionsUl.innerHTML = activeSmes.length > 0
            ? generateOptions(activeSmes)
            : `<li style="pointer-events:none; color:gray;">No active SMEs found</li>`;
          customSelect();
        }
      } catch (error) {
        if (optionsUl) {
          optionsUl.innerHTML = `<li style="pointer-events:none; color:red;">Error loading SMEs</li>`;
        }
      }
      continue;
    }

    if (sourcePath && data) {
      const list = sourcePath.split('.').reduce((obj, key) => obj?.[key], data);
      if (list && optionsUl) {
        optionsUl.innerHTML = generateOptions(list);
        customSelect();
      }
    }
  }
};

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initializes all form validation and custom input components
 */
const initializeFormValidation = () => {
  validateRequiredFields();
  validateWithRegex();
  textTagInput();
  loadGlobalConfig();
};

initializeFormValidation();
