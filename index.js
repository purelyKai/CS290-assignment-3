/*
 * Name: Kai Black
 * Email: blackkai@oregonstate.edu
 */
// Get modal elements
const sellSomethingButton = document.getElementById('sell-something-button');
const modalBackdrop = document.getElementById('modal-backdrop');
const sellSomethingModal = document.getElementById('sell-something-modal');
const modalCloseButton = document.getElementById('modal-close');
const modalCancelButton = document.getElementById('modal-cancel');
const modalAcceptButton = document.getElementById('modal-accept');

// Get input elements from the modal
const postTextInput = document.getElementById('post-text-input');
const postPhotoInput = document.getElementById('post-photo-input');
const postPriceInput = document.getElementById('post-price-input');
const postCityInput = document.getElementById('post-city-input');
const postConditionInputs = document.querySelectorAll('input[name="post-condition"]');

// Get posts container
const postsContainer = document.getElementById('posts');

// Get filter elements
const filterText = document.getElementById('filter-text');
const filterMinPrice = document.getElementById('filter-min-price');
const filterMaxPrice = document.getElementById('filter-max-price');
const filterCity = document.getElementById('filter-city');
const filterConditionInputs = document.querySelectorAll('input[name="filter-condition"]');
const filterUpdateButton = document.getElementById('filter-update-button');

// Add event listener to open the modal when the "sell something" button is clicked
sellSomethingButton.addEventListener('click', function () {
  sellSomethingModal.classList.remove('hidden');
  modalBackdrop.classList.remove('hidden');
});

// Add event listener to close the modal when the close or cancel button is clicked
modalCloseButton.addEventListener('click', closeModal);
modalCancelButton.addEventListener('click', closeModal);

// Add event listener to create a new post when the accept button is clicked
modalAcceptButton.addEventListener('click', createNewPost);

// Add event listener to update filters when the update button is clicked
filterUpdateButton.addEventListener('click', updateFilters);

// Function to close the modal and clear input values
function closeModal() {
  sellSomethingModal.classList.add('hidden');
  modalBackdrop.classList.add('hidden');
  // Clear input values
  postTextInput.value = '';
  postPhotoInput.value = '';
  postPriceInput.value = '';
  postCityInput.value = '';
  postConditionInputs.forEach(input => (input.checked = false));
}

// Function to create a new post
function createNewPost() {
  // Get input values
  const itemDescription = postTextInput.value;
  const photoURL = postPhotoInput.value;
  const price = postPriceInput.value;
  const city = postCityInput.value;
  const condition = Array.from(postConditionInputs).find(input => input.checked)?.value;

  // Validate input values
  if (!itemDescription || !photoURL || !price || !city || !condition) {
    alert('Please fill in all fields before creating a post.');
    return;
  }

  // Create new post div
  const newPost = document.createElement('div');
  newPost.classList.add('post');
  newPost.setAttribute('data-price', price);
  newPost.setAttribute('data-city', city);
  newPost.setAttribute('data-condition', condition);

  // Create post-contents div
  const postContents = document.createElement('div');
  postContents.classList.add('post-contents');

  // Create post-image-container div
  const postImageContainer = document.createElement('div');
  postImageContainer.classList.add('post-image-container');

  // Create img element
  const img = document.createElement('img');
  img.src = photoURL;
  img.alt = itemDescription;

  // Append img to post-image-container
  postImageContainer.appendChild(img);

  // Create post-info-container div
  const postInfoContainer = document.createElement('div');
  postInfoContainer.classList.add('post-info-container');

  // Create a element
  const aElement = document.createElement('a');
  aElement.href = '#';
  aElement.classList.add('post-title');
  aElement.textContent = itemDescription;

  // Create span elements
  const priceSpan = document.createElement('span');
  priceSpan.classList.add('post-price');
  priceSpan.textContent = `$${price}`;

  const citySpan = document.createElement('span');
  citySpan.classList.add('post-city');
  citySpan.textContent = `(${city})`;

  // Append elements to post-info-container
  postInfoContainer.appendChild(aElement);
  postInfoContainer.appendChild(priceSpan);
  postInfoContainer.appendChild(citySpan);

  // Append post-image-container and post-info-container to post-contents
  postContents.appendChild(postImageContainer);
  postContents.appendChild(postInfoContainer);

  // Append post-contents to new post
  newPost.appendChild(postContents);

  // Insert the new post after existing posts
  postsContainer.appendChild(newPost);

  // Check if the city is not already in the dropdown
  const cityDropdown = document.getElementById('filter-city');
  const existingCityOption = Array
    .from(cityDropdown.options)
    .find(option => option.value.toLowerCase() === city.toLowerCase());

  if (!existingCityOption) {
    // Create a new option element
    const newCityOption = document.createElement('option');
    newCityOption.value = city;
    newCityOption.appendChild(document.createTextNode(city));

    // Append the new option to the dropdown
    cityDropdown.appendChild(newCityOption);
  }

  // Close the modal and clear input values
  closeModal();
}

// Function to update filters and display filtered posts
function updateFilters() {
  const textFilter = filterText.value.toLowerCase();
  const minPriceFilter = parseFloat(filterMinPrice.value) || 0;
  const maxPriceFilter = parseFloat(filterMaxPrice.value) || Infinity;
  const cityFilter = filterCity.value.toLowerCase();
  const conditionFilters = Array.from(filterConditionInputs)
    .filter(input => input.checked)
    .map(input => input.value.toLowerCase());

  // Iterate through each post and apply filters
  Array.from(postsContainer.children).forEach(post => {
    const price = parseFloat(post.getAttribute('data-price'));
    const city = post.getAttribute('data-city').toLowerCase();
    const condition = post.getAttribute('data-condition').toLowerCase();
    const title = post.querySelector('.post-title').innerText.toLowerCase();

    const matchesText = title.includes(textFilter);
    const matchesPrice = price >= minPriceFilter && price <= maxPriceFilter;
    const matchesCity = city.includes(cityFilter) || cityFilter === '';
    const matchesCondition = conditionFilters.length === 0 || conditionFilters.includes(condition);

    // Toggle the post's visibility based on filter matches
    post.style.display = matchesText && matchesPrice && matchesCity && matchesCondition ? 'inline-block' : 'none';
  });
}