// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/
Search for specific products
This endpoint accepts the following optional query string parameters:
- `page` - page of products to return
- `size` - number of products to return
GET https://clear-fashion-api.vercel.app/brands
Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};
let p50 = 0;
let p90 = 0;
let p95 = 0;

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

const sortSelect = document.querySelector('#sort-select');
const brandSelect = document.querySelector('#brand-select');

const showP50 = document.querySelector('#p50');
const showP90 = document.querySelector('#p90');
const showP95 = document.querySelector('#p95');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({ result, meta }) => {
    currentProducts = result;
    currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, sort = null, brand = null) => {
    try {
        const response = await fetch(
            `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
        );
        const body = await response.json();

        if (body.success !== true) {
            console.error(body);
            return { currentProducts, currentPagination };
        }
        var result = body.data.result;

        var meta = {
            currentPage: page,
            pageCount: Math.ceil(result.length / size),
            pageSize: size,
            count: result.length
        };


        switch (brand) {
            case 'loom':
                result = result.filter(product => product.brand == "loom")
                break;
            case 'coteleparis':
                result = result.filter(product => product.brand == "coteleparis")
                break;
        }

        switch (sort) {
            case 'price-desc':
                result = result.sort((a, b) => b.price - a.price);
                break;
            case 'price-asc':
                result = result.sort((a, b) => a.price - b.price);
                break;
            case 'date-asc':
                result = result.sort((a, b) => new Date(b.released) - new Date(a.released));
                break;
            case 'date-desc':
                result = result.sort((a, b) => new Date(a.released) - new Date(b.released));
                break;
        }
        if (result.length > 0) {
            let sortPrice = [...result].sort((a, b) => a.price - b.price)
            p50 = sortPrice[Math.floor(result.length * 0.5)].price;
            p90 = sortPrice[Math.floor(result.length * 0.9)].price;
            p95 = sortPrice[Math.floor(result.length * 0.95)].price;

            const DateReleased = [...result].sort((a, b) => new Date(b.released) - new Date(a.released));
            lastDateReleased = DateReleased[0].released;
        }
        else { p50 = 0; p90 = 0; p95 = 0; }

        result = result.slice((page - 1) * size, page * size);
        return { result, meta };
        //return body.data;
    } catch (error) {
        console.error(error);
        return { currentProducts, currentPagination };
    }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    const template = products
        .map(product => {
            return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
        <span>${product.released}</span>
      </div>
    `;
        })
        .join('');

    div.innerHTML = template;
    fragment.appendChild(div);
    sectionProducts.innerHTML = '<h2>Products</h2>';
    sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
    const { currentPage, pageCount } = pagination;
    const options = Array.from(
        { 'length': pageCount },
        (value, index) => `<option value="${index + 1}">${index + 1}</option>`
    ).join('');

    selectPage.innerHTML = options;
    selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
    const { count } = pagination;

    spanNbProducts.innerHTML = count;
    showP50.innerHTML = p50;
    showP90.innerHTML = p90;
    showP95.innerHTML = p95;
};

const render = (products, pagination) => {
    renderProducts(products);
    renderPagination(pagination);
    renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
    const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value), sortSelect.value, brandSelect.value);

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

selectPage.addEventListener('change', async (event) => {
    const products = await fetchProducts(event.target.value , currentPagination.pageSize, sortSelect.value, brandSelect.value);

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

sortSelect.addEventListener('change', async (event) => {
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, event.target.value, brandSelect.value);

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

brandSelect.addEventListener('change', async (event) => {
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, sortSelect.value, event.target.value);

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchProducts(currentPagination.currentPage, currentPagination.pageSize, sortSelect.value, brandSelect.value);

    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

