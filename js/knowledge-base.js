const knowledgeBaseData = "/js/knowledge-base-data.json";
let allArticles = [];

const tableBody = document.querySelector("#articlesTableBody");
const filterButtons = document.querySelectorAll(".filter-btn");
const articleSearch = document.querySelector("#articleSearch");

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

const updateStats = () => {
  updateCategoriesOverview();
};

const updateCategoriesOverview = () => {
  const categoriesData = {
    technical: 0,
    troubleshooting: 0,
    process: 0,
    product: 0
  };

  allArticles.forEach(article => {
    const categories = Array.isArray(article.category) ? article.category : [article.category];
    categories.forEach(cat => {
      const catLower = cat.toLowerCase();
      if (catLower === "technical") categoriesData.technical++;
      if (catLower === "troubleshooting") categoriesData.troubleshooting++;
      if (catLower === "process") categoriesData.process++;
      if (catLower === "product") categoriesData.product++;
    });
  });

  const totalArticles = Object.values(categoriesData).reduce((acc, val) => acc + val, 0);

  if(document.getElementById('totalArticles')) {
    document.getElementById('totalArticles').textContent = totalArticles;
  }
  if(document.getElementById('technicalArticles')) {
    document.getElementById('technicalArticles').textContent = categoriesData.technical;
  }
  if(document.getElementById('troubleshootingArticles')) {
    document.getElementById('troubleshootingArticles').textContent = categoriesData.troubleshooting;
  }
  if(document.getElementById('processArticles')) {
    document.getElementById('processArticles').textContent = categoriesData.process;
  }
  if(document.getElementById('productArticles')) {
    document.getElementById('productArticles').textContent = categoriesData.product;
  }

  const updateProgressBar = (barId, value) => {
    const bar = document.getElementById(barId);
    if(bar && totalArticles > 0) {
      const percentage = (value / totalArticles) * 100;
      bar.style.width = `${percentage}%`;
      bar.style.transition = 'width 0.5s ease-in-out';
    }
  };

  updateProgressBar('technicalBar', categoriesData.technical);
  updateProgressBar('troubleshootingBar', categoriesData.troubleshooting);
  updateProgressBar('processBar', categoriesData.process);
  updateProgressBar('productBar', categoriesData.product);
};

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

articleSearch.addEventListener("input", applyFilters);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    applyFilters();
  });
});

const getCategoryClass = (category) => {
  const classes = {
    'Technical': 'role-sme',
    'Troubleshooting': 'role-qa',
    'Process': 'role-tl',
    'Product': 'role-agent'
  };
  return classes[category] || 'role-default';
};

const renderTable = (articlesToDisplay) => {
  tableBody.innerHTML = "";

  if (articlesToDisplay.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="no-data">No articles found with these criteria.</td></tr>`;
    return;
  }

  articlesToDisplay.forEach((article, index) => {
    const categories = Array.isArray(article.category) ? article.category : [article.category];
    const categoryHTML = categories.map(cat => {
      const categoryClass = getCategoryClass(cat);
      return `<span class="role-badge ${categoryClass}">${cat}</span>`;
    }).join(' ');

    const tagsHTML = article.tags.slice(0, 3).map(tag =>
      `<span class="tag" style="background: #E0F2FE; color: #0369A1; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-right: 4px;">${tag}</span>`
    ).join('');

    const moreTagsCount = article.tags.length > 3 ? `<span style="font-size: 11px; color: #6B7280;">+${article.tags.length - 3}</span>` : '';

    tableBody.innerHTML += `
      <tr data-index="${index}">
        <td>
          <div style="max-width: 350px;">
            <div style="font-weight: 600; color: #1F2937; margin-bottom: 4px;">${article.title}</div>
            <div style="font-size: 12px; color: #6B7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${article.question}</div>
          </div>
        </td>
        <td>
          <span style="font-size: 13px; color: #374151;">${article.author}</span>
        </td>
        <td>${categoryHTML}</td>
        <td>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
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

const closeAllEdits = () => {
  const existingForm = document.querySelector(".edit-row-active");
  if (existingForm) {
    existingForm.remove();
  }

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
    btn.classList.remove("active-editing");
  });
};

