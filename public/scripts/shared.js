export const CONSTANTS = {
  apiBaseUrl: 'https://backend-fmukona.onrender.com',
}

export class AuthService {
  static async login({ email, password }) {
    const response = await fetch(`${CONSTANTS.apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
  }

  static async register({ email, password }) {
    const response = await fetch(`${CONSTANTS.apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
  }

  static async isAuthed() {
    const response = await fetch(`${CONSTANTS.apiBaseUrl}/auth/check`, {
      method: 'GET',
      credentials: 'include'
    });

    return response.status === 200;
  }
}

export class FlowersService {
  static async getFlowers({ filters, sort }) {
    // return [{
    //   id: 1,
    //   name: 'Rose',
    //   price: 10,
    //   image: 'https://via.placeholder.com/150',
    // }, {
    //   id: 2,
    //   name: 'Lily',
    //   price: 15,
    //   image: 'https://via.placeholder.com/150',
    // }, {
    //   id: 3,
    //   name: 'Tulip',
    //   price: 20,
    //   image: 'https://via.placeholder.com/150',
    // }];

    const queryParams = new URLSearchParams();
    if (filters) {
      // url += `?filters=${filters}`;
      if (filters.types) {
        queryParams.append('types', filters.types.join(','));
      }
      if (filters.occasions) {
        queryParams.append('occasions', filters.occasions.join(','));
      }
      if (filters.colors) {
        queryParams.append('colors', filters.colors.join(','));
      }
    }
    if (sort) {
      let direction = "DESC";
      if (sort.direction == 1) {
        direction = "ASC";
      }

      queryParams.append('sort', `${sort.field},${direction}`);
    }

    const response = await fetch(`${CONSTANTS.apiBaseUrl}/flowers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
    const data = await response.json();
    return data;
  }

  static async getFlower(id) {
    const response = await fetch(`${CONSTANTS.apiBaseUrl}/flowers/${id}`);
    const data = await response.json();
    return data;
  }
}

export class OrdersService {
  static async createOrder({ items }) {
    const response = await fetch(`${CONSTANTS.apiBaseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });
    const data = await response.json();
    return data;

  }
  static async getOrders() {
    const response = await fetch(`${CONSTANTS.apiBaseUrl}/orders`, {
      credentials: 'include',
    });
    const data = await response.json();
    return data;
  }
}
