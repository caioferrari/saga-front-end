const casesData = "/js/casesSolved.json";
let allTickets = [];

const tableBody = document.querySelector("#ticketsTableBody");
const filterButtons = document.querySelectorAll(".filter-btn");
const ticketSearch = document.querySelector("#ticketSearch");
const sagaQuickSearch = document.querySelector("#sagaQuickSearch");

// 1. Carregamento inicial
const loadTickets = () => {
  fetch(casesData)
    .then(response => {
      if (!response.ok) throw new Error("Error loading data");
      return response.json();
    })
    .then(tickets => {
      allTickets = tickets;
      updateStats();
      applyFilters();
    })
    .catch(error => {
      console.error("Error loading tickets:", error);
      tableBody.innerHTML = `<tr><td colspan="6" class="no-data">Error loading tickets data.</td></tr>`;
    });
};

// 2. Atualizar estatísticas
const updateStats = () => {
  const totalTickets = allTickets.length;

  const programs = ['Gold', 'Silver', 'Bronze', 'Live Meet', 'Titanium', 'Platinum', 'DSAT'];
  const programCounts = {};

  programs.forEach(program => {
    programCounts[program] = allTickets.filter(t => t.program === program).length;
  });

  document.querySelector("#totalTickets").textContent = totalTickets;

  document.querySelector("#goldCount").textContent = programCounts['Gold'];
  document.querySelector("#silverCount").textContent = programCounts['Silver'];
  document.querySelector("#bronzeCount").textContent = programCounts['Bronze'];
  document.querySelector("#liveMeetCount").textContent = programCounts['Live Meet'];
  document.querySelector("#titaniumCount").textContent = programCounts['Titanium'];
  document.querySelector("#platinumCount").textContent = programCounts['Platinum'];
  document.querySelector("#dsatCount").textContent = programCounts['DSAT'];

  const maxCount = Math.max(...Object.values(programCounts), 1);

  document.querySelector("#goldBar").style.width = `${(programCounts['Gold'] / maxCount) * 100}%`;
  document.querySelector("#silverBar").style.width = `${(programCounts['Silver'] / maxCount) * 100}%`;
  document.querySelector("#bronzeBar").style.width = `${(programCounts['Bronze'] / maxCount) * 100}%`;
  document.querySelector("#liveMeetBar").style.width = `${(programCounts['Live Meet'] / maxCount) * 100}%`;
  document.querySelector("#titaniumBar").style.width = `${(programCounts['Titanium'] / maxCount) * 100}%`;
  document.querySelector("#platinumBar").style.width = `${(programCounts['Platinum'] / maxCount) * 100}%`;
  document.querySelector("#dsatBar").style.width = `${(programCounts['DSAT'] / maxCount) * 100}%`;
};

// 3. Filtro Mestre (Busca e Botões)
const applyFilters = () => {
  const sagaSearchTerm = sagaQuickSearch ? sagaQuickSearch.value.toLowerCase().trim() : "";
  const ticketSearchTerm = ticketSearch ? ticketSearch.value.toLowerCase().trim() : "";
  const searchTerm = sagaSearchTerm || ticketSearchTerm;

  const activeBtn = document.querySelector(".filter-btn.active");
  const programFilter = activeBtn ? activeBtn.getAttribute("data-filter") : "all";

  const filteredTickets = allTickets.filter(ticket => {
    const matchesSearch = ticket.caseID.toLowerCase().includes(searchTerm) ||
                          ticket.name.toLowerCase().includes(searchTerm) ||
                          ticket.ldap.toLowerCase().includes(searchTerm) ||
                          ticket.helper.toLowerCase().includes(searchTerm) ||
                          ticket.description.toLowerCase().includes(searchTerm);

    const matchesProgram = programFilter === "all" || ticket.program === programFilter;

    return matchesSearch && matchesProgram;
  });

  renderTable(filteredTickets);
};

// 4. Listeners
if (ticketSearch) {
  ticketSearch.addEventListener("input", () => {
    if (sagaQuickSearch && ticketSearch.value) {
      sagaQuickSearch.value = "";
    }
    applyFilters();
  });
}

if (sagaQuickSearch) {
  sagaQuickSearch.addEventListener("input", () => {
    if (ticketSearch && sagaQuickSearch.value) {
      ticketSearch.value = "";
    }
    applyFilters();
  });
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    applyFilters();
  });
});

