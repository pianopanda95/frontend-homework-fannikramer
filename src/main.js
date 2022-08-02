const username = 'user3472';
const apiKey = '0f6aa487-0f3b-41dc-95be-86c19dd0b98d';

const fetchObject = {
    mode: 'cors',
    credentials: 'include',
    method: 'GET',
    headers: {
        'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`),
    },
}


const brandInput = document.querySelector('#brand');
const dataListBrands = document.querySelector(`datalist#brands`);
const categorySelect = document.querySelector('#category');
const size = document.querySelector('input[type="number"]');
const calculateButton = document.querySelector('button');


const displaySearchResults = (fetchedObj, attributeName, parent) => {
    const suggestion = document.createElement('option');
    suggestion.setAttribute(attributeName, fetchedObj.id);
    suggestion.textContent = fetchedObj.name;
    parent.appendChild(suggestion);
}

const clearCategories = () => {
    if (categorySelect.children.length > 1) {
        const categoryNodes = Array.from(categorySelect.children);
        categoryNodes.shift();
        categoryNodes.forEach(node => node.remove());
    }
}

brandInput.addEventListener('input', () => {

    clearCategories()

    fetch(`https://size-calculator-api.sspinc.io/brands?name_prefix=${brandInput.value}`, fetchObject)
        .then(response => response.json())
        .then(data => {
            dataListBrands.innerHTML = '';
            data.brands.map(brand => displaySearchResults(brand, 'data', dataListBrands));
        })
        .catch(error => console.log(error));
});


categorySelect.addEventListener('focus', () => {

    let selectedBrandId = dataListBrands.firstChild.getAttribute('data');

    if (categorySelect.children.length <= 1) {
        fetch(`https://size-calculator-api.sspinc.io/categories?brand_id=${selectedBrandId}`, fetchObject)
            .then(response => response.json())
            .then(data => data.categories.map(category =>
                        displaySearchResults(category, 'value', categorySelect)))
            .catch(error => console.log(error));
    }
});

const createResultPage = result =>{
    const fieldset = document.querySelector('fieldset');

    const fieldsetNodes = Array.from(fieldset.children);
    fieldsetNodes.forEach(node => node.remove());

    const firstLine = document.createElement('p');
    firstLine.textContent = 'Your size is';

    const resultLine = document.createElement('p');
    resultLine.classList.add('result');
    resultLine.textContent = result;

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';

    fieldset.appendChild(firstLine);
    fieldset.appendChild(resultLine);
    fieldset.appendChild(okButton);
}
calculateButton.addEventListener('click', (e) => {
    e.preventDefault(); //temporary
    let selectedBrandId = dataListBrands.firstChild.getAttribute('data');
    const selectedCategoryId = document.querySelector('#category').value;

    fetch(`https://size-calculator-api.sspinc.io/sizes?brand_id=${selectedBrandId}&category_id=${selectedCategoryId}&measurement=${size.value}`, fetchObject)
    .then(response => response.json())
    .then(data => {
        const result = data.sizes.length ?
            data.sizes.map(size => size.label).join(' or '):
            `No size found for these parameters`;
        createResultPage(result);
    });
})