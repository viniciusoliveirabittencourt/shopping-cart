function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function calcPrice() {
  const span = document.querySelector('.total-price');
  const price = JSON.parse(localStorage.getItem('carItem'));
  const priceRedu = price.reduce((number, index) => number + index.price, 0);
  span.innerText = priceRedu.toString();
}

function cartItemClickListener(event) {
  const split = event.innerText.split(' ');
  const arrStorage = JSON.parse(localStorage.getItem('carItem'));
  const indexOF = arrStorage.indexOf(arrStorage.find((element) => element.id === split[1]));
  arrStorage.splice(indexOF, 1);
  localStorage.setItem('carItem', JSON.stringify(arrStorage));
  calcPrice();
  return event.parentNode.removeChild(event);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', function () {
    cartItemClickListener(li);
  });
  return li;
}

function addLocalStorage(obj) {
  const arrLstorage = JSON.parse(localStorage.getItem('carItem') || '[]');
  if (obj === undefined) {
    const ol = document.querySelector('.cart__items');
    arrLstorage.forEach((element) => {
      const li = createCartItemElement(element);
      ol.appendChild(li);
    });
    return ol;
  }
  arrLstorage.push({ id: obj.id, title: obj.title, price: obj.price });
  localStorage.setItem('carItem', JSON.stringify(arrLstorage));
  return { id: obj.id, title: obj.title, price: obj.price };
}

function addLiInShoppingCart(element) {
  const ol = document.querySelector('.cart__items');
  const id = getSkuFromProductItem(element.parentNode);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((r) => r.json())
    .then((r) => {
      addLocalStorage(r);
      return createCartItemElement(r);
    })
    .then((r) => {
      ol.appendChild(r);
      calcPrice();
    });
}

async function addCarShoppingThing() {
  const button = document.querySelectorAll('.item__add');
  button.forEach((element) => element.addEventListener('click', function () {
    addLiInShoppingCart(element);
  }));
}

async function tentandoFazerAParada() {
  const section = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((r) => r.json())
    .then((r) => r.results)
    .then((r) => r.forEach((element) => section.appendChild(createProductItemElement(element))))
    .then((_) => addCarShoppingThing());
}

window.onload = () => {
  tentandoFazerAParada();
  addLocalStorage();
  calcPrice();
};
