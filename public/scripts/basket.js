/*
 * Basket item structure:
 * {
 *  flower: { ... }
 *  deliveryDate?: string
 *  recipient?: { ... }
 * }
 * */

const CONSTANTS = {
  localStorageKey: "ecommerce",
  basketCountElementId: "basket-count",
}

const constructLocalStorageKey = (key) => {
  return `${CONSTANTS.localStorageKey}.${key}`
}

export const getBasket = () => {
  let basket = localStorage.getItem(constructLocalStorageKey('basket'))
  // If not find in storage, initialize it
  if (basket == null) {
    basket = []
    localStorage.setItem(constructLocalStorageKey('basket'), JSON.stringify(basket))
  }

  return basket ? JSON.parse(basket) : []
}

export const setBasket = (basket) => {
  localStorage.setItem(constructLocalStorageKey('basket'), JSON.stringify(basket))
}

export const addToBasket = (flower) => {
  console.log('addToBasket', flower);

  let basket = getBasket()
  if (basket.length > 0) {
    basket = []
  }

  basket.push(flower);

  setBasket(basket);
}

export const clearBasket = () => {
  setBasket([])
}

const subscribeBasket = (callback) => {
  window.addEventListener('storage', (event) => {
    if (event.key === constructLocalStorageKey('basket')) {
      callback(getBasket())
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const setBasketCount = (length) => {
    const basketCountElement = document.getElementById(CONSTANTS.basketCountElementId);
    basketCountElement.innerText = length;
  };

  const basket = getBasket();
  setBasketCount(basket.length);

  subscribeBasket((basket) => {
    setBasketCount(basket.length);
  });
});
