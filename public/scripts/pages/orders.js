import { AuthService, OrdersService } from './../shared.js';

const queryOrders = async () => {
  const setContent = (content) => {
    console.log("setContent", content);
    const ordersTableBody = document.getElementById('orders-rows');
    ordersTableBody.innerHTML = content;
  }

  try {
    setContent('<p>Loading...</p>');

    const orders = await OrdersService.getOrders();
    console.log(orders);
    if (!orders || orders.length === 0) {
      setContent('<p>No orders found</p>');
      return;
    }

    setContent(orders.map(order => {
      const firstItem = order.items[0];
      if (!firstItem) {
        return '';
      }

      return `<tr>
          <td>${order.id}</td>
          <td>${firstItem.flower.name}</td>
          <td>$${order.costTotal.toFixed(2)}</td>
          <td>${firstItem.recipient.firstName} ${firstItem.recipient.lastName}</td>
          <td>${order.status}</td>
        </tr>`;
    }).join(''))
  } catch (error) {
    console.error(error);
    setContent('<p>Failed to load orders</p>');
  }
}

window.onload = function () {
  (async () => {
    const isAuthed = await AuthService.isAuthed();
    if (!isAuthed) {
      window.location.href = './login.html';
      return;
    }

    queryOrders();
  })();
}
