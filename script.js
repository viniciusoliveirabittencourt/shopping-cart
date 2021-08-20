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

function removeLiFromOl(dom) {
  return dom.addEventListener('click', function() {
    dom.parentNode.removeChild(dom);
  });
}

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  const id = getSkuFromProductItem(event.parentNode);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((r) => r.json())
    .then((r) => createCartItemElement(r))
    .then((r) => {
      ol.appendChild(r);
      return r;
    })
    .then((r) => removeLiFromOl(r));
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addCarShoppingThing() {
  const button = document.querySelectorAll('.item__add');
  button.forEach((element) => element.addEventListener('click', function() {
    cartItemClickListener(element);
  }))
}

async function tentandoFazerAParada() {
  const section = document.querySelector('.items');
  fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador")
    .then((r) => r.json())
    .then((r) => r.results)
    .then((r) => r.forEach((element) => section.appendChild(createProductItemElement(element))))
    .then((r) => addCarShoppingThing());
}

window.onload = () => {
  tentandoFazerAParada();
};
