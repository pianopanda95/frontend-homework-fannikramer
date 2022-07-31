const username = 'user3472';
const apiKey = '0f6aa487-0f3b-41dc-95be-86c19dd0b98d';

const brandInput = document.querySelector('#brand');
const dataListBrands = document.querySelector(`datalist#brands`);

const categoryInput = document.querySelector('#category');


const fetchData = element => {

    const displaySearchResults = name => {
        const suggestion = document.createElement('option');
        suggestion.textContent = name;
        dataListBrands.appendChild(suggestion);
    }

    element.addEventListener('input', () => {

        fetch(`https://size-calculator-api.sspinc.io/brands?name_prefix=${element.value}`, {
            mode: 'cors',
            credentials: 'include',
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(`${username}:${apiKey}`)
            }
        })
        .then(response => response.json())
        .then(data => {
            const currentList = data.brands.map(brand => brand.name);
            console.log(currentList)
            dataListBrands.childNodes.forEach(node => node.remove());
            currentList.map(brandName => displaySearchResults(brandName));
        })
        .catch(error => console.log(error)); 
    })
};

fetchData(brandInput);
fetchData(categoryInput);


