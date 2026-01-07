/* FORMS */
document.addEventListener("submit", function (e) {
  const form = e.target;
  const fields = form.querySelectorAll("[aria-required='true']");
  let hasError = false;
  
  fields.forEach((field) => {
    if(field.value.trim() === "" && !hasError) {
      e.preventDefault();
      hasError = true;
      const errorMsg = field.getAttribute("aria-errormessage") || "Field Required";
      alertBox("⚠️", "", errorMsg);
      field.focus();
    }
  });
}, true);

/*REGEX*/
document.addEventListener("submit", function (e) {
  const form = e.target;
  
  if (e.defaultPrevented) return;

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
      // Regex que valida o formato básico de URL
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

//CUSTOM SELECT
const customSelect = () => {
  const allContainers = document.querySelectorAll('.custom-select-container');
  
  // FUNÇÃO GLOBAL INTERNA: Fecha todas as listas abertas na página
  const closeAllLists = () => {
    allContainers.forEach(c => {
      const list = c.querySelector('.select-options');
      if (list) list.style.display = 'none';
    });
  };

  allContainers.forEach(container => {
    // 1. Evita duplicar a lógica
    if (container.classList.contains('select-initialized')) return;
    
    const taskInput = container.querySelector('.task-input');
    const optionsList = container.querySelector('.select-options');
    const selectedTagsContainer = container.querySelector('.selected-tags');
    const hiddenInput = container.querySelector('.hidden-tasks-input');
    const trigger = container.querySelector('.select-trigger');
    const isMultiSelect = container.classList.contains('multi-select');
    
    if(!taskInput || !optionsList) return;
    
    container.classList.add('select-initialized');
    let selectedItems = [];

    // --- LÓGICA DE SELEÇÃO ---
    optionsList.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;

      e.stopPropagation(); 
      const value = li.textContent;
      
      if(isMultiSelect) {
        if(!selectedItems.includes(value)) {
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

    // --- ABRIR E FECHAR (COM EXCLUSIVIDADE) ---
    taskInput.addEventListener('focus', (e) => {
      e.stopPropagation();
      closeAllLists(); // Fecha qualquer outra que esteja aberta antes
      optionsList.style.display = 'block';
    });

    taskInput.addEventListener('click', (e) => {
      e.stopPropagation(); // Impede o clique de subir para o document
    });

    // --- FILTRO AUTOCOMPLETE ---
    taskInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      optionsList.style.display = 'block';
      
      const currentOptions = optionsList.querySelectorAll('li');
      currentOptions.forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(term) ? 'block' : 'none';
      });
    });

    // --- GESTÃO DE TAGS ---
    function renderTags() {
      container.querySelectorAll('.tag').forEach(tag => tag.remove());
      
      selectedItems.forEach((item, index) => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `${item} <span class="remove-tag" data-index="${index}">&times;</span>`;
        selectedTagsContainer.insertBefore(tag, taskInput);
      });

      if(!isMultiSelect && selectedItems.length > 0) {
        taskInput.style.width = '2px';
        taskInput.placeholder = '';
      } else {
        taskInput.style.width = 'auto';
        const originalPlaceholder = taskInput.getAttribute('data-placeholder') || taskInput.placeholder;
        taskInput.placeholder = originalPlaceholder;
      }

      if(hiddenInput) {
        hiddenInput.value = isMultiSelect ? JSON.stringify(selectedItems) : (selectedItems[0] || "");
      }
    }

    selectedTagsContainer.addEventListener('click', (e) => {
      if(e.target.classList.contains('remove-tag')) {
        e.stopPropagation();
        const index = e.target.getAttribute('data-index');
        selectedItems.splice(index, 1);
        renderTags();
      }
    });

    taskInput.addEventListener('keydown', (e) => {
      if(e.key === 'Backspace' && taskInput.value === '' && selectedItems.length > 0) {
        selectedItems.pop();
        renderTags();
      }
    });

    function resetFilter() {
      optionsList.querySelectorAll('li').forEach(opt => opt.style.display = 'block');
    }

    trigger.addEventListener('click', (e) => {
      if(e.target === trigger || e.target === selectedTagsContainer) {
        e.stopPropagation();
        const isVisible = optionsList.style.display === 'block';
        closeAllLists(); // Fecha todas antes
        if (!isVisible) {
            taskInput.focus();
            optionsList.style.display = 'block';
        }
      }
    });
  });
};

// --- O SEGREDO DO "CLIQUE FORA" ---
if (!window.selectGlobalEventAdded) {
  document.addEventListener('click', () => {
    // Se clicar em qualquer lugar morto da página, fecha tudo
    document.querySelectorAll('.select-options').forEach(list => {
      list.style.display = 'none';
    });
  });
  window.selectGlobalEventAdded = true;
}

