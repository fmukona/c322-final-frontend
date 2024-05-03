import { AuthService } from './../shared.js';

const checkAuth = async () => {
  const isAuthed = await AuthService.isAuthed();

  if (isAuthed) {
    window.location.href = './index.html';
  }
}
window.onload = function () {
  checkAuth();

  document.getElementById('form-signup').addEventListener('submit', function (event) {
    event.preventDefault();
    var form = this;

    (async () => {
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }

        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        if (redirect) {
          window.location.href = redirect;
          return;
        } else {
          window.location.href = './index.html#';
          return;
        }
      } catch (error) {
        console.error('Error:', error.message);
        // alert("ERROR: " + error.message);

        const messageEncoded = encodeURIComponent(error.message);
        window.location.href = `/index.html?error=${messageEncoded}`;
        return;
      }
    })();
  });
}

