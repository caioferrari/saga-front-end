if(window.location.href.includes("pre-chat-info.html")) {

  const mockData = {
    user: {
      ldap: 'jsmith',
      full_name: 'John Smith',
      role: 'Agent',
      status: 'online'
    },
    team: [
      { ldap: 'jsmith', full_name: 'John Smith', role: 'Agent', status: 'online' },
      { ldap: 'mgarcia', full_name: 'Maria Garcia', role: 'SME', status: 'online' },
      { ldap: 'rjohnson', full_name: 'Robert Johnson', role: 'QA', status: 'offline' },
      { ldap: 'lwilliams', full_name: 'Lisa Williams', role: 'TL', status: 'busy' }
    ],
    library: {
      total: 147,
      categories: {
        Technical: 45,
        Process: 38,
        Troubleshooting: 42,
        Product: 22
      }
    },
    performance: {
      callsCompleted: 12,
      avgDuration: 28,
      successRate: 92
    },
    activities: [
      { user: 'Maria Garcia', type: 'content_added', description: 'added new article "Google Ads Troubleshooting"', time: '2 hours ago' },
      { user: 'John Smith', type: 'mock_call', description: 'completed a mock call', time: '3 hours ago' },
      { user: 'Lisa Williams', type: 'ticket_raised', description: 'raised a support ticket', time: '5 hours ago' },
      { user: 'Robert Johnson', type: 'content_added', description: 'updated "Analytics Setup Guide"', time: '1 day ago' }
    ]
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const loadDashboardData = () => {
    const userData = mockData.user;
    document.querySelector('#userName').textContent = userData.full_name;
    document.querySelector('#userRole').textContent = userData.role;
    document.querySelector('#userLdap').textContent = userData.ldap;
    document.querySelector('#userAvatar').textContent = getInitials(userData.full_name);
    document.querySelector('#userStatus').textContent = userData.status.charAt(0).toUpperCase() + userData.status.slice(1);

    const onlineCount = mockData.team.filter(m => m.status === 'online').length;
    document.querySelector('#teamCount').textContent = `${onlineCount} online`;

    const teamMembersHTML = mockData.team.map(member => `
      <div class="team-member">
        <div class="member-avatar">
          ${getInitials(member.full_name)}
          <span class="status-indicator ${member.status}"></span>
        </div>
        <div class="member-info">
          <span class="member-name">${member.full_name}</span>
          <span class="member-role">${member.role}</span>
        </div>
      </div>
    `).join('');
    document.querySelector('#teamMembers').innerHTML = teamMembersHTML;

    document.querySelector('#totalContent').textContent = mockData.library.total;
    document.querySelector('#technicalCount').textContent = mockData.library.categories.Technical;
    document.querySelector('#processCount').textContent = mockData.library.categories.Process;
    document.querySelector('#troubleshootingCount').textContent = mockData.library.categories.Troubleshooting;
    document.querySelector('#productCount').textContent = mockData.library.categories.Product;

    const avgCallsScore = 85;
    document.querySelector('#callsCompleted').textContent = mockData.performance.callsCompleted;
    document.querySelector('#avgScore').textContent = avgCallsScore;

    document.querySelector('#perfCallsCompleted').textContent = mockData.performance.callsCompleted;
    document.querySelector('#perfAvgDuration').textContent = mockData.performance.avgDuration + 'm';
    document.querySelector('#perfSuccessRate').textContent = mockData.performance.successRate + '%';

    const maxCalls = 20;
    const maxDuration = 45;
    document.querySelector('#perfCallsBar').style.width = (mockData.performance.callsCompleted / maxCalls * 100) + '%';
    document.querySelector('#perfDurationBar').style.width = (mockData.performance.avgDuration / maxDuration * 100) + '%';
    document.querySelector('#perfSuccessBar').style.width = mockData.performance.successRate + '%';

    const activityIcons = {
      content_added: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
      mock_call: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
      ticket_raised: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>'
    };

    const activityHTML = mockData.activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">
          ${activityIcons[activity.type]}
        </div>
        <div class="activity-content">
          <div class="activity-description">
            <span class="activity-user">${activity.user}</span> ${activity.description}
          </div>
          <div class="activity-time">${activity.time}</div>
        </div>
      </div>
    `).join('');
    document.querySelector('#activityFeed').innerHTML = activityHTML;
  };

  document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDashboardData);
  } else {
    loadDashboardData();
  }
}
