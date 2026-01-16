const tickets = [
  {
    id: '6-8909000040070',
    program: 'Gold',
    waitingTime: 'Now',
    onCall: true,
    status: 'waiting',
    agent: {
      name: 'Thais de Carvalho Lima',
      role: 'Agent',
      ldap: 'decarvalholima',
      initials: 'TC'
    },
    description: 'Tag de Whatsapp com status "still running" ao testar o disparo. Nós ajustamos a global do GTM no CMS e limpamos cache, testamos com e sem GCLID após também limpar os cookies no navegador, mas o disparo permanece com problema, inclusive ao validar via devtools. O que podemos fazer neste caso? Muito obrigado!',
    meta: {
      site: 'https://ferreiraviana.adv.br/',
      cms: 'WordPress',
      cid: '6051013270',
      ga4: 'G-1451939915',
      gtm: 'GTM-TKFCP7RP'
    }
  },
  {
    id: '6-8909000040071',
    program: 'LM',
    waitingTime: '1min',
    onCall: true,
    status: 'waiting',
    agent: {
      name: 'Juliana Alves Ribeiro',
      role: 'Agent',
      ldap: 'jalvesribeiro',
      initials: 'JA'
    },
    description: 'No site https://www3.iberlim.pt/contactos/ mostra que tem o GTM-598HQT9W instalado normalmente, e o GTM tbm conecta normalmente ao site, porém não é possível processguir com o teste porque da uma mensagem de bloqueio. Como resolver esse problema?',
    meta: {
      site: 'https://www3.iberlim.pt/contactos/',
      cms: 'WordPress',
      cid: '123-134-4422',
      ga4: 'G-1451939915',
      gtm: 'GTM-598HQT9W'
    }
  },
  {
    id: '6-8909000040072',
    program: 'LM',
    waitingTime: '12min',
    onCall: false,
    status: 'waiting',
    agent: {
      name: 'Histyanailehts Garcia',
      role: 'Agent',
      ldap: 'histyanailehts',
      initials: 'HG'
    },
    description: 'Eu fiz os ajustes que você neste caso. Hoje eu estou tentando fazer os testes de uma conversão de compra neste site https://teleachatboutique.com/, mas o Tag assistant não vincula e o GTM está instalado.',
    meta: {
      site: 'https://teleachatboutique.com/',
      cms: 'Shopify',
      cid: '123-134-4422',
      ga4: 'G-1451939915',
      gtm: 'GTM-NC8BHMW'
    }
  },
  {
    id: '6-8909000040073',
    program: 'Gold',
    waitingTime: '1min',
    onCall: false,
    status: 'waiting',
    agent: {
      name: 'Patricia dos Santos',
      role: 'Agent',
      ldap: 'ppdossantos',
      initials: 'PS'
    },
    description: 'A tag de formulário não dispara no Google Ads tem mais de 3 meses (provavelmente por conta disso). Como resolver esse problema?',
    meta: {
      site: 'https://site.com/',
      cms: 'WordPress',
      cid: '123-134-4422',
      ga4: 'G-1451939915',
      gtm: 'GTM-TKFCP7RP'
    }
  },
  {
    id: '6-8909000040074',
    program: 'Titanium',
    waitingTime: '1min',
    onCall: false,
    status: 'waiting',
    agent: {
      name: 'Marcia Tzannis',
      role: 'Agent',
      ldap: 'tzannis',
      initials: 'MT'
    },
    description: 'No site mostra que tem o GTM instalado normalmente, e o GTM tbm conecta normalmente ao site, porém não é possível processguir com o teste porque da uma mensagem de bloqueio.',
    meta: {
      site: 'https://site.com/',
      cms: 'WordPress',
      cid: '123-134-4422',
      ga4: 'G-1451939915',
      gtm: 'GTM-TKFCP7RP'
    }
  },
  {
    id: '6-8909000040075',
    program: 'Platinum',
    waitingTime: '1h+',
    onCall: false,
    status: 'waiting',
    agent: {
      name: 'Xamary Aponte',
      role: 'Agent',
      ldap: 'xamary',
      initials: 'XA'
    },
    description: 'Preciso de ajuda com este caso. O container não é encontrado e no sistema também não aparece como registrado.',
    meta: {
      site: 'https://site.com/',
      cms: 'WordPress',
      cid: '123-134-4422',
      ga4: 'G-1451939915',
      gtm: 'GTM-TKFCP7RP'
    }
  },
  {
    id: '6-8909000040076',
    program: 'Silver',
    waitingTime: '19min',
    onCall: false,
    status: 'waiting',
    agent: {
      name: 'Naiara Almeida',
      role: 'Agent',
      ldap: 'marianaiara',
      initials: 'NA'
    },
    description: 'O Tag Assistant não vincula corretamente. Já tentei diversas vezes mas não consigo conectar.',
    meta: {
      site: 'https://site.com/',
      cms: 'WordPress',
      cid: '123-134-4422',
      ga4: 'G-1451939915',
      gtm: 'GTM-TKFCP7RP'
    }
  },
  {
    id: '6-8909000040077',
    program: 'Bronze',
    waitingTime: '3min',
    onCall: false,
    status: 'waiting',
    agent: {
      name: 'Aline Gerlinzer',
      role: 'Agent',
      ldap: 'agerlinzer',
      initials: 'AG'
    },
    description: 'Não consigo fazer o teste porque da uma mensagem de bloqueio. Como resolver?',
    meta: {
      site: 'https://site.com/',
      cms: 'WordPress',
      cid: '123-134-4422',
      ga4: 'G-1451939915',
      gtm: 'GTM-TKFCP7RP'
    }
  },
  {
    id: '6-8909000040078',
    program: 'Bronze',
    waitingTime: '5min',
    onCall: false,
    status: 'in-progress',
    agent: {
      name: 'Ana Valentina Estaba',
      role: 'Agent',
      ldap: 'estaba',
      initials: 'AE'
    },
    description: 'Continuação do caso anterior.',
    meta: {
      site: 'https://site.com/',
      cms: 'WordPress',
      cid: '123-134-4422',
      ga4: 'G-1451939915',
      gtm: 'GTM-TKFCP7RP'
    }
  },
  {
    id: '8-5717000039978',
    program: 'Bronze',
    waitingTime: '16min',
    onCall: true,
    status: 'in-progress',
    agent: {
      name: 'Yabeth Alexandra Mejias Ascanio',
      role: 'Agent',
      ldap: 'yabetha',
      initials: 'YA'
    },
    description: 'Boa tarde time, tudo bem? preciso de ajuda com o caso, porque assim no momento da consultoria para o cliente no disparou a conversão, mas para mim disparou certinho.',
    meta: {
      site: 'https://ontrack.global/',
      cms: 'WordPress',
      cid: '123-134-4422',
      ga4: 'G-1451939915',
      gtm: 'GTM-PDF3XZG'
    }
  },
  {
    id: '5-1761000040347',
    program: 'QA',
    waitingTime: 'Now',
    onCall: true,
    status: 'in-progress',
    agent: {
      name: 'Yuli Costa',
      role: 'QA',
      ldap: 'yulic',
      initials: 'YC'
    },
    description: 'Tag de Whatsapp com status "still running" ao testar o disparo. Validação de qualidade necessária.',
    meta: {
      site: 'https://ferreiraviana.adv.br/',
      cms: 'WordPress',
      cid: '6051013270',
      ga4: 'G-1451939915',
      gtm: 'GTM-TKFCP7RP'
    }
  }
];

