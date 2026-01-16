const knowledgeBaseData = "/js/knowledge-base-data.json";
let allArticles = [];

const tableBody = document.querySelector("#articlesTableBody");
const filterButtons = document.querySelectorAll(".filter-btn");
const articleSearch = document.querySelector("#articleSearch");

// 1. Carregamento inicial
const loadArticles = () => {
  fetch(knowledgeBaseData)
    .then(response => {
      if (!response.ok) throw new Error("Error loading data");
      return response.json();
    })
    .then(articles => {
      allArticles = articles;
      updateStats();
      applyFilters();
    })
    .catch(error => {
      console.error("Error loading articles:", error);
      tableBody.innerHTML = `<tr><td colspan="5" class="no-data">Error loading articles data.</td></tr>`;
    });
};

// 2. Estatísticas
const updateStats = () => {
  const categoriesData = { technical: 0, troubleshooting: 0, process: 0, product: 0 };

  allArticles.forEach(article => {
    const categories = Array.isArray(article.category) ? article.category : [article.category];
    categories.forEach(cat => {
      const catLower = cat.toLowerCase();
      if (categoriesData.hasOwnProperty(catLower)) categoriesData[catLower]++;
    });
  });

  const totalArticles = Object.values(categoriesData).reduce((acc, val) => acc + val, 0);

  const updateEl = (id, val) => {
    const el = document.getElementById(id);
    if(el) el.textContent = val;
  };

  updateEl('totalArticles', totalArticles);
  updateEl('technicalArticles', categoriesData.technical);
  updateEl('troubleshootingArticles', categoriesData.troubleshooting);
  updateEl('processArticles', categoriesData.process);
  updateEl('productArticles', categoriesData.product);

  const updateProgressBar = (barId, value) => {
    const bar = document.getElementById(barId);
    if(bar && totalArticles > 0) {
      bar.style.width = `${(value / totalArticles) * 100}%`;
      bar.style.transition = 'width 0.5s ease-in-out';
    }
  };

  updateProgressBar('technicalBar', categoriesData.technical);
  updateProgressBar('troubleshootingBar', categoriesData.troubleshooting);
  updateProgressBar('processBar', categoriesData.process);
  updateProgressBar('productBar', categoriesData.product);
};

// 3. Filtros
const applyFilters = () => {
  const searchTerm = articleSearch.value.toLowerCase().trim();
  const activeBtn = document.querySelector(".filter-btn.active");
  const categoryFilter = activeBtn ? activeBtn.getAttribute("data-filter") : "all";

  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm) ||
                          article.question.toLowerCase().includes(searchTerm) ||
                          article.answer.toLowerCase().includes(searchTerm) ||
                          article.author.toLowerCase().includes(searchTerm) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchTerm));

    const categories = Array.isArray(article.category) ? article.category : [article.category];
    const matchesCategory = categoryFilter === "all" || categories.includes(categoryFilter);

    return matchesSearch && matchesCategory;
  });

  renderTable(filteredArticles);
};