const showEditInline = (row, index, btn) => {
  closeAllEdits();

  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  btn.classList.add("active-editing");

  const article = allArticles[index];
  const categories = Array.isArray(article.category) ? article.category : [article.category];

  const editRow = document.createElement("tr");
  editRow.classList.add("edit-row-active");

  editRow.innerHTML = `
    <td colspan="5">
      <form id="inlineEditForm" style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
          <input type="text" id="editTitle" value="${article.title}" placeholder="Article Title" style="grid-column: span 2; padding: 12px; border: 1px solid #D1D5DB; border-radius: 8px;" />
          <input type="text" id="editQuestion" value="${article.question}" placeholder="Question" style="grid-column: span 2; padding: 12px; border: 1px solid #D1D5DB; border-radius: 8px;" />
          <input type="text" id="editAuthor" value="${article.author}" placeholder="Author Name" style="padding: 12px; border: 1px solid #D1D5DB; border-radius: 8px;" />
          <div id="editCategoryContainer" style="padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 8px; background: white; min-height: 42px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; cursor: text;"></div>
          <div id="editTagsContainer" style="grid-column: span 2; padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 8px; background: white; min-height: 42px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; cursor: text;"></div>
        </div>
        <textarea id="editAnswer" placeholder="Answer" style="width: 100%; min-height: 150px; padding: 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-family: inherit; margin-bottom: 15px;">${article.answer}</textarea>
        <button type="submit" class="btn-primary" style="padding: 10px 20px; background: #3B82F6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">Update Article</button>
      </form>
    </td>
  `;

  row.parentNode.insertBefore(editRow, row.nextSibling);

  let selectedCategories = [...categories];
  let selectedTags = [...article.tags];

  const categoryContainer = document.getElementById('editCategoryContainer');
  const tagsContainer = document.getElementById('editTagsContainer');

  const createTagElement = (text, onRemove) => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.style.cssText = 'background: #E0F2FE; color: #0369A1; padding: 4px 10px; border-radius: 4px; font-size: 13px; display: flex; align-items: center; gap: 6px;';
    tag.innerHTML = `${text} <span style="cursor: pointer; font-weight: bold;">&times;</span>`;
    tag.querySelector('span').onclick = onRemove;
    return tag;
  };

  const renderCategories = () => {
    categoryContainer.innerHTML = '';
    selectedCategories.forEach((cat, idx) => {
      categoryContainer.appendChild(createTagElement(cat, () => {
        selectedCategories.splice(idx, 1);
        renderCategories();
      }));
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = selectedCategories.length === 0 ? 'Type category and press Enter' : '';
    input.style.cssText = 'border: none; outline: none; flex: 1; min-width: 150px; font-size: 14px;';

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        e.preventDefault();
        const val = input.value.trim();
        if (!selectedCategories.includes(val)) {
          selectedCategories.push(val);
          renderCategories();
        }
      } else if (e.key === 'Backspace' && input.value === '' && selectedCategories.length > 0) {
        selectedCategories.pop();
        renderCategories();
      }
    });

    categoryContainer.appendChild(input);
    categoryContainer.onclick = () => input.focus();
  };

  const renderTags = () => {
    tagsContainer.innerHTML = '';
    selectedTags.forEach((tag, idx) => {
      tagsContainer.appendChild(createTagElement(tag, () => {
        selectedTags.splice(idx, 1);
        renderTags();
      }));
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = selectedTags.length === 0 ? 'Type tags and press Enter or comma' : '';
    input.style.cssText = 'border: none; outline: none; flex: 1; min-width: 150px; font-size: 14px;';

    input.addEventListener('keydown', (e) => {
      const value = input.value.trim();
      if ((e.key === 'Enter' || e.key === ',') && value) {
        e.preventDefault();
        const cleanValue = value.replace(/,/g, '');
        if (cleanValue && !selectedTags.includes(cleanValue)) {
          selectedTags.push(cleanValue);
          renderTags();
        }
      } else if (e.key === 'Backspace' && input.value === '' && selectedTags.length > 0) {
        selectedTags.pop();
        renderTags();
      }
    });

    tagsContainer.appendChild(input);
    tagsContainer.onclick = () => input.focus();
  };

  renderCategories();
  renderTags();

  document.querySelector("#inlineEditForm").onsubmit = function(e) {
    e.preventDefault();

    const updatedArticle = {
      title: document.querySelector("#editTitle").value,
      question: document.querySelector("#editQuestion").value,
      answer: document.querySelector("#editAnswer").value,
      author: document.querySelector("#editAuthor").value,
      category: selectedCategories,
      tags: selectedTags
    };

    allArticles[index] = updatedArticle;

    if(typeof alertBox === "function") {
      alertBox("✅", "Success!", `Article <b>${updatedArticle.title}</b> has been updated!`);
    }

    closeAllEdits();
    updateStats();
    applyFilters();
  };
};

const attachEventListeners = () => {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(btn.getAttribute("data-index"));
      const row = btn.closest("tr");

      if (btn.classList.contains("active-editing")) {
        closeAllEdits();
      } else {
        showEditInline(row, index, btn);
      }
    });
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(btn.getAttribute("data-index"));
      const article = allArticles[index];

      if(typeof promptBox === "function") {
        promptBox(
          "⚠️",
          "Warning",
          `Do you really want to delete the article <b>${article.title}</b>? This action cannot be undone.`
        );

        const btnYes = document.querySelector("#alert a[title='Yes']");
        const btnCancel = document.querySelector("#alert a[title='Cancel']");

        btnYes.onclick = () => {
          allArticles.splice(index, 1);

          updateStats();
          applyFilters();

          document.querySelector("#alert").classList.remove("alert-container");
          document.querySelector("#alert").innerHTML = "";

          if(typeof alertBox === "function") {
            alertBox("✅", "Success!", `Article <b>${article.title}</b> has been deleted!`);
          }
        };

        btnCancel.onclick = () => {
          document.querySelector("#alert").classList.remove("alert-container");
          document.querySelector("#alert").innerHTML = "";
        };
      }
    });
  });
};

loadArticles();
