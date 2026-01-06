/* FORMS */
document.addEventListener("submit", function (e) {
  const form = e.target;
  const fields = form.querySelectorAll("[aria-required='true']");
  let hasError = false;
  
  fields.forEach((field) => {
    if(field.value.trim() === "" && !hasError) {
      e.preventDefault();
      hasError = true;
      const errorMsg = field.getAttribute("aria-errormessage") || "Campo obrigatório";
      alertBox("⚠️", "", errorMsg);
      field.focus();
    }
  });
}, true);

//Custom Select
const customSelect = () => {
  const allContainers = document.querySelectorAll('.custom-select-container');
  
  allContainers.forEach(container => {
    if (container.classList.contains('select-initialized')) return;
    
    // Captura os elementos principais
    const taskInput = container.querySelector('.task-input');
    const optionsList = container.querySelector('.select-options');
    const selectedTagsContainer = container.querySelector('.selected-tags');
    const hiddenInput = container.querySelector('.hidden-tasks-input');
    const trigger = container.querySelector('.select-trigger');
    const isMultiSelect = container.classList.contains('multi-select');
    
    // Verificação de segurança: só inicializa se houver o que controlar
    if(!taskInput || !optionsList) return;
    
    container.classList.add('select-initialized');
    let selectedItems = [];

    // --- LÓGICA DE SELEÇÃO (Event Delegation) ---
    // Em vez de dar loop nos LIs, ouvimos o clique no UL pai.
    // Assim, se o JSON demorar, o clique funcionará quando o item aparecer.
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

    // --- FILTRO AUTOCOMPLETE ---
    taskInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      optionsList.style.display = 'block';
      
      // Busca os LIs atuais (importante buscar aqui para pegar os injetados pelo JSON)
      const currentOptions = optionsList.querySelectorAll('li');
      currentOptions.forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(term) ? 'block' : 'none';
      });
    });

    taskInput.addEventListener('focus', () => {
      optionsList.style.display = 'block';
    });

    // --- REMOÇÃO E TAGS ---
    function renderTags() {
      container.querySelectorAll('.tag').forEach(tag => tag.remove());
      
      selectedItems.forEach((item, index) => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = `${item} <span class="remove-tag" data-index="${index}">&times;</span>`;
        selectedTagsContainer.insertBefore(tag, taskInput);
      });

      // Gerencia Placeholder e Input
      if(!isMultiSelect && selectedItems.length > 0) {
        taskInput.style.width = '0px';
        taskInput.placeholder = '';
      } else {
        taskInput.style.width = 'auto';
        const originalPlaceholder = taskInput.getAttribute('data-placeholder') || taskInput.placeholder;
        taskInput.placeholder = originalPlaceholder;
      }

      // Atualiza o Input Hidden para o Form ser enviado
      if(hiddenInput) {
        hiddenInput.value = isMultiSelect ? JSON.stringify(selectedItems) : (selectedItems[0] || "");
      }
    }

    // Clique no "X" para remover
    selectedTagsContainer.addEventListener('click', (e) => {
      if(e.target.classList.contains('remove-tag')) {
        const index = e.target.getAttribute('data-index');
        selectedItems.splice(index, 1);
        renderTags();
      }
    });

    // Backspace para remover última tag
    taskInput.addEventListener('keydown', (e) => {
      if(e.key === 'Backspace' && taskInput.value === '' && selectedItems.length > 0) {
        selectedItems.pop();
        renderTags();
      }
    });

    // Reset de filtro ao fechar/selecionar
    function resetFilter() {
      optionsList.querySelectorAll('li').forEach(opt => opt.style.display = 'block');
    }

    // Focar input ao clicar no container
    trigger.addEventListener('click', (e) => {
      if(e.target === trigger || e.target === selectedTagsContainer) {
        taskInput.focus();
      }
    });
  });
};

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