// 4. Renderização da Tabela
const renderTable = (articlesToDisplay) => {
  tableBody.innerHTML = "";

  if (articlesToDisplay.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="no-data">No articles found with these criteria.</td></tr>`;
    return;
  }

  articlesToDisplay.forEach((article, index) => {
    const categories = Array.isArray(article.category) ? article.category : [article.category];
    const categoryHTML = categories.map(cat => `<span class="role-badge ${getCategoryClass(cat)}">${cat}</span>`).join(' ');

    const tagsHTML = article.tags.slice(0, 3).map(tag => `<span class="tag-badge">${tag}</span>`).join('');
    const moreTagsCount = article.tags.length > 3 ? `<span class="more-tags">+${article.tags.length - 3}</span>` : '';

    tableBody.innerHTML += `
      <tr data-index="${index}" class="kb-table-row">
        <td>
          <div class="article-title-cell">
            <div class="article-title">${article.title}</div>
            <div class="article-excerpt">${article.question}</div>
          </div>
        </td>
        <td><code class="ldap-code">${article.author}</code></td>
        <td>${categoryHTML}</td>
        <td>
          <div class="tags-wrapper">
            ${tagsHTML}
            ${moreTagsCount}
          </div>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon edit-btn" data-index="${index}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-icon delete-btn" data-index="${index}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </td>
      </tr>`;
  });

  attachEventListeners();
};

// 5. Edição Inline
const showEditInline = (row, index, btn) => {
  closeAllEdits();

  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  btn.classList.add("active-editing");

  const article = allArticles[index];
  const categories = Array.isArray(article.category) ? article.category : [article.category];
  const categoryOptionsHTML = ['Technical', 'Troubleshooting', 'Process', 'Product'].map(cat =>
    `<option value="${cat}" ${categories.includes(cat) ? 'selected' : ''}>${cat}</option>`
  ).join('');

  const editRow = document.createElement("tr");
  editRow.classList.add("edit-row-active");

  editRow.innerHTML = `
    <td colspan="5">
      <form id="inlineEditForm" class="edit-form-container">
        <div class="edit-grid">
          <input type="text" id="editTitle" value="${article.title}" placeholder="Article Title" class="full-width" />
          <input type="text" id="editQuestion" value="${article.question}" placeholder="Question" class="full-width" />
          <input type="text" id="editAuthor" value="${article.author}" placeholder="Author Name" />
          <select id="editCategory" multiple>${categoryOptionsHTML}</select>
          <div id="editTagsContainer" class="edit-tags-box"></div>
          <textarea id="editAnswer" class="full-width-textarea" placeholder="Answer">${article.answer}</textarea>
        </div>
        <button type="submit" class="update-btn">Update Article</button>
      </form>
    </td>
  `;

  row.parentNode.insertBefore(editRow, row.nextSibling);

  // Lógica de Tags Interativa
  let selectedTags = [...article.tags];
  const tagsContainer = document.getElementById('editTagsContainer');

  const renderTags = () => {
    tagsContainer.innerHTML = '';
    selectedTags.forEach((tag, idx) => {
      const tagEl = document.createElement('span');
      tagEl.className = 'interactive-tag';
      tagEl.innerHTML = `${tag} <span class="remove-tag-btn">&times;</span>`;
      tagEl.querySelector('.remove-tag-btn').onclick = () => { selectedTags.splice(idx, 1); renderTags(); };
      tagsContainer.appendChild(tagEl);
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = selectedTags.length === 0 ? 'Type tags...' : '';
    input.onkeydown = (e) => {
      const val = input.value.trim().replace(/,/g, '');
      if ((e.key === 'Enter' || e.key === ',') && val) {
        e.preventDefault();
        if (!selectedTags.includes(val)) { selectedTags.push(val); renderTags(); }
      } else if (e.key === 'Backspace' && !input.value && selectedTags.length) {
        selectedTags.pop(); renderTags();
      }
    };
    tagsContainer.appendChild(input);
    tagsContainer.onclick = () => input.focus();
  };

  renderTags();

  document.querySelector("#inlineEditForm").onsubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...article,
      title: document.querySelector("#editTitle").value,
      question: document.querySelector("#editQuestion").value,
      answer: document.querySelector("#editAnswer").value,
      author: document.querySelector("#editAuthor").value,
      category: Array.from(document.querySelector("#editCategory").selectedOptions).map(o => o.value),
      tags: selectedTags
    };
    allArticles[index] = updated;
    if(typeof alertBox === "function") alertBox("✅", "Success!", `Article updated!`);
    closeAllEdits(); updateStats(); applyFilters();
  };
};

// 6. Helpers e Listeners
const getCategoryClass = (category) => {
  const classes = { 'Technical': 'role-sme', 'Troubleshooting': 'role-qa', 'Process': 'role-tl', 'Product': 'role-agent' };
  return classes[category] || 'role-default';
};

const closeAllEdits = () => {
  const existing = document.querySelector(".edit-row-active");
  if (existing) existing.remove();
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
    btn.classList.remove("active-editing");
  });
};

const attachEventListeners = () => {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const row = btn.closest("tr");
      const index = parseInt(btn.dataset.index);
      btn.classList.contains("active-editing") ? closeAllEdits() : showEditInline(row, index, btn);
    };
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index);
      const article = allArticles[index];
      if(typeof promptBox === "function") {
        promptBox("⚠️", "Warning", `Delete <b>${article.title}</b>?`);
        document.querySelector("#alert a[title='Yes']").onclick = () => {
          allArticles.splice(index, 1);
          updateStats(); applyFilters();
          document.querySelector("#alert").classList.remove("alert-container");
          document.querySelector("#alert").innerHTML = "";
          if(typeof alertBox === "function") alertBox("✅", "Deleted!", "Article removed.");
        };
        document.querySelector("#alert a[title='Cancel']").onclick = () => {
          document.querySelector("#alert").classList.remove("alert-container");
          document.querySelector("#alert").innerHTML = "";
        };
      }
    };
  });
};

articleSearch.oninput = applyFilters;
filterButtons.forEach(btn => {
  btn.onclick = () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
  };
});

loadArticles();