const casesData = "/js/casesSolved.json";
let allTickets = [];

const tableBody = document.querySelector("#ticketsTableBody");
const filterButtons = document.querySelectorAll(".filter-btn");
const ticketSearch = document.querySelector("#ticketSearch");

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

const updateStats = () => {
  const totalTickets = allTickets.length;
  const smeTickets = allTickets.filter(t => t.overhead === "SME").length;

  const waitTimes = allTickets.map(t => {
    const time = t.waitingTime;
    if (time.includes('h+')) return 60;
    return parseInt(time) || 0;
  });

  const avgWaitTime = waitTimes.length > 0
    ? Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length)
    : 0;

  document.querySelector("#totalTickets").textContent = totalTickets;
  document.querySelector("#avgWaitTime").textContent = avgWaitTime + "min";
  document.querySelector("#smeTickets").textContent = smeTickets;
};

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

ticketSearch.addEventListener("input", applyFilters);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    applyFilters();
  });
});

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

const renderTable = (ticketsToDisplay) => {
  tableBody.innerHTML = "";

  if (ticketsToDisplay.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="no-data">No tickets found with these criteria.</td></tr>`;
    return;
  }

  ticketsToDisplay.forEach((ticket, index) => {
    const programClass = getProgramClass(ticket.program);

    tableBody.innerHTML += `
      <tr data-index="${index}">
        <td>
          <code style="font-size: 12px; background: #F3F4F6; padding: 4px 8px; border-radius: 4px; color: #374151;">${ticket.caseID}</code>
        </td>
        <td>
          <div>
            <div style="font-weight: 600; color: #1F2937; font-size: 14px;">${ticket.name}</div>
            <div style="font-size: 12px; color: #6B7280;">@${ticket.ldap}</div>
          </div>
        </td>
        <td><span class="role-badge ${programClass}">${ticket.program}</span></td>
        <td>
          <span style="font-size: 13px; color: #374151; font-weight: 500;">@${ticket.helper}</span>
        </td>
        <td>
          <span style="font-size: 13px; color: #6B7280;">${ticket.waitingTime}</span>
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

  const addonsHTML = ticket.addons.map(addon => `
    <div style="background: #F9FAFB; padding: 12px; border-radius: 6px; margin-bottom: 8px;">
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 13px;">
        <div><strong>Site:</strong> <a href="${addon.site}" target="_blank" style="color: #3B82F6;">${addon.site}</a></div>
        <div><strong>CMS:</strong> ${addon.CMS}</div>
        <div><strong>CID:</strong> <code style="background: #E5E7EB; padding: 2px 6px; border-radius: 3px;">${addon.CID}</code></div>
        <div><strong>GA4:</strong> <code style="background: #E5E7EB; padding: 2px 6px; border-radius: 3px;">${addon.GA4}</code></div>
        <div style="grid-column: span 2;"><strong>GTM:</strong> <code style="background: #E5E7EB; padding: 2px 6px; border-radius: 3px;">${addon.GTM}</code></div>
      </div>
    </div>
  `).join('');

  viewRow.innerHTML = `
    <td colspan="6">
      <div style="background: #F5F5F5; padding: 24px; border-radius: 8px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div>
            <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #1F2937;">Case Information</h4>
            <div style="background: white; padding: 16px; border-radius: 6px;">
              <div style="margin-bottom: 12px;">
                <span style="font-weight: 600; color: #6B7280; font-size: 12px;">CASE ID</span>
                <div style="font-size: 14px; color: #1F2937; margin-top: 4px;"><code style="background: #F3F4F6; padding: 4px 8px; border-radius: 4px;">${ticket.caseID}</code></div>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="font-weight: 600; color: #6B7280; font-size: 12px;">STATUS</span>
                <div style="margin-top: 4px;"><span class="status-badge status-active">${ticket.status}</span></div>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="font-weight: 600; color: #6B7280; font-size: 12px;">OVERHEAD</span>
                <div style="font-size: 14px; color: #1F2937; margin-top: 4px;"><span class="role-badge role-sme">${ticket.overhead}</span></div>
              </div>
              <div>
                <span style="font-weight: 600; color: #6B7280; font-size: 12px;">ON CALL</span>
                <div style="font-size: 14px; color: #1F2937; margin-top: 4px;">${ticket.onCall ? '✅ Yes' : '❌ No'}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #1F2937;">Timeline</h4>
            <div style="background: white; padding: 16px; border-radius: 6px;">
              <div style="margin-bottom: 12px;">
                <span style="font-weight: 600; color: #6B7280; font-size: 12px;">OPENED</span>
                <div style="font-size: 13px; color: #1F2937; margin-top: 4px;">${formatDate(ticket.firstDate)}</div>
              </div>
              <div style="margin-bottom: 12px;">
                <span style="font-weight: 600; color: #6B7280; font-size: 12px;">SOLVED</span>
                <div style="font-size: 13px; color: #1F2937; margin-top: 4px;">${formatDate(ticket.lastDate)}</div>
              </div>
              <div>
                <span style="font-weight: 600; color: #6B7280; font-size: 12px;">WAIT TIME</span>
                <div style="font-size: 14px; color: #1F2937; margin-top: 4px; font-weight: 600;">${ticket.waitingTime}</div>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #1F2937;">Description</h4>
          <div style="background: white; padding: 16px; border-radius: 6px;">
            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151;">${ticket.description}</p>
          </div>
        </div>

        <div>
          <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #1F2937;">Technical Details</h4>
          ${addonsHTML}
        </div>
      </div>
    </td>
  `;

  row.parentNode.insertBefore(viewRow, row.nextSibling);
};

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

document.querySelector("#exportBtn")?.addEventListener("click", () => {
  const csvContent = "data:text/csv;charset=utf-8,"
    + "Case ID,Name,LDAP,Program,Helper,Wait Time,Status,Description\n"
    + allTickets.map(t =>
        `"${t.caseID}","${t.name}","${t.ldap}","${t.program}","${t.helper}","${t.waitingTime}","${t.status}","${t.description.replace(/"/g, '""')}"`
      ).join("\n");

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

loadTickets();
