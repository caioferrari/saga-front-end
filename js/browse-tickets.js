const casesData = "/js/casesSolved.json";
let allTickets = [];

const tableBody = document.querySelector("#ticketsTableBody");
const filterButtons = document.querySelectorAll(".filter-btn");
const ticketSearch = document.querySelector("#ticketSearch");

// 1. Carregamento inicialxq
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
  updateCasesOverview();
};

const updateCasesOverview = () => {
  const casesData = {
    liveMeet: allTickets.filter(t => t.program === "Live Meet").length,
    gold: allTickets.filter(t => t.program === "Gold").length,
    silver: allTickets.filter(t => t.program === "Silver").length,
    bronze: allTickets.filter(t => t.program === "Bronze").length,
    platinum: allTickets.filter(t => t.program === "Platinum").length,
    titanium: allTickets.filter(t => t.program === "Titanium").length,
    dsat: allTickets.filter(t => t.program === "DSAT").length
  };

  const totalCases = Object.values(casesData).reduce((acc, val) => acc + val, 0);

  if(document.getElementById('totalCases')) {
    document.getElementById('totalCases').textContent = totalCases;
  }
  if(document.getElementById('liveMeetCases')) {
    document.getElementById('liveMeetCases').textContent = casesData.liveMeet;
  }
  if(document.getElementById('goldCases')) {
    document.getElementById('goldCases').textContent = casesData.gold;
  }
  if(document.getElementById('silverCases')) {
    document.getElementById('silverCases').textContent = casesData.silver;
  }
  if(document.getElementById('bronzeCases')) {
    document.getElementById('bronzeCases').textContent = casesData.bronze;
  }
  if(document.getElementById('platinumCases')) {
    document.getElementById('platinumCases').textContent = casesData.platinum;
  }
  if(document.getElementById('titaniumCases')) {
    document.getElementById('titaniumCases').textContent = casesData.titanium;
  }
  if(document.getElementById('dsatCases')) {
    document.getElementById('dsatCases').textContent = casesData.dsat;
  }

  const updateProgressBar = (barId, value) => {
    const bar = document.getElementById(barId);
    if(bar && totalCases > 0) {
      const percentage = (value / totalCases) * 100;
      bar.style.width = `${percentage}%`;
      bar.style.transition = 'width 0.5s ease-in-out';
    }
  };

  updateProgressBar('liveMeetBar', casesData.liveMeet);
  updateProgressBar('goldBar', casesData.gold);
  updateProgressBar('silverBar', casesData.silver);
  updateProgressBar('bronzeBar', casesData.bronze);
  updateProgressBar('platinumBar', casesData.platinum);
  updateProgressBar('titaniumBar', casesData.titanium);
  updateProgressBar('dsatBar', casesData.dsat);
};

