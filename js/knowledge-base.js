const knowledgeBaseData = "/js/knowledge-base-data.json";
let allArticles = [];

const tableBody = document.querySelector("#articlesTableBody");
const filterButtons = document.querySelectorAll(".filter-btn");
const articleSearch = document.querySelector("#articleSearch");

const ICON_EDIT = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
const ICON_X = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

const loadArticles = () => {
  fetch(knowledgeBaseData)
    .then(response => {
      if (!response.ok) throw new Error("Error loading articles");
      return response.json();
    })
    .then(articles => {
      allArticles = articles;
      updateStats();
      renderTable(allArticles);
    })
    .catch(error => {
      console.error("Error loading articles:", error);
      tableBody.innerHTML = `<tr><td colspan="4" class="error">Error loading articles.</td></tr>`;
    });
};

const updateStats = () => {
  const totalArticles = allArticles.length;
  const technicalArticles = allArticles.filter(a => a.category === "Technical").length;
  const troubleshootingArticles = allArticles.filter(a => a.category === "Troubleshooting").length;

  document.querySelector("#totalArticles").textContent = totalArticles;
  document.querySelector("#technicalArticles").textContent = technicalArticles;
  document.querySelector("#troubleshootingArticles").textContent = troubleshootingArticles;
};

const applyFilters = () => {
  const searchTerm = articleSearch.value.toLowerCase().trim();
  const activeBtn = document.querySelector(".filter-btn.active");
  const categoryFilter = activeBtn ? activeBtn.getAttribute("data-filter") : "all";

  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm) ||
                          article.question.toLowerCase().includes(searchTerm) ||
                          article.answer.toLowerCase().includes(searchTerm) ||
                          article.tags.some(tag => tag.toLowerCase().includes(searchTerm));

    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;

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
    tableBody.innerHTML = `<tr><td colspan="4" class="no-data">No articles found with these criteria.</td></tr>`;
    return;
  }

  articlesToDisplay.forEach((article, index) => {
    const categoryClass = getCategoryClass(article.category);
    const tagsHTML = article.tags.slice(0, 3).map(tag =>
      `<span class="tag" style="background: #E0F2FE; color: #0369A1; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-right: 4px;">${tag}</span>`
    ).join('');

    const moreTagsCount = article.tags.length > 3 ? `<span style="font-size: 11px; color: #6B7280;">+${article.tags.length - 3}</span>` : '';

    tableBody.innerHTML += `
      <tr data-index="${index}">
        <td>
          <div style="max-width: 400px;">
            <div style="font-weight: 600; color: #1F2937; margin-bottom: 4px;">${article.title}</div>
            <div style="font-size: 12px; color: #6B7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${article.question}</div>
          </div>
        </td>
        <td><span class="role-badge ${categoryClass}">${article.category}</span></td>
        <td>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; align-items: center;">
            ${tagsHTML}
            ${moreTagsCount}
          </div>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon edit-btn" data-index="${index}">
              ${ICON_EDIT}
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
    btn.innerHTML = ICON_EDIT;
    btn.classList.remove("active-editing");
  });
};

const showEditInline = (row, index, btn) => {
  closeAllEdits();

  btn.innerHTML = ICON_X;
  btn.classList.add("active-editing");

  const article = allArticles[index];

  const editRow = document.createElement("tr");
  editRow.classList.add("edit-row-active");

  const tagsString = article.tags.join(', ');

  editRow.innerHTML = `
    <td colspan="4">
      <form id="inlineEditForm" style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
          <input type="text" id="editTitle" value="${article.title}" placeholder="Article Title" style="grid-column: span 2;" />
          <input type="text" id="editQuestion" value="${article.question}" placeholder="Question" style="grid-column: span 2;" />
          <select id="editCategory" style="padding: 12px; border: 1px solid #D1D5DB; border-radius: 8px;">
            <option value="Technical" ${article.category === 'Technical' ? 'selected' : ''}>Technical</option>
            <option value="Troubleshooting" ${article.category === 'Troubleshooting' ? 'selected' : ''}>Troubleshooting</option>
            <option value="Process" ${article.category === 'Process' ? 'selected' : ''}>Process</option>
            <option value="Product" ${article.category === 'Product' ? 'selected' : ''}>Product</option>
          </select>
          <input type="text" id="editTags" value="${tagsString}" placeholder="Tags (comma separated)" />
        </div>
        <textarea id="editAnswer" placeholder="Answer" style="width: 100%; min-height: 150px; padding: 12px; border: 1px solid #D1D5DB; border-radius: 8px; font-family: inherit; margin-bottom: 15px;">${article.answer}</textarea>
        <button type="submit" class="btn-primary">Update Article</button>
      </form>
    </td>
  `;

  row.parentNode.insertBefore(editRow, row.nextSibling);

  document.querySelector("#inlineEditForm").onsubmit = function(e) {
    e.preventDefault();

    const updatedArticle = {
      title: document.querySelector("#editTitle").value,
      question: document.querySelector("#editQuestion").value,
      answer: document.querySelector("#editAnswer").value,
      category: document.querySelector("#editCategory").value,
      tags: document.querySelector("#editTags").value.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    allArticles[index] = updatedArticle;

    if(typeof alertBox === "function") {
      alertBox("✅", "Success!", `Article <b>${updatedArticle.title}</b> has been updated!`);
    }

    closeAllEdits();
    applyFilters();
    updateStats();
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

          applyFilters();
          updateStats();

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
