import { FlowersService } from './../shared.js';

let filters = undefined;
let sort = undefined;

const queryFlowers = async () => {
  const setContent = (content) => {
    const productList = document.getElementById('products');
    productList.innerHTML = content;
  }

  try {
    setContent('Loading...');

    const flowers = await FlowersService.getFlowers({ filters, sort });

    if (!flowers || flowers.length === 0) {
      setContent('<p>No flowers found</p>');
      return;
    }

    setContent(flowers.map(flower => {
      return `<li>
          <a class="product-card" href="./flowers.html?id=${flower.id}">
            <div class="product-image">
              <img src="./public/images/flowers/${flower.id}.jpg" alt="${flower.name}" />
            </div>
            <div class="product-content">
              <h4 class="title">${flower.name}</h4>
              <p class="price">$${flower.price}</p>
            </div>
          </a>
        </li>`;
    }).join(''))
  } catch (error) {
    console.error(error);
    setContent('<p>Failed to load flowers</p>');
  }
}

const checkURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  if (error) {
    const message = decodeURIComponent(error);
    alert("ERROR: " + message);
  }
}

const applyFilter = (field, value) => {
  if (!filters) {
    filters = {};
  }
  filters[field] = value;
}
const applySort = (field, direction) => {
  sort = { field, direction };
}

const onLoad = async () => {
  queryFlowers();
  checkURL();

  document.getElementById('flower-filter-type').addEventListener('change', async (event) => {
    const type = event.target.value;
    if (type === "MIXED") {
      applyFilter('types', ['ROSE', 'LILY', 'TULIP', 'DAISY']);
    } else {
      applyFilter('types', [type]);
    }

    queryFlowers();
  });
  document.getElementById('flower-filter-occasion').addEventListener('change', async (event) => {
    const occasion = event.target.value;

    applyFilter('occasions', [occasion]);
    queryFlowers();
  });
  document.getElementById('flower-filter-color').addEventListener('change', async (event) => {
    const color = event.target.value;
    if (color === "MIXED") {
      applyFilter('colors', ['RED', 'YELLOW', 'GREEN', 'ORANGE']);
    } else {
      applyFilter('colors', [color]);
    }

    queryFlowers();
  });
  document.getElementById('flower-sort').addEventListener('change', async (event) => {
    // const [field, direction] = event.target.value.split(',');
    // applySort(field, direction);
    switch (event.target.value) {
      case 'price-lth':
        applySort('price', 1);
        break;
      case 'price-htl':
        applySort('price', -1);
        break;
    }

    queryFlowers();
  })
}

document.addEventListener('DOMContentLoaded', onLoad);
