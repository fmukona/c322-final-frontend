import { AuthService } from './../shared.js';
import { getBasket, setBasket } from './../basket.js';

const addAuthNotice = () => {
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

const checkAuth = async () => {
  const isAuthed = await AuthService.isAuthed();

  if (!isAuthed) {
    addAuthNotice();
  }
}

const checkBasket = async (basket) => {
  if (!basket || basket.length === 0) {
    document.getElementById('order-overview-list').innerText = 'No items in basket. Redirecting in 3s...';
    setTimeout(() => {
      window.location.href = './index.html';
    }, 3000);
  }

  if (basket[0].recipient) {
    window.location.href = './flow-confirm.html';
  }
}

const renderBasketView = async (basket) => {
  console.log("BASKET", basket);
  const firstItem = basket[0];
  if (!firstItem) {
    return;
  }
  const { flower } = firstItem;

  document.getElementById("order-overview-list").innerHTML = `
          <li>
            <div class="order-item">
              <div class="titlebar">
                <h3>${flower.name}</h3>
                <p>${flower.price}</p>
              </div>
              <div class="info">
                <div class="image">
                  <img src="./public/images/flowers/${flower.id}.jpg" />
                </div>
                <div class="content">
                  <form id="form-order-delivery">
                    <div class="form-section recipient"> 
                      <h3>Recipient</h3>
                      <div class="form-fields">
                        <div class="form-group">
                          <label for="first-name">First Name</label>
                          <input id="first-name" name="firstName" placeholder="First name" required>
                        </div>
                        <div class="form-group">
                          <label for="last-name">Last Name</label>
                          <input id="last-name" name="lastName" placeholder="Last name" required>
                        </div>
                        <div class="form-group">
                          <label for="relationship">Relationship</label>
                          <select id="relationship" name="relationship" required>
                            <option value="PARENT">Parent</option>
                            <option value="SPOUSE">Spouse</option>
                            <option value="CHILD">Child</option>
                            <option value="FRIEND">Friend</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="form-section delivery"> 
                      <h3>Deliver To</h3>
                      <div class="form-fields">
                        <div class="form-group address">
                          <label for="address">Address</label>
                          <input id="address" name="address" placeholder="Address" required>
                        </div>
                        <div class="form-group">
                          <label for="apt">Apt/Suite</label>
                          <input id="apt" name="apt" placeholder="Apt/Suite" required>
                        </div>
                       <div class="form-group">
                          <label for="city">City</label>
                          <input id="city" name="city" placeholder="City" required>
                        </div>
                        <div class="form-group">
                          <label for="state">State</label>
                          <select id="state" name="state" required>
	                          <option value="AL">Alabama</option>
	                          <option value="AK">Alaska</option>
	                          <option value="AZ">Arizona</option>
	                          <option value="AR">Arkansas</option>
	                          <option value="CA">California</option>
	                          <option value="CO">Colorado</option>
	                          <option value="CT">Connecticut</option>
	                          <option value="DE">Delaware</option>
	                          <option value="DC">District Of Columbia</option>
	                          <option value="FL">Florida</option>
	                          <option value="GA">Georgia</option>
	                          <option value="HI">Hawaii</option>
	                          <option value="ID">Idaho</option>
	                          <option value="IL">Illinois</option>
	                          <option value="IN">Indiana</option>
	                          <option value="IA">Iowa</option>
	                          <option value="KS">Kansas</option>
	                          <option value="KY">Kentucky</option>
	                          <option value="LA">Louisiana</option>
	                          <option value="ME">Maine</option>
	                          <option value="MD">Maryland</option>
	                          <option value="MA">Massachusetts</option>
	                          <option value="MI">Michigan</option>
	                          <option value="MN">Minnesota</option>
	                          <option value="MS">Mississippi</option>
	                          <option value="MO">Missouri</option>
	                          <option value="MT">Montana</option>
	                          <option value="NE">Nebraska</option>
	                          <option value="NV">Nevada</option>
	                          <option value="NH">New Hampshire</option>
	                          <option value="NJ">New Jersey</option>
	                          <option value="NM">New Mexico</option>
	                          <option value="NY">New York</option>
	                          <option value="NC">North Carolina</option>
	                          <option value="ND">North Dakota</option>
	                          <option value="OH">Ohio</option>
	                          <option value="OK">Oklahoma</option>
	                          <option value="OR">Oregon</option>
	                          <option value="PA">Pennsylvania</option>
	                          <option value="RI">Rhode Island</option>
	                          <option value="SC">South Carolina</option>
	                          <option value="SD">South Dakota</option>
	                          <option value="TN">Tennessee</option>
	                          <option value="TX">Texas</option>
	                          <option value="UT">Utah</option>
	                          <option value="VT">Vermont</option>
	                          <option value="VA">Virginia</option>
	                          <option value="WA">Washington</option>
	                          <option value="WV">West Virginia</option>
	                          <option value="WI">Wisconsin</option>
	                          <option value="WY">Wyoming</option>
                          </select>
                        </div>
                        <div class="form-group">
                          <label for="zip-code">Zip Code</label>
                          <input type="number" id="zip-code" name="zip-code" placeholder="Zip Code" required>
                        </div>
                      </div>
                    </div>
                    <div class="form-section action">
                      <button class="btn" type="submit">
                        <h4>Continue</h4>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </li>
  `;
  document.getElementById("form-order-delivery").addEventListener('submit', async (event) => {
    console.log("SUBMIT");
    event.preventDefault();
    const form = event.target;

    const recipient = {
      firstName: form.querySelector('#first-name').value,
      lastName: form.querySelector('#last-name').value,
      relationship: form.querySelector('#relationship').value,
      address: {
        base: form.querySelector('#address').value,
        apt: form.querySelector('#apt').value,
        city: form.querySelector('#city').value,
        state: form.querySelector('#state').value,
        zipCode: form.querySelector('#zip-code').value,
      }
    }

    console.log("RECIPIENT", recipient);

    firstItem.recipient = recipient;
    setBasket([firstItem]);

    window.location.href = './flow-confirm.html';
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  (async () => {

    const basket = getBasket();
    console.log("BASKET length", basket.length);
    await checkBasket(basket);

    //allow lazy loading of auth notice
    checkAuth();

    renderBasketView(basket);
  })();
});
