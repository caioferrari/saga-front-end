const form = document.getElementById('ticketForm');
const alertContainer = document.getElementById('alertContainer');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    case_id: document.getElementById('caseId').value.trim(),
    case_type: document.getElementById('caseType').value,
    priority: document.getElementById('priority').value,
    team: document.getElementById('team').value,
    on_call: document.getElementById('onCall').checked,
    problem_description: document.getElementById('problemDescription').value.trim(),
  };

  if (!formData.case_id || !formData.case_type || !formData.priority || !formData.team || !formData.problem_description) {
    showAlert('Please fill in all required fields', 'error');
    return;
  }

  try {
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      showAlert('You must be logged in to submit a ticket', 'error');
      return;
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert([
        {
          ...formData,
          user_id: session.data.session.user.id,
        }
      ])
      .select();

    if (error) {
      showAlert(`Error submitting ticket: ${error.message}`, 'error');
      return;
    }

    showAlert('Ticket submitted successfully!', 'success');
    form.reset();

    setTimeout(() => {
      window.location.href = '/main.html';
    }, 2000);
  } catch (err) {
    showAlert(`An unexpected error occurred: ${err.message}`, 'error');
  }
});

function showAlert(message, type) {
  alertContainer.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;

  if (type === 'success') {
    setTimeout(() => {
      alertContainer.innerHTML = '';
    }, 5000);
  }
}
