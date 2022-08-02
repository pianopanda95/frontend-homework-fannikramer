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
const categoryInput = document.querySelector('#category');
const dataListCategories = document.querySelector(`datalist#categories`);

const size = document.querySelector('input[type="number"]');
const calculateButton = document.querySelector('button');


const displaySearchResults = (fetchedObj, parent) => {
    const suggestion = document.createElement('option');
    suggestion.setAttribute('data', fetchedObj.id);
    suggestion.textContent = fetchedObj.name;

    parent.appendChild(suggestion);
}

const clearCategories = () => {
    const categoryNodes = dataListCategories.children;
    if (categoryNodes.length > 0) {
        console.log('in if', categoryNodes)
        Array.from(categoryNodes).forEach(node => node.remove());
        categoryInput.value = '';
    }
}

brandInput.addEventListener('input', () => {

    clearCategories()

    fetch(`https://size-calculator-api.sspinc.io/brands?name_prefix=${brandInput.value}`, fetchObject)
        .then(response => response.json())
        .then(data => {
            dataListBrands.innerHTML = '';
            data.brands.map(brand => displaySearchResults(brand, dataListBrands));
        })
        .catch(error => console.log(error));
});


categoryInput.addEventListener('focus', () => {

    let selectedBrandId = dataListBrands.firstChild.getAttribute('data');

    if (dataListCategories.children.length === 0) {
        fetch(`https://size-calculator-api.sspinc.io/categories?brand_id=${selectedBrandId}`, fetchObject)
            .then(response => response.json())
            .then(data => data.categories.map(category =>
                        displaySearchResults(category, dataListCategories)))
            .catch(error => console.log(error));
    }
});

const createResultPage = result =>{
    const fieldset = document.querySelector('fieldset');

    const fieldsetNodes = Array.from(fieldset.children);
    fieldsetNodes.forEach(node => node.remove());

    const firstLine = document.createElement('p');
    firstLine.classList.add('result-first-line');
    firstLine.textContent = 'Your size is';

    const resultLine = document.createElement('p');
    resultLine.classList.add('result');
    if (/^(No size found)/.test(result))
        resultLine.classList.add('no-size');
    resultLine.textContent = result;

    const okButton = document.createElement('button');
    okButton.textContent = 'OK';

    fieldset.appendChild(firstLine);
    fieldset.appendChild(resultLine);
    fieldset.appendChild(okButton);
}
calculateButton.addEventListener('click', (e) => {
    e.preventDefault();

    const selectedBrandId = dataListBrands.firstChild.getAttribute('data');
    const selectedCategoryId = Array.from(dataListCategories.children)
                    .find(opt => opt.textContent === categoryInput.value)
                    .getAttribute('data');

    fetch(`https://size-calculator-api.sspinc.io/sizes?brand_id=${selectedBrandId}&category_id=${selectedCategoryId}&measurement=${size.value}`, fetchObject)
    .then(response => response.json())
    .then(data => {
        const result = data.sizes.length ?
            data.sizes.map(size => size.label).join(' or '):
            `No size found for these parameters`;
        createResultPage(result);
    });
})