// 5. Helper Functions
const getProgramClass = (program) => {
  const classes = {
    'Gold': 'role-sme',
    'Silver': 'role-tl',
    'Bronze': 'role-qa',
    'Platinum': 'role-sme',
    'Titanium': 'role-sme',
    'Live Meet': 'role-agent'
  };
  return classes[program] || 'role-default';
};

const calculateWaitTime = (timeRaised, timeClosed) => {
  const raised = new Date(timeRaised);
  const closed = new Date(timeClosed);
  const diffMs = closed - raised;
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins >= 60) {
    const hours = Math.floor(diffMins / 60);
    return `${hours}h+`;
  }
  return `${diffMins}min`;
};

// 6. Renderização
const renderTable = (ticketsToDisplay) => {
  tableBody.innerHTML = "";

  if (ticketsToDisplay.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="no-data">No tickets found with these criteria.</td></tr>`;
    return;
  }

  ticketsToDisplay.forEach((ticket, index) => {
    const programClass = getProgramClass(ticket.program);
    const waitTime = calculateWaitTime(ticket.timeRaised, ticket.timeClosed);

    tableBody.innerHTML += `
      <tr data-index="${index}">
        <td>
          <code class="table-case-code">${ticket.caseID}</code>
        </td>
        <td>
          <div class="user-info">
            <div class="user-details">
              <span class="user-name">${ticket.name}</span>
              <span class="user-email">${ticket.ldap}@google.com</span>
            </div>
          </div>
        </td>
        <td><span class="role-badge ${programClass}">${ticket.program}</span></td>
        <td>
          <code class="ldap-code">${ticket.helper}</code>
        </td>
        <td>
          <span class="table-wait-time">${waitTime}</span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon view-btn" data-index="${index}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </td>
      </tr>`;
  });

  attachEventListeners();
};

// 7. Visualização de Detalhes
const closeAllViews = () => {
  const existingView = document.querySelector(".view-row-active");
  if (existingView) {
    existingView.remove();
  }

  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>`;
    btn.classList.remove("active-viewing");
  });
};

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