/* FORMS - formValidation.js */
// 1. Variável GLOBAL que ambos os arquivos vão ler
window.appConfigData = null; 

// 2. Função auxiliar para gerar as LIs (precisa estar aqui para os dois arquivos usarem)
const generateOptions = (list) => {
  if (!list) return '';
  let finalHTML = "";
  list.forEach((item) => {
    finalHTML += `<li>${item}</li>`;
  });
  return finalHTML;
};

// 3. Função ÚNICA para carregar o JSON
const loadGlobalConfig = async () => {
  if (window.appConfigData) return window.appConfigData; // Evita carregar 2 vezes
  
  try {
    const response = await fetch('/js/topics.json');
    window.appConfigData = await response.json();
    
    // Assim que carregar, popula o que for estático (ticket-upload.html)
    populateStaticFields();
    
    // Se estivermos no queue.html, avisa o outro script para rodar
    if (typeof initExistingTakeCards === "function") {
      initExistingTakeCards();
    }
    
    return window.appConfigData;
  } catch (error) {
    console.error("Error loading JSON:", error);
    return null;
  }
};

// 4. Popula os selects que já estão no HTML (como no ticket-upload.html)
const populateStaticFields = () => {
  const data = window.appConfigData;
  if (!data) return;

  const containers = document.querySelectorAll('.custom-select-container[data-source]');
  
  containers.forEach(container => {
    const sourcePath = container.getAttribute('data-source');
    const optionsUl = container.querySelector('.select-options');
    
    // Navega no JSON
    const list = sourcePath.split('.').reduce((obj, key) => obj?.[key], data);
    
    if (list && optionsUl) {
      // 1. Injeta os dados primeiro
      optionsUl.innerHTML = generateOptions(list);
      
      // 2. Agora que os <li> existem, chamamos a função para este container específico
      // Vamos ajustar a customSelect para aceitar um container se quisermos, 
      // mas por enquanto, chamá-la aqui resolve se ela tiver a trava de inicialização.
      customSelect(); 
    }
  });
};

// 5. Inicia o processo assim que o arquivo é lido
loadGlobalConfig();

// Inicializa automaticamente ao carregar a página
document.addEventListener('DOMContentLoaded', populateStaticFields);

/* CUSTOM TAG */
const textTagInput = () => {
  const allTextTagContainers = document.querySelectorAll('.text-tag-container');

  allTextTagContainers.forEach(container => {
    if (container.classList.contains('tags-initialized')) return;

    const input = container.querySelector('.tag-free-input');
    const tagsContainer = container.querySelector('.selected-tags');
    const hiddenInput = container.querySelector('.hidden-tasks-input');
    
    if (!input || !tagsContainer) return;

    container.classList.add('tags-initialized');
    let tags = [];

    const renderTags = () => {
      // Remove apenas os spans das tags existentes, preservando o input
      container.querySelectorAll('.tag').forEach(t => t.remove());

      tags.forEach((text, index) => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `${text} <span class="remove-tag" data-index="${index}">&times;</span>`;
        // Insere a tag antes do input para mantê-lo sempre ao final
        tagsContainer.insertBefore(tag, input);
      });

      // Sincroniza com o input oculto para o envio do form
      if (hiddenInput) {
        hiddenInput.value = JSON.stringify(tags);
      }
    };

    input.addEventListener('keydown', (e) => {
      const value = input.value.trim();

      // Gatilho: Vírgula (,) ou Enter
      // Omitimos o Espaço conforme solicitado
      if ((e.key === ',' || e.key === 'Enter') && value !== "") {
        e.preventDefault(); // Impede que a vírgula apareça no texto
        
        // Remove vírgulas residuais caso o usuário cole texto
        const cleanValue = value.replace(/,/g, '');
        
        if (cleanValue && !tags.includes(cleanValue)) {
          tags.push(cleanValue);
          renderTags();
        }
        input.value = ''; 
      }

      // Backspace para remover a última tag se o campo estiver vazio
      if (e.key === 'Backspace' && input.value === '' && tags.length > 0) {
        tags.pop();
        renderTags();
      }
    });

    // Remover tag ao clicar no X
    tagsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-tag')) {
        const index = e.target.getAttribute('data-index');
        tags.splice(index, 1);
        renderTags();
      }
    });

    // Foca o input ao clicar em qualquer parte da caixa
    container.addEventListener('click', () => {
      input.focus();
    });
  });
};

// Inicialização
document.addEventListener('DOMContentLoaded', textTagInput);
