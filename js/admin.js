const userData = "/js/users.json";
let allUsers = []; 

const tableBody = document.querySelector("#usersTableBody");
const filterButtons = document.querySelectorAll(".filter-btn");
const userSearch = document.querySelector("#userSearch");

// 1. Carregamento inicial
const loadUsers = () => {
  fetch(userData)
    .then(response => {
      if (!response.ok) throw new Error("Erro ao carregar");
      return response.json();
    })
    .then(users => {
      allUsers = users;
      renderTable(allUsers);
    });
};

// 2. Filtro Mestre (Combina Busca + Status + Role)
const applyFilters = () => {
  const searchTerm = userSearch.value.toLowerCase().trim();
  
  // Identifica os filtros ativos
  const activeStatusBtn = document.querySelector(".filter-btn.active[data-filter='active'], .filter-btn.active[data-filter='inactive']");
  const activeRoleBtn = document.querySelector(".filter-btn.active:not([data-filter='all']):not([data-filter='active']):not([data-filter='inactive'])");
  const isAllSelected = document.querySelector(".filter-btn.active[data-filter='all']");

  const statusFilter = activeStatusBtn ? activeStatusBtn.getAttribute("data-filter") : "all";
  const roleFilter = activeRoleBtn ? activeRoleBtn.getAttribute("data-filter") : "all";

  const filteredUsers = allUsers.filter(user => {
    // Camada 1: Busca por Texto
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm) || 
                          user.ldap.toLowerCase().includes(searchTerm);

    // Se "All" está ativo, só filtramos pela busca
    if (isAllSelected) return matchesSearch;

    // Camada 2: Filtros de Botão
    const matchesStatus = (statusFilter === "all") || (user.status === statusFilter);
    const matchesRole = (roleFilter === "all") || (user.role === roleFilter);

    return matchesSearch && matchesStatus && matchesRole;
  });

  renderTable(filteredUsers);
};

// 3. Listeners de Evento
userSearch.addEventListener("input", applyFilters);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filterValue = button.getAttribute("data-filter");

    if (filterValue === "all") {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
    } else {
      document.querySelector(".filter-btn[data-filter='all']").classList.remove("active");
      const isStatusBtn = ["active", "inactive"].includes(filterValue);

      filterButtons.forEach(btn => {
        const btnValue = btn.getAttribute("data-filter");
        const isTargetStatus = ["active", "inactive"].includes(btnValue);
        const isTargetRole = !["all", "active", "inactive"].includes(btnValue);

        if (isStatusBtn && isTargetStatus) btn.classList.remove("active");
        if (!isStatusBtn && isTargetRole) btn.classList.remove("active");
      });
      button.classList.add("active");
    }
    applyFilters();
  });
});

// 4. Renderização (Layout Original)
const renderTable = (usersToDisplay) => {
  tableBody.innerHTML = "";

  if (usersToDisplay.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="no-data">No users have been found with these criteria.</td></tr>`;
    return;
  }

  usersToDisplay.forEach(user => {
    const roleClasses = { 
      'SME': 'role-sme', 'QA': 'role-qa', 'Agent': 'role-agent', 
      'TL': 'role-tl', 'WFM': 'role-wfm' 
    };
    
    const roleClass = roleClasses[user.role] || "role-default";
    const statusClass = user.status === "active" ? "status-active" : "status-inactive";
    const statusText = user.status.charAt(0).toUpperCase() + user.status.slice(1);

    tableBody.innerHTML += `
      <tr data-ldap="${user.ldap}" data-role="${user.role}">
        <td>
          <div class="user-info">
            <div class="user-details">
              <span class="user-name">${user.fullName}</span>
              <span class="user-email">${user.email}</span>
            </div>
          </div>
        </td>
        <td><code class="ldap-code">${user.ldap}</code></td>
        <td><span class="role-badge ${roleClass}">${user.role}</span></td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon edit-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon delete-btn">
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

  // 5. Delegação de Evento para o botão Delete
  // Delegação de Evento para o botão Delete dentro da sua lógica principal
  tableBody.addEventListener("click", (e) => {
    const deleteBtn = e.target.closest(".delete-btn");
    
    if (deleteBtn) {
      const row = deleteBtn.closest("tr");
      const userName = row.querySelector(".user-name").textContent;
      const userLdap = row.getAttribute("data-ldap");

      // 1. Abre o prompt de confirmação
      promptBox(
        "⚠️",
        "Warning",
        `Do you really want to delete the user <b>${userName} (${userLdap})</b>? This action cannot be undone.`
      );

      // 2. Captura os botões do promptBox global
      const btnYes = document.querySelector("#alert a[title='Yes']");
      const btnCancel = document.querySelector("#alert a[title='Cancel']");

      // Lógica para o botão YES (Confirmar exclusão)
      btnYes.onclick = () => {
        // Remove do array local
        allUsers = allUsers.filter(user => user.ldap !== userLdap);
        
        // Atualiza a tabela com os filtros atuais
        applyFilters();

        // Fecha o promptBox de confirmação
        document.querySelector("#alert").classList.remove("alert-container");
        document.querySelector("#alert").innerHTML = "";

        // 3. Exibe a mensagem de sucesso usando a sua outra função global
        alertBox(
          "✅",
          "Success!", 
          `User <b>${userName} (${userLdap})</b><br/ >has been deleted!`
        );
      };

      // Lógica para o botão CANCEL
      btnCancel.onclick = () => {
        document.querySelector("#alert").classList.remove("alert-container");
        document.querySelector("#alert").innerHTML = "";
      };
    }
  });

  // Adicionando também para o botão de Edit, caso precise no futuro:
  tableBody.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".edit-btn");
    if (editBtn) {
      const row = editBtn.closest("tr");
      const userLdap = row.getAttribute("data-ldap");
      console.log("Editando usuário:", userLdap);
      // Aqui você chamaria seu modal de edição
    }
  });
};

