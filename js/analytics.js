const userData = "/js/users.json";
let allSMEs = []; 

const tableBody = document.querySelector("#usersTableBody");
const filterButtons = document.querySelectorAll(".filter-btn");
const userSearch = document.querySelector("#userSearch");

// 1. Carregamento inicial - FILTRO RESTRITO
const loadUsers = () => {
  fetch(userData)
    .then(response => {
      if (!response.ok) throw new Error("Error loading data");
      return response.json();
    })
    .then(users => {
      // REGRA DE OURO: Filtra apenas quem é SME E está Ativo
      // Isso ignora Agents, TLs e também SMEs inativos (como o Matheus Dantas)
      allSMEs = users.filter(user => user.role === "SME" && user.status === "active");
      
      applyFilters();
    })
    .catch(error => {
      console.error("Erro ao carregar dados:", error);
      tableBody.innerHTML = `<tr><td colspan="5" class="no-data">Error loading SME data.</td></tr>`;
    });
};

// 2. Filtro Mestre (Busca e Botões)
const applyFilters = () => {
  const searchTerm = userSearch.value.toLowerCase().trim();
  const activeBtn = document.querySelector(".filter-btn.active");
  const statusFilter = activeBtn ? activeBtn.getAttribute("data-filter") : "all";

  const filteredUsers = allSMEs.filter(user => {
    // Busca por Texto
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm) || 
                          user.ldap.toLowerCase().includes(searchTerm);

    // Como já filtramos apenas os ativos no loadUsers, 
    // o botão "Online" e "All" mostrarão os mesmos usuários.
    // O botão "Offline" agora sempre retornará vazio, pois limpamos os inativos.
    let matchesStatus = true;
    if (statusFilter === "offline") matchesStatus = false; 

    return matchesSearch && matchesStatus;
  });

  renderTable(filteredUsers);
};

// 3. Listeners
userSearch.addEventListener("input", applyFilters);

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    applyFilters();
  });
});

// 4. Renderização
const renderTable = (usersToDisplay) => {
  tableBody.innerHTML = "";

  if (usersToDisplay.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="no-data">No active SMEs found.</td></tr>`;
    return;
  }

  usersToDisplay.forEach(user => {
    tableBody.innerHTML += `
      <tr data-ldap="${user.ldap}">
        <td>
          <div class="user-info">
            <div class="user-details">
              <span class="user-name">${user.fullName}</span>
              <span class="user-email">${user.email}</span>
            </div>
          </div>
        </td>
        <td><code class="ldap-code">${user.ldap}</code></td>
        <td><span class="role-badge role-sme">${user.role}</span></td>
        <td><span class="status-badge status-active">Online</span></td>
        <td>
            <span class="last-seen">Active now</span>
        </td>
      </tr>`;
  });
};

loadUsers();

//CUSTOM SELECT
const fetchUsersForAnalytics = async () => {
  try {
      const response = await fetch(userData);
      allUsers = await response.json();
      console.log("Analytics: Users loaded successfully.");
  } catch (e) {
      console.error("Analytics: Failed to load users", e);
  }
};

fetchUsersForAnalytics();

/* CHART PERCENTAGE */
//SMEs
const updateAnalyticsProgress = () => {
  // 1. Seleciona todos os itens da fila
  const queueItems = document.querySelectorAll('.queue-item');
  
  // 2. Transforma em array e extrai os valores numéricos
  const itemsData = Array.from(queueItems).map(item => ({
    element: item.querySelector('.progress-bar-fill'),
    value: parseInt(item.querySelector('.queue-value').textContent) || 0
  }));

  // 3. Calcula a soma total (o "100%") usando reduce
  const totalTickets = itemsData.reduce((acc, curr) => acc + curr.value, 0);

  // 4. Aplica o cálculo da média (proporção) no style width de cada barra
  itemsData.forEach(item => {
    const percentage = totalTickets > 0 ? (item.value / totalTickets) * 100 : 0;
    
    // Aplica o width com template strings
    item.element.style.width = `${percentage}%`;
    
    // Adiciona uma transição suave para ficar visualmente elegante
    item.element.style.transition = 'width 0.5s ease-in-out';
  });
};

// Executa a função quando o DOM estiver pronto
updateAnalyticsProgress()

function renderAllCharts() {
  // 1. Selecionamos todos os wrappers de gráfico na página
  const allChartWrappers = document.querySelectorAll('.chart-wrapper');

  allChartWrappers.forEach(wrapper => {
    // 2. Para CADA wrapper, pegamos suas colunas específicas
    const columns = wrapper.querySelectorAll('.chart-column');
    
    // 3. Extraímos os valores numéricos
    const values = Array.from(columns).map(col => {
      const text = col.querySelector('.chart-value').innerText;
      return parseFloat(text) || 0;
    });

    // 4. Calculamos o valor máximo deste gráfico específico
    const maxValue = Math.max(...values);

    // Se o máximo for 0, as barras continuam com altura 0 (ou o valor padrão)
    if (maxValue <= 0) return;

    // 5. Aplicamos a altura proporcional para cada barra dentro DESTE wrapper
    columns.forEach(col => {
      const valText = col.querySelector('.chart-value').innerText;
      const val = parseFloat(valText) || 0;
      const bar = col.querySelector('.chart-bar');

      if (bar) {
        const percentage = (val / maxValue) * 100;
        bar.style.height = `${percentage}%`;
      }
    });
  });
}

// Inicializa quando o DOM estiver pronto
renderAllCharts();
