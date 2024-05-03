import { AuthService } from './../shared.js';
import { clearBasket, getBasket } from './../basket.js';

const renderAuthNotice = () => {
  document.getElementById('auth-notice').innerHTML = `
    <div class="content">
      <div class="heading">
        <h4>Save $10 on delivery with an account</h4>
      </div>
      <div class="switch">
        <ul>
          <li>
            <a href="/signup.html">
              <h4>Sign up</h4>
            </a>
          </li>
          <li>
            <a class="active" href="/login.html?redirect=/flow-delivery.html">
              <h4>Log in</h4>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `;
}

const renderContent = (content) => {
  document.getElementById('order-overview-content').innerHTML = content;
}
const renderBasket = ({ flower, deliveryDate, recipient, costOverview, isAuthed }) => {

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/orders', {
        method: 'POST',
        body: JSON.stringify({
          items: [
            {
              flowerId: flower.id,
              deliveryDate,
              recipient,
            },
          ],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }

      clearBasket();
      const redirect = isAuthed ? '/orders.html' : '/index.html';
      window.location.href = redirect;
    } catch (error) {
      const encodedError = encodeURIComponent(error.message);
      window.location.href = `/index.html?error=${encodedError}`;
    }
  }

  const formattedAddress = `${recipient.address.base}, ${recipient.address.city}, ${recipient.address.state}, ${recipient.address.zipCode}`;

  renderContent(`
        <div class="order-item-gallery">
          <div class="order-item-image">
            <img src="./public/images/flowers/${flower.id}.jpg" />
          </div>
        </div>
        <div class="order-item-content">
          <div class="title">
            <h1>${flower.name}</h1>
          </div>
          <ul class="details">
            <li>
              <h4>Delivery Date</h4>
              <p>${deliveryDate}</p>
            </li>
            <li>
              <h4>Price</h4>
              <p>$${flower.price}</p>
            </li>
            <li>
              <h4>Delivery Address</h4>
              <p>${formattedAddress}</p>
            </li>
          </ul>
          <div class="cost">
            <div class="savings">
              <h4>You are saving <span class="highlight">$${costOverview.deliveryDiscount}</span> on this order!</h4>
            </div>
            <ul>
              <li>
                <span>Subtotal:</span>
                <span class="right">$${costOverview.subtotal}</span>
              </li>
              <li>
                <span>Delivery:</span>
                <span class="right">$${costOverview.delivery}</span>
              </li>
              <li>
                <span>Delivery discount:</span>
                <span class="right">$${costOverview.deliveryDiscount}</span>
              </li>
              <li>
                <span>Tax:</span>
                <span class="right">$${costOverview.tax}</span>
              </li>
              <div class="divider">
              <li>
                <span>Total:</span>
                <span class="right">$${costOverview.total}</span>
              </li>
            </ul>
          </div>
          <form id="form-confirm-order"> 
            <button class="btn" type="submit">
              <h4>Place order</h4>
            </button>
          </form>
        </div>
    `);
  document.getElementById('form-confirm-order').addEventListener('submit', onSubmit);
}

document.addEventListener('DOMContentLoaded', () => {
  const basket = getBasket();
  const firstItem = basket[0];
  if (!firstItem) {
    renderContent('No items in basket. Redirecting in 3s...');
    setTimeout(() => {
      window.location.href = './index.html';
    }, 3000);
  }

  const isAuthed = AuthService.isAuthed();
  if (!isAuthed) {
    renderAuthNotice();
  }

  const costs = {
    subtotal: firstItem.flower.price,
    delivery: 25.00,
    deliveryDiscount: isAuthed ? 10.00 : 0.00,
    tax: 0.00,
  };
  const costTotal = parseFloat(costs.subtotal + costs.delivery + costs.tax - costs.deliveryDiscount).toFixed(2);

  renderBasket({
    flower: firstItem.flower,
    costOverview: {
      ...costs,
      total: costTotal,
    },
    deliveryDate: firstItem.deliveryDate,
    recipient: firstItem.recipient,
    isAuthed,
  });

  // renderBasket({
  //   flower: {
  //     id: 1,
  //     name: "Rose Classic",
  //     price: 19.99,
  //     type: "ROSE",
  //     occasion: "MOTHERS_DAY"
  //   },
  //   costOverview: {
  //     ...costs,
  //     total: costTotal,
  //   },
  //   deliveryDate: "2024-10-10",
  //   recipient: {
  //     firstName: "John",
  //     lastName: "Doe",
  //     relationship: "PARENT",
  //     address
  //   }
  // });
});
