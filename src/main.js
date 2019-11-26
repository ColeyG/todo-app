import '../styles/reset.css';
import '../styles/main.scss';
import 'babel-polyfill';

const todoList = document.querySelector('.todo-list tbody');

function tableItems(rowItems) {
  let response = '';
  rowItems.forEach((item) => {
    response += `<td>${item}</td>`;
  });
  return response;
}

function tableRow(row) {
  return `<tr>${row}</tr>`;
}

async function fetchData() {
  await fetch('http://localhost:3000/api', { method: 'GET', mode: 'cors' })
    .then((resp) => resp.json())
    .then((data) => {
      data.todo.forEach((listItem) => {
        if (listItem.done !== true) {
          let due = '';
          if (listItem.dueDate !== 'undefined') {
            due = listItem.dueDate.split(' ');
            due = due.slice(0, 4);
            due = due.join(' ');
          } else {
            due = '';
          }
          const rowItems = [listItem.name, due];
          const row = tableRow(`${tableItems(rowItems)}<td><button class="complete-button" id="${listItem.id}">Complete</button></td>`);
          todoList.innerHTML += row;
        }
      });
    });
}

async function getBg() {
  await fetch('https://api.scryfall.com/cards/random', { method: 'GET', mode: 'cors' })
    .then((resp) => resp.json())
    .then((data) => {
      document.querySelector('.bg').style.backgroundImage = `url(${data.image_uris.art_crop})`;
    });
}

const completeAction = (e) => {
  e.preventDefault();
  fetch(`http://localhost:3000/api?id=${e.target.id}`, { method: 'PATCH', mode: 'cors' })
    .then((resp) => resp.text())
    .then((data) => {
      if (data === 'success') {
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      }
    });
};

const initialize = () => {
  getBg().then(() => {
    document.body.style.opacity = 1;
  });
  fetchData().then(() => {
    const completeActions = document.querySelectorAll('.complete-button');
    completeActions.forEach((element) => {
      element.addEventListener('click', completeAction, false);
    });
  });
};

initialize();
