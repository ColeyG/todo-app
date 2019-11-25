import '../styles/reset.css';
import '../styles/main.scss';
import 'babel-polyfill';

async function fetchData() {
  await fetch('http://localhost:3000/api', { method: 'GET', mode: 'cors' })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);
    });
}

fetchData();
