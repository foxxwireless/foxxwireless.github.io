const supabase = supabase.createClient(
  'https://cqhdgoysdpzlznikwpbu.supabase.co',
  'sb_publishable_ELqf182fNZkNVjyTLwPupg_2r4-ZpPQ'
);

async function loadLocations() {
  const { data, error } = await supabase.from('locations').select('*');
  if (error) {
    console.error('Error loading locations:', error);
    return;
  }

  const tbody = document.querySelector('#location-table tbody');
  tbody.innerHTML = '';
  data.forEach(loc => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${loc.name || ''}</td>
      <td>${loc.type || ''}</td>
      <td>${loc.address || ''}</td>
      <td>${loc.city || ''}</td>
      <td>${loc.state || ''}</td>
      <td>${loc.contact || ''}</td>
      <td>${loc.phone_number || ''}</td>
      <td>${loc.email || ''}</td>
      <td>${loc.permission || ''}</td>
      <td>${loc.last_setup_data || ''}</td>
      <td>${loc.times || ''}</td>
      <td>${loc.notes || ''}</td>
    `;
    tbody.appendChild(row);
  });
}

document.getElementById('location-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const location = {
    name: document.getElementById('name').value,
    type: document.getElementById('type').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    contact: document.getElementById('contact').value,
    phone_number: document.getElementById('phone_number').value,
    email: document.getElementById('email').value,
    permission: document.getElementById('permission').value,
    last_setup_data: document.getElementById('last_setup_data').value,
    times: document.getElementById('times').value,
    notes: document.getElementById('notes').value
  };

  const { error } = await supabase.from('locations').insert([location]);
  if (error) {
    console.error('Error adding location:', error);
  } else {
    loadLocations();
    e.target.reset();
  }
});

loadLocations();