const showDetailsInline = (row, index, btn) => {
  if (btn.classList.contains("active-viewing")) {
    closeAllViews();
    return;
  }

  closeAllViews();

  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  btn.classList.add("active-viewing");

  const ticket = allTickets[index];
  const viewRow = document.createElement("tr");
  viewRow.classList.add("view-row-active");

  const addonsHTML = ticket.addons.map(addon => `
    <div class="addon-container">
      <div class="addon-grid">
        <div><strong>Site:</strong> <a href="${addon.site}" target="_blank" class="addon-link">${addon.site}</a></div>
        <div><strong>CMS:</strong> ${addon.CMS}</div>
        <div><strong>CID:</strong> <code class="addon-code">${addon.CID}</code></div>
        <div><strong>GA4:</strong> <code class="addon-code">${addon.GA4}</code></div>
        <div class="addon-full-width"><strong>GTM:</strong> <code class="addon-code">${addon.GTM}</code></div>
      </div>
    </div>
  `).join('');

  const solutionHTML = ticket.solution && ticket.solution.length > 0 ? ticket.solution.map(sol => `
    <div class="solution-container">
      <div class="solution-header">
        <h5 class="solution-title">Solution Details</h5>
        <span class="solution-status-badge">${sol.status}</span>
      </div>

      <div class="solution-description-section">
        <p class="solution-description-text">${sol.description}</p>
      </div>

      <div class="solution-section">
        <div class="solution-category-wrapper">
          <span class="section-label">CATEGORY</span>
          <span class="role-badge role-qa">${sol.category}</span>
        </div>
        ${sol.documentation && sol.documentation.length > 0 ? `
          <div>
            <span class="section-label-docs">DOCUMENTATION</span>
            <div class="docs-grid">
              ${sol.documentation.map((doc, idx) => `
                <a href="${doc}" target="_blank" class="doc-link">
                  <svg class="doc-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  <span class="doc-text">Documentation ${sol.documentation.length > 1 ? `#${idx + 1}` : ''}</span>
                  <svg class="doc-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      ${sol.tasks && sol.tasks.length > 0 ? `
        <div class="tasks-section">
          <span class="section-label-docs">RELATED TASKS</span>
          <div class="tasks-container">
            ${sol.tasks.map(task => `<span class="task-badge">${task}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${sol.CMS && sol.CMS.length > 0 ? `
        <div class="cms-section">
          <span class="section-label-docs">CMS PLATFORMS</span>
          <div class="cms-container">
            ${sol.CMS.map(cms => `<span class="cms-badge">${cms}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${sol.code ? `
        <div class="code-section">
          <span class="section-label-docs">CODE IMPLEMENTATION</span>
          <pre class="code-block"><code>${sol.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
        </div>
      ` : ''}
    </div>
  `).join('') : '<p class="no-solution-text">No solution details available.</p>';

  const waitTime = calculateWaitTime(ticket.timeRaised, ticket.timeClosed);

  viewRow.innerHTML = `
    <td colspan="6">
      <div class="view-details-container">
        <div class="view-grid">
          <div>
            <h4 class="view-section-title">Case Information</h4>
            <div class="view-info-card">
              <div class="view-info-item">
                <span class="view-info-label">CASE ID</span>
                <div class="view-info-value"><code class="view-code">${ticket.caseID}</code></div>
              </div>
              <div class="view-info-item">
                <span class="view-info-label">STATUS</span>
                <div class="view-info-value"><span class="status-badge status-active">${ticket.status}</span></div>
              </div>
              <div class="view-info-item">
                <span class="view-info-label">OVERHEAD</span>
                <div class="view-info-value"><span class="role-badge role-sme">${ticket.overhead}</span></div>
              </div>
              <div class="view-info-item">
                <span class="view-info-label">ON CALL</span>
                <div class="view-info-value">${ticket.onCall ? '✅ Yes' : '❌ No'}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 class="view-section-title">Timeline</h4>
            <div class="view-info-card">
              <div class="view-info-item">
                <span class="view-info-label">CASE RAISED</span>
                <div class="view-info-value-sm">${formatDate(ticket.timeRaised)}</div>
              </div>
              <div class="view-info-item">
                <span class="view-info-label">CASE TAKEN</span>
                <div class="view-info-value-sm">${formatDate(ticket.timeTaken)}</div>
              </div>
              <div class="view-info-item">
                <span class="view-info-label">CASE CLOSED</span>
                <div class="view-info-value-sm">${formatDate(ticket.timeClosed)}</div>
              </div>
              <div class="view-info-item">
                <span class="view-info-label">TOTAL WAIT TIME</span>
                <div class="view-info-value-bold">${waitTime}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="view-section-full">
          <h4 class="view-section-title">Description</h4>
          <div class="view-info-card">
            <p class="view-description">${ticket.description}</p>
          </div>
        </div>

        <div class="view-section-full">
          <h4 class="view-section-title">Technical Details</h4>
          ${addonsHTML}
        </div>

        <div class="view-section-full">
          <h4 class="view-section-title">Solution Applied</h4>
          ${solutionHTML}
        </div>
      </div>
    </td>
  `;

  row.parentNode.insertBefore(viewRow, row.nextSibling);
};

// 8. Event Listeners
const attachEventListeners = () => {
  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(btn.getAttribute("data-index"));
      const row = btn.closest("tr");
      showDetailsInline(row, index, btn);
    });
  });
};

// 9. Export Functionality
document.querySelector("#exportBtn")?.addEventListener("click", () => {
  const csvContent = "data:text/csv;charset=utf-8,"
    + "Case ID,Name,LDAP,Program,Helper,Status,Time Raised,Time Taken,Time Closed,Description\n"
    + allTickets.map(t => {
        const waitTime = calculateWaitTime(t.timeRaised, t.timeClosed);
        return `"${t.caseID}","${t.name}","${t.ldap}","${t.program}","${t.helper}","${t.status}","${formatDate(t.timeRaised)}","${formatDate(t.timeTaken)}","${formatDate(t.timeClosed)}","${t.description.replace(/"/g, '""')}"`;
      }).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `solved-tickets-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if(typeof alertBox === "function") {
    alertBox("✅", "Success!", "Tickets data exported successfully!");
  }
});

// Inicialização
loadTickets();
