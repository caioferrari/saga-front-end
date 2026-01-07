import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let allUsers = [];
let currentFilter = 'all';

// Load users on page load
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Add user form
  document.getElementById('addUserForm').addEventListener('submit', handleAddUser);

  // Edit user form
  document.getElementById('editUserForm').addEventListener('submit', handleEditUser);

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      filterUsers(currentFilter);
    });
  });

  // Search functionality
  document.getElementById('userSearch').addEventListener('input', (e) => {
    searchUsers(e.target.value);
  });

  // Modal close handlers
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  document.querySelector('.cancel-btn').addEventListener('click', closeModal);

  // Close modal on outside click
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('editUserModal');
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Load all users from database
async function loadUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    allUsers = data;
    displayUsers(allUsers);
    updateStats(allUsers);
  } catch (error) {
    console.error('Error loading users:', error);
    document.getElementById('usersTableBody').innerHTML = `
      <tr>
        <td colspan="5" class="error">Error loading users. Please refresh the page.</td>
      </tr>
    `;
  }
}

// Display users in table
function displayUsers(users) {
  const tbody = document.getElementById('usersTableBody');

  if (users.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="no-data">No users found.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr data-user-id="${user.id}" data-status="${user.status}" data-role="${user.role}">
      <td>
        <div class="user-info">
          <div class="user-avatar">${getInitials(user.full_name)}</div>
          <div class="user-details">
            <span class="user-name">${user.full_name}</span>
            <span class="user-email">${user.email || 'No email'}</span>
          </div>
        </div>
      </td>
      <td><code class="ldap-code">${user.ldap}</code></td>
      <td><span class="role-badge role-${user.role.toLowerCase()}">${user.role}</span></td>
      <td><span class="status-badge status-${user.status}">${user.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-icon edit-btn" onclick="editUser('${user.id}')" title="Edit user">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="btn-icon delete-btn" onclick="deleteUser('${user.id}', '${user.full_name}')" title="Delete user">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Get user initials
function getInitials(fullName) {
  const names = fullName.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return fullName.substring(0, 2).toUpperCase();
}

// Update statistics
function updateStats(users) {
  const total = users.length;
  const active = users.filter(u => u.status === 'active').length;
  const inactive = users.filter(u => u.status === 'inactive').length;

  document.getElementById('totalUsers').textContent = total;
  document.getElementById('activeUsers').textContent = active;
  document.getElementById('inactiveUsers').textContent = inactive;
}

// Filter users
function filterUsers(filter) {
  let filtered = allUsers;

  if (filter !== 'all') {
    if (filter === 'active' || filter === 'inactive') {
      filtered = allUsers.filter(u => u.status === filter);
    } else {
      filtered = allUsers.filter(u => u.role === filter);
    }
  }

  displayUsers(filtered);
}

// Search users
function searchUsers(query) {
  const lowerQuery = query.toLowerCase();
  const filtered = allUsers.filter(u =>
    u.full_name.toLowerCase().includes(lowerQuery) ||
    u.ldap.toLowerCase().includes(lowerQuery) ||
    (u.email && u.email.toLowerCase().includes(lowerQuery))
  );

  displayUsers(filtered);
}

// Handle add user
async function handleAddUser(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const userData = {
    ldap: formData.get('ldap').toLowerCase().trim(),
    full_name: formData.get('fullName').trim(),
    email: formData.get('email').toLowerCase().trim(),
    role: formData.get('role'),
    status: formData.get('status')
  };

  try {
    if (typeof loadingBox === 'function') loadingBox();

    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select();

    if (error) throw error;

    e.target.reset();
    await loadUsers();

    if (typeof alertBox === 'function') {
      alertBox('✓', 'Success', 'User added successfully!');
    }
  } catch (error) {
    console.error('Error adding user:', error);
    if (typeof alertBox === 'function') {
      alertBox('⚠️', 'Error', error.message || 'Failed to add user. Please try again.');
    }
  }
}

// Edit user - show modal
window.editUser = async function(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    document.getElementById('editUserId').value = data.id;
    document.getElementById('editUserLdap').value = data.ldap;
    document.getElementById('editUserFullName').value = data.full_name;
    document.getElementById('editUserEmail').value = data.email || '';
    document.getElementById('editUserRole').value = data.role;
    document.getElementById('editUserStatus').value = data.status;

    document.getElementById('editUserModal').style.display = 'flex';
  } catch (error) {
    console.error('Error loading user:', error);
    if (typeof alertBox === 'function') {
      alertBox('⚠️', 'Error', 'Failed to load user details.');
    }
  }
}

// Handle edit user
async function handleEditUser(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const userId = formData.get('id');
  const userData = {
    ldap: formData.get('ldap').toLowerCase().trim(),
    full_name: formData.get('fullName').trim(),
    email: formData.get('email').toLowerCase().trim(),
    role: formData.get('role'),
    status: formData.get('status'),
    updated_at: new Date().toISOString()
  };

  try {
    if (typeof loadingBox === 'function') loadingBox();

    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select();

    if (error) throw error;

    closeModal();
    await loadUsers();

    if (typeof alertBox === 'function') {
      alertBox('✓', 'Success', 'User updated successfully!');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    if (typeof alertBox === 'function') {
      alertBox('⚠️', 'Error', error.message || 'Failed to update user. Please try again.');
    }
  }
}

// Delete user
window.deleteUser = async function(userId, userName) {
  if (typeof promptBox === 'function') {
    promptBox('⚠️', 'Confirm Deletion', `Are you sure you want to delete ${userName}?`);

    // Store the userId for the confirmation
    window.pendingDeleteUserId = userId;

    // Override the Yes button behavior
    setTimeout(() => {
      const yesBtn = document.querySelector('#alert a[title="Yes"]');
      if (yesBtn) {
        yesBtn.onclick = async () => {
          await confirmDeleteUser(window.pendingDeleteUserId);
          document.querySelector('#alert').classList.remove('alert-container');
          document.querySelector('#alert').innerHTML = '';
        };
      }
    }, 100);
  } else {
    if (confirm(`Are you sure you want to delete ${userName}?`)) {
      await confirmDeleteUser(userId);
    }
  }
}

async function confirmDeleteUser(userId) {
  try {
    if (typeof loadingBox === 'function') loadingBox();

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    await loadUsers();

    if (typeof alertBox === 'function') {
      alertBox('✓', 'Success', 'User deleted successfully!');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    if (typeof alertBox === 'function') {
      alertBox('⚠️', 'Error', error.message || 'Failed to delete user. Please try again.');
    }
  }
}

// Close modal
function closeModal() {
  document.getElementById('editUserModal').style.display = 'none';
  document.getElementById('editUserForm').reset();
}
