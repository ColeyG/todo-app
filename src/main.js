import '../styles/reset.css';
import '../styles/main.scss';
import 'babel-polyfill';

async function fetchData() {
  await fetch('http://localhost:3000/api', { method: 'GET', mode: 'no-cors' })
    .then((resp) => {
      console.log(resp);
      resp.text();
    })
    .then((data) => {
      console.log(data);
    });
}

const initialize = () => {
  fetchData();
};

initialize();
