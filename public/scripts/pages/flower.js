import { FlowersService } from './../shared.js';
import { addToBasket } from './../basket.js'

const queryFlower = async (id) => {
  const setContent = (content) => {
    const flower = document.getElementById('flower');
    flower.innerHTML = content;
  }

  if (!id) {
    setContent('<p>No flower id provided</p>');
    return;
  }

  try {
    setContent('Loading...');

    const flower = await FlowersService.getFlower(id);
    if (!flower) {
      setContent('<p>No flower by id found</p>');
      return;
    }

    const onAddToBasket = (event) => {
      event.preventDefault();
      const form = event.target;

      const deliveryDate = form.querySelector('#delivery-date').value;

      console.log(deliveryDate);

      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      if (!id) {
        window.location.href = './index.html';
        return;
      }

      addToBasket({
        flower,
        deliveryDate,
      });

      window.location.href = './flow-delivery.html';
    }

    setContent(`
        <div class="flower-gallery">
          <div class="flower-image">
            <img src="./public/images/flowers/${flower.id}.jpg" />
          </div>
        </div>
        <div class="flower-content">
          <div class="title">
            <h1>${flower.name}</h1>
          </div>
          <form id="flower-form"> 
            <div class="form-group">
              <label for="delivery-date">Delivery Date</label>
              <input type="date" id="delivery-date" name="delivery-date" required>
            </div>
            <div class="form-group purchase-options">
              <label for="purchase-options">Purchase Options</label>
              <div class="option">
                <input type="radio" id="one_time" name="purchase-options" value="one-time" checked>
                <label for="one-time">
                  <span class="title">One time purchase: $${flower.price}</span>
                </label>
              </div>
            </div>
            <button class="btn" type="submit">
              <h4>Add to Basket</h4>
            </button>
          </form>
        </div>
      `
    )
    document.getElementById('flower-form').addEventListener('submit', onAddToBasket);
  } catch (error) {
    console.error(error);
    setContent('<p>Failed to load flowers</p>');
  }
}

window.onload = function () {
  (async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id');
    await queryFlower(id);
  })();
}
