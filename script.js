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

function cartItemClickListener(event) {
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

function addLiInShoppingCart(element) {
  const ol = document.querySelector('.cart__items');
  const id = getSkuFromProductItem(element.parentNode);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((r) => r.json())
    .then((r) => createCartItemElement(r))
    .then((r) => ol.appendChild(r));
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
};
