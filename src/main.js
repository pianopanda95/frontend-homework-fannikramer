const username = 'user3472';
const apiKey = '0f6aa487-0f3b-41dc-95be-86c19dd0b98d';

const brandInput = document.querySelector('#brand');
const dataListBrands = document.querySelector(`datalist#brands`);

const categorySelect = document.querySelector('#category');

const displaySearchResults = (fetchedObj, attributeName, parent) => {
    const suggestion = document.createElement('option');
    suggestion.setAttribute(attributeName, fetchedObj.id);
    suggestion.textContent = fetchedObj.name;
    parent.appendChild(suggestion);
}

brandInput.addEventListener('input', () => {

    if (categorySelect.children.length > 1) {
        const categoryNodes = Array.from(categorySelect.children);
        categoryNodes.shift();
        categoryNodes.forEach(node => node.remove());
    }

    fetch(`https://size-calculator-api.sspinc.io/brands?name_prefix=${brandInput.value}`, {
        mode: 'cors',
        credentials: 'include',
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`)
        }
    })
    .then(response => response.json())
    .then(data => {
        dataListBrands.innerHTML = '';
        data.brands.map(brand => displaySearchResults(brand, 'data', dataListBrands));
    })
    .catch(error => console.log(error)); 
});


categorySelect.addEventListener('focus', () => {

    const selectedBrandId = dataListBrands.firstChild.getAttribute('data');
        fetch(`https://size-calculator-api.sspinc.io/categories?brand_id=${selectedBrandId}`, {
            mode: 'cors',
            credentials: 'include',
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`)
            }
        })
        .then(response => response.json())
        .then(data => {
            data.categories.map(category => displaySearchResults(category, 'value', categorySelect));
        })
    .catch(error => console.log(error)); 
});

