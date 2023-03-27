// Use the Airtable API to retrieve your records
const airtable = require('airtable');
const base = airtable.base('appUX3a2EFTq8Lc9h')('keyYwqUVpSMHcmshQ');
const records = [];

base('Table 1').select({
    view: 'Grid view'
}).eachPage((page, fetchNextPage) => {
    page.forEach(record => {
        records.push(record);
    });
    fetchNextPage();
});

const resultsContainer = document.querySelector('#results-container');

function filterRecords(searchTerm) {
  const filteredRecords = records.filter(record => {
    const name = record.fields['name'].toLowerCase();
    const rating = record.fields['rating'].toString();

    return name.includes(searchTerm.toLowerCase()) || rating.includes(searchTerm);
  });

  return filteredRecords;
}

function displayFilteredRecords(filteredRecords) {
  resultsContainer.innerHTML = '';

  filteredRecords.forEach(record => {
    const container = document.createElement('div');
    container.classList.add('record-container');

    const image = document.createElement('img');
    image.src = record.fields['image'];
    container.appendChild(image);

    const name = document.createElement('h2');
    name.innerText = record.fields['name'];
    container.appendChild(name);

    const rating = document.createElement('p');
    rating.innerText = record.fields['rating'];
    container.appendChild(rating);

    resultsContainer.appendChild(container);
  });
}

displayFilteredRecords(records);

const searchInput = document.querySelector('#search-input');

searchInput.addEventListener('input', () => {
  const filteredRecords = filterRecords(searchInput.value);
  
  displayFilteredRecords(filteredRecords);
});