function getProgramClass(program) {
  const programMap = {
    'Gold': 'gold',
    'Silver': 'silver',
    'Bronze': 'bronze',
    'Platinum': 'platinum',
    'Titanium': 'titanium',
    'LM': 'live-meet',
    'QA': 'qa'
  };
  return programMap[program] || 'bronze';
}

function createTicketCard(ticket) {
  const programClass = getProgramClass(ticket.program);
  const displayProgram = ticket.program === 'LM' ? 'Live Meet' : ticket.program === 'QA' ? 'DSAT' : ticket.program;

  const callIcon = ticket.onCall ? `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#15803D" stroke="#15803D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path class="ringing" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>
  ` : '';

  const actionButtons = ticket.status === 'waiting' ? `
    <button class="btn-take" onclick="takeTicket('${ticket.id}')">Take Ticket</button>
  ` : `
    <button class="btn-close" onclick="closeTicket('${ticket.id}')">Close</button>
    <button class="btn-return" onclick="returnTicket('${ticket.id}')">Return to Queue</button>
  `;

  return `
    <div class="queue-card-isolated" data-ticket-id="${ticket.id}">
      <div class="card-header-q2">
        <div class="case-id-q2">
          ${callIcon}
          <h3>${ticket.id}</h3>
        </div>
        <div class="badges-row">
          <span class="program-badge-q2 ${programClass}">${displayProgram}</span>
          <span class="waiting-time-q2">${ticket.waitingTime}</span>
        </div>
      </div>

      <div class="profile-section">
        <div class="avatar-q2">${ticket.agent.initials}</div>
        <div class="profile-info-q2">
          <h4>${ticket.agent.name}</h4>
          <p>${ticket.agent.role} • ${ticket.agent.ldap}</p>
        </div>
      </div>

      <div class="case-description-q2">
        <p>${ticket.description}</p>
        <div class="case-meta">
          <div class="case-meta-item">
            <strong>Site:</strong>
            <span>${ticket.meta.site}</span>
          </div>
          <div class="case-meta-item">
            <strong>CMS:</strong>
            <span>${ticket.meta.cms}</span>
          </div>
          <div class="case-meta-item">
            <strong>CID:</strong>
            <span>${ticket.meta.cid}</span>
          </div>
          <div class="case-meta-item">
            <strong>GTM:</strong>
            <span>${ticket.meta.gtm}</span>
          </div>
        </div>
      </div>

      <div class="card-actions">
        ${actionButtons}
      </div>
    </div>
  `;
}

function renderTickets() {
  const waitingContainer = document.getElementById('waiting-cards');
  const progressContainer = document.getElementById('progress-cards');

  const waitingTickets = tickets.filter(t => t.status === 'waiting');
  const progressTickets = tickets.filter(t => t.status === 'in-progress');

  if (waitingTickets.length === 0) {
    waitingContainer.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
        <p>Nenhum ticket na fila</p>
      </div>
    `;
  } else {
    waitingContainer.innerHTML = waitingTickets.map(createTicketCard).join('');
  }

  if (progressTickets.length === 0) {
    progressContainer.innerHTML = `
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>Nenhum ticket em atendimento</p>
      </div>
    `;
  } else {
    progressContainer.innerHTML = progressTickets.map(createTicketCard).join('');
  }

  document.getElementById('waiting-count').textContent = waitingTickets.length;
  document.getElementById('progress-count').textContent = progressTickets.length;
}

function takeTicket(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (ticket) {
    ticket.status = 'in-progress';
    renderTickets();
  }
}

function returnTicket(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (ticket) {
    ticket.status = 'waiting';
    renderTickets();
  }
}

function closeTicket(ticketId) {
  const ticketIndex = tickets.findIndex(t => t.id === ticketId);
  if (ticketIndex !== -1) {
    if (confirm('Tem certeza que deseja fechar este ticket?')) {
      tickets.splice(ticketIndex, 1);
      renderTickets();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderTickets();
});
