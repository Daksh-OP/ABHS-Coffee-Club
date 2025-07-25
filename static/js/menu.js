// menu.js

// Will be populated from server API on page load
let drinks = [];
let sizes = [];
let customizations = {};

async function fetchMenu() {
  const response = await fetch('/api/menu');
  if (response.ok) {
    const data = await response.json();
    drinks = data.drinks;
    sizes = data.sizes;
    customizations = data.customizations;
  } else {
    alert('Failed to load menu data.');
  }
}