loadUsers();

/* EDIT USER */
/* --- CONFIGURAÇÃO DE ÍCONES --- */
const ICON_EDIT = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
const ICON_X = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

/* --- FUNÇÕES DE APOIO --- */

// Função que limpa qualquer edição aberta e reseta os ícones
const closeAllEdits = () => {
  const existingForm = document.querySelector(".edit-row-active");
  if (existingForm) {
    existingForm.remove();
  }

  // Volta todos os botões para o ícone de lápis e remove a marcação de ativo
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.innerHTML = ICON_EDIT;
    btn.classList.remove("active-editing");
  });
};

/* --- LÓGICA PRINCIPAL --- */

// 1. Ouvinte global (Event Delegation)
document.querySelector("#usersTableBody").addEventListener("click", function(e) {
  const editBtn = e.target.closest(".edit-btn");
  
  if (editBtn) {
    // Se o botão já está em modo "X", apenas fechamos
    if (editBtn.classList.contains("active-editing")) {
      closeAllEdits();
    } else {
      // Se não, abrimos a edição para essa linha
      const currentRow = editBtn.closest("tr");
      const ldap = currentRow.getAttribute("data-ldap");
      showEditInline(currentRow, ldap, editBtn);
    }
  }
});

// 2. Função que cria o form e troca o ícone
const showEditInline = (row, ldap, btn) => {
  // Primeiro, fecha qualquer outra edição que esteja aberta
  closeAllEdits();

  // Transforma o botão clicado em X
  btn.innerHTML = ICON_X;
  btn.classList.add("active-editing");

  const editRow = document.createElement("tr");
  editRow.classList.add("edit-row-active");
  
  const currentName = row.querySelector(".user-name").innerText;
  const currentEmail = row.querySelector(".user-email").innerText;
  const currentRole = row.getAttribute("data-role");
  const isInactive = row.querySelector(".status-badge").classList.contains("status-inactive");

  editRow.innerHTML = `
    <td colspan="5">
      <form id="inlineEditForm">
        <input type="text" id="editLdap" value="${ldap}" readonly />
        <input type="text" id="editName" value="${currentName}" placeholder="Full Name" aria-required="true" aria-errormessage="Please, provide new user full name" />
        <input type="email" id="editEmail" value="${currentEmail}" placeholder="Email" aria-required="true" aria-errormessage="Email is required" />
        <select id="editRole" aria-required="true" aria-errormessage="Select a role">
          <option value="Agent" ${currentRole === 'Agent' ? 'selected' : ''}>Agent</option>
          <option value="SME" ${currentRole === 'SME' ? 'selected' : ''}>SME</option>
          <option value="QA" ${currentRole === 'QA' ? 'selected' : ''}>QA</option>
          <option value="TL" ${currentRole === 'TL' ? 'selected' : ''}>TL</option>
          <option value="WFM" ${currentRole === 'WFM' ? 'selected' : ''}>WFM</option>
        </select>
        <select id="editStatus">
          <option value="active" ${!isInactive ? 'selected' : ''}>Active</option>
          <option value="inactive" ${isInactive ? 'selected' : ''}>Inactive</option>
        </select>
        <button type="submit" class="btn-primary">Update</button>
      </form>
    </td>
  `;

  row.parentNode.insertBefore(editRow, row.nextSibling);

  document.querySelector("#inlineEditForm").onsubmit = function(e) {
    e.preventDefault();
    const updatedUser = {
      ldap: ldap,
      fullName: document.querySelector("#editName").value,
      email: document.querySelector("#editEmail").value,
      role: document.querySelector("#editRole").value,
      status: document.querySelector("#editStatus").value
    };
    
    saveUpdate(updatedUser);
  };
};

// 3. Função para salvar
const saveUpdate = (userData) => {
  console.log("Salvando:", userData);
  alertBox("✅","Success!", `User <b>${userData.fullName} (${userData.ldap})</b><br/ >has been updated!`);
  closeAllEdits();
};
