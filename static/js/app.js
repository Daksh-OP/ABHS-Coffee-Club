// app.js

async function populateMenu() {
  await fetchMenu();

  const drinkSelect = document.getElementById('drinkSelect');
  drinks.forEach(drink => {
    const option = document.createElement('option');
    option.value = drink;
    option.textContent = drink.charAt(0).toUpperCase() + drink.slice(1);
    drinkSelect.appendChild(option);
  });

  const sizeSelect = document.getElementById('sizeSelect');
  sizes.forEach(size => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = size.charAt(0).toUpperCase() + size.slice(1);
    sizeSelect.appendChild(option);
  });

  const customizationsContainer = document.getElementById('customizationsContainer');
  for (const [cust, price] of Object.entries(customizations)) {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = cust;
    label.appendChild(checkbox);
    label.append(` ${cust.charAt(0).toUpperCase() + cust.slice(1)} (+$${price.toFixed(2)})`);
    customizationsContainer.appendChild(label);
  }
}

async function placeOrder() {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) {
    alert('Please enter your name.');
    return;
  }

  const drink = document.getElementById('drinkSelect').value;
  const size = document.getElementById('sizeSelect').value;

  const customizationsContainer = document.getElementById('customizationsContainer');
  const checkedBoxes = customizationsContainer.querySelectorAll('input[type="checkbox"]:checked');
  const selectedCustomizations = Array.from(checkedBoxes).map(cb => cb.value);

  const response = await fetch('/api/order', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, drink, size, customizations: selectedCustomizations})
  });

  if (response.ok) {
    const order = await response.json();
    showOrder(order);
  } else {
    alert('Failed to place order.');
  }
}

function showOrder(order) {
  const summary = document.getElementById('orderSummary');
  const details = document.getElementById('orderDetails');
  const price = document.getElementById('orderPrice');
  const time = document.getElementById('orderTime');

  let customText = '';
  if (order.customizations.length > 0) {
    customText = ' with ' + order.customizations.join(', ');
  }

  details.textContent = `${order.size.charAt(0).toUpperCase() + order.size.slice(1)} ${order.drink.charAt(0).toUpperCase() + order.drink.slice(1)}${customText}`;
  price.textContent = order.price.toFixed(2);
  time.textContent = order.time;

  summary.style.display = 'block';
}

document.getElementById('orderBtn').addEventListener('click', placeOrder);

// On page load
window.onload = populateMenu;
