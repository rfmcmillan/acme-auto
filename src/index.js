import axios from 'axios';

const userList = document.querySelector('#user-list');
const carList = document.querySelector('#car-list');
const saleList = document.querySelector('#sale-list');
console.log(userList, carList, saleList);

let users, sales;

const renderUsers = (users) => {
  const userId = window.location.hash.slice(1);
  userList.innerHTML = users
    .map((user) => {
      return `
      <li class=${userId === user.id ? 'selected' : ''}>
        <a href="#${user.id}">${user.name}</a>
      </li>`;
    })
    .join('');
};

carList.addEventListener('click', async (event) => {
  const target = event.target;
  const userId = window.location.hash.slice(1);
  if (target.tagName === 'BUTTON') {
    const _sale = {
      carId: target.getAttribute('data-id'),
      //the '!!' below will convert something that's falsy or truthy into a boolean without changing it from truthy to falsy or vice versa
      extendedWarranty: !!target.getAttribute('data-warranty'),
    };
    const response = await axios.post(`/api/users/${userId}/sales`, _sale);
    const sale = response.data;
    sales.push(sale);
    renderSales(sales);
  }
});

const renderCars = (cars) => {
  carList.innerHTML = cars
    .map((car) => {
      return `
      <li>
      ${car.name}
      <br/>
      <button data-id='${car.id}' data-warranty='true'>Add With Warranty</button>
      <button data-id='${car.id}'>Add Without Warranty</button>
      </li>
      `;
    })
    .join('');
};

const renderSales = (sales) => {
  saleList.innerHTML = sales
    .map((sale) => {
      return `
      <li>
        ${sale.car.name}
        ${sale.extendedWarranty ? ' with warranty ' : ''}
      </li>`;
    })
    .join('');
};
const init = async () => {
  try {
    users = (await axios.get('/api/users')).data;
    const cars = (await axios.get('/api/cars')).data;
    renderUsers(users);
    renderCars(cars);
    const userId = window.location.hash.slice(1);
    if (userId) {
      const url = `/api/users/${userId}/sales`;
      sales = (await axios(url)).data;
      renderSales(sales);
    }
  } catch (error) {
    console.log(error);
  }
};

window.addEventListener('hashchange', async () => {
  const userId = window.location.hash.slice(1);
  const url = `/api/users/${userId}/sales`;
  sales = (await axios(url)).data;
  renderSales(sales);
  renderUsers(users);
});

init();