// 3. Filtro Mestre (Busca e Botões)
const applyFilters = () => {
  const searchTerm = ticketSearch.value.toLowerCase().trim();
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
ticketSearch.addEventListener("input", applyFilters);

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
    'Gold': 'gold',
    'Silver': 'silver',
    'Bronze': 'bronze',
    'Platinum': 'platinum',
    'Titanium': 'titanium',
    'Live Meet': 'live-meet',
    'DSAT' : 'qa'
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
          <code class="case-id-tag">${ticket.caseID}</code>
        </td>
        <td>
          <div class="agent-col-wrapper">
            <div class="agent-name-main">${ticket.name}</div>
            <div class="agent-ldap-sub">@${ticket.ldap}</div>
          </div>
        </td>
        <td><span class="role-badge program-badge ${programClass}">${ticket.program}</span></td>
        <td>
          <code class="ldap-code">${ticket.helper}</code>
        </td>
        <td>
          <span class="wait-time-style">${waitTime}</span>
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
      <div class="addon-inner-grid">
        <div><strong>Site:</strong> <a href="${addon.site}" target="_blank">${addon.site}</a></div>
        <div><strong>CMS:</strong> ${addon.CMS}</div>
        <div><strong>CID:</strong> <code class="case-id-tag" style="background: #E5E7EB; margin: 0; padding: 2px 6px;">${addon.CID}</code></div>
        <div><strong>GA4:</strong> <code class="case-id-tag" style="background: #E5E7EB; margin: 0; padding: 2px 6px;">${addon.GA4}</code></div>
        <div style="grid-column: span 2;"><strong>GTM:</strong> <code class="case-id-tag" style="background: #E5E7EB; margin: 0; padding: 2px 6px;">${addon.GTM}</code></div>
      </div>
    </div>
  `).join('');

  const solutionHTML = ticket.solution && ticket.solution.length > 0 ? ticket.solution.map(sol => `
    <div class="solution-card-box">
      <div class="solution-header-flex">
        <h5>Solution Details</h5>
        <span class="status-badge" style="background: #D1FAE5; color: #065F46; border-radius: 12px; padding: 4px 12px; font-size: 12px;">${sol.status}</span>
      </div>

      <div style="margin-bottom: 16px;">
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
        <div style="margin-bottom: 16px;">
          <span class="section-label">RELATED TASKS</span>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${sol.tasks.map(task => `<span style="background: #EFF6FF; color: #1E40AF; padding: 4px 10px; border-radius: 6px; font-size: 12px;">${task}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${sol.CMS && sol.CMS.length > 0 ? `
        <div style="margin-bottom: 16px;">
          <span class="section-label">CMS PLATFORMS</span>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${sol.CMS.map(cms => `<span style="background: #F3F4F6; color: #374151; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500;">${cms}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${sol.code ? `
        <div>
          <span class="section-label">CODE IMPLEMENTATION</span>
          <pre class="solution-code-pre"><code>${sol.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
        </div>
      ` : ''}
    </div>
  `).join('') : '<p style="color: #6B7280; font-style: italic;">No solution details available.</p>';

  const waitTime = calculateWaitTime(ticket.timeRaised, ticket.timeClosed);

  viewRow.innerHTML = `
    <td colspan="6">
      <div class="details-wrapper">
        <div class="details-main-grid">
          <div>
            <h4 class="details-section-title">Case Information</h4>
            <div class="details-white-card">
              <div class="details-field">
                <span class="field-label">CASE ID</span>
                <div class="field-value"><code class="case-id-tag">${ticket.caseID}</code></div>
              </div>
              <div class="details-field">
                <span class="field-label">STATUS</span>
                <div class="field-value"><span class="status-badge status-active">${ticket.status}</span></div>
              </div>
              <div class="details-field">
                <span class="field-label">OVERHEAD</span>
                <div class="field-value"><span class="role-badge role-sme">${ticket.overhead}</span></div>
              </div>
              <div class="details-field">
                <span class="field-label">ON CALL</span>
                <div class="field-value">${ticket.onCall ? '✅ Yes' : '❌ No'}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 class="details-section-title">Timeline</h4>
            <div class="details-white-card">
              <div class="details-field">
                <span class="field-label">CASE RAISED</span>
                <div class="field-value timeline-text">${formatDate(ticket.timeRaised)}</div>
              </div>
              <div class="details-field">
                <span class="field-label">CASE TAKEN</span>
                <div class="field-value timeline-text">${formatDate(ticket.timeTaken)}</div>
              </div>
              <div class="details-field">
                <span class="field-label">CASE CLOSED</span>
                <div class="field-value timeline-text">${formatDate(ticket.timeClosed)}</div>
              </div>
              <div class="details-field">
                <span class="field-label">TOTAL WAIT TIME</span>
                <div class="field-value bold">${waitTime}</div>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 class="details-section-title">Description</h4>
          <div class="details-white-card">
            <p class="solution-description-text">${ticket.description}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 class="details-section-title">Technical Details</h4>
          ${addonsHTML}
        </div>

        <div>
          <h4 class="details-section-title">Solution Applied</h4>
          ${solutionHTML}
        </div>

        <div style="margin-top: 20px;">
          <h4 class="details-section-title">Rate this ticket</h4>
          <div class="details-white-card">
            <div class="rating-container" data-ticket-id="${ticket.caseID}">
              <p style="margin-bottom: 16px; color: #6B7280; font-size: 14px;">Was this solution helpful?</p>
              <div class="rating-buttons">
                <button class="rating-btn thumbs-up" data-rating="positive" aria-label="Thumbs up">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  <span>Helpful</span>
                </button>
                <button class="rating-btn thumbs-down" data-rating="negative" aria-label="Thumbs down">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                  </svg>
                  <span>Not Helpful</span>
                </button>
              </div>
              <div class="feedback-box" style="display: none;">
                <textarea class="feedback-textarea" placeholder="Please tell us what went wrong or how we can improve..." rows="4"></textarea>
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                  <button class="submit-feedback-btn">Submit Feedback</button>
                  <button class="cancel-feedback-btn">Cancel</button>
                </div>
              </div>
              <div class="rating-success" style="display: none;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span style="color: #059669; font-weight: 500;">Thank you for your feedback!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </td>
  `;

  row.parentNode.insertBefore(viewRow, row.nextSibling);
  attachRatingListeners(viewRow);
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

// 9. Rating System
const attachRatingListeners = (viewRow) => {
  const ratingContainer = viewRow.querySelector('.rating-container');
  const thumbsUpBtn = viewRow.querySelector('.thumbs-up');
  const thumbsDownBtn = viewRow.querySelector('.thumbs-down');
  const feedbackBox = viewRow.querySelector('.feedback-box');
  const feedbackTextarea = viewRow.querySelector('.feedback-textarea');
  const submitBtn = viewRow.querySelector('.submit-feedback-btn');
  const cancelBtn = viewRow.querySelector('.cancel-feedback-btn');
  const successMsg = viewRow.querySelector('.rating-success');
  const ratingButtons = viewRow.querySelector('.rating-buttons');

  thumbsUpBtn.addEventListener('click', () => {
    const ticketId = ratingContainer.getAttribute('data-ticket-id');
    submitRating(ticketId, 'positive', '');
    showSuccess();
  });

  thumbsDownBtn.addEventListener('click', () => {
    ratingButtons.style.display = 'none';
    feedbackBox.style.display = 'block';
    feedbackTextarea.focus();
  });

  submitBtn.addEventListener('click', () => {
    const ticketId = ratingContainer.getAttribute('data-ticket-id');
    const feedback = feedbackTextarea.value.trim();

    if (feedback === '') {
      alert('Please provide feedback about what went wrong.');
      return;
    }

    submitRating(ticketId, 'negative', feedback);
    showSuccess();
  });

  cancelBtn.addEventListener('click', () => {
    feedbackBox.style.display = 'none';
    ratingButtons.style.display = 'flex';
    feedbackTextarea.value = '';
  });

  const showSuccess = () => {
    ratingButtons.style.display = 'none';
    feedbackBox.style.display = 'none';
    successMsg.style.display = 'flex';
  };
};

const submitRating = (ticketId, rating, feedback) => {
  console.log('Rating submitted:', {
    ticketId,
    rating,
    feedback,
    timestamp: new Date().toISOString()
  });

  // TODO: Enviar para o Supabase quando necessário
};

// Inicialização
loadTickets();