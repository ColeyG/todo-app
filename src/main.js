import '../styles/reset.css';
import '../styles/main.scss';
import 'babel-polyfill';

const todoList = document.querySelector('.todo-list tbody');
const todoComplete = document.querySelector('.todo-complete tbody');
const addData = document.querySelector('.add-button');
const config = require('./config.json');

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
  await fetch(`${config.mongoHost}`, { method: 'GET', mode: 'cors' })
    .then((resp) => resp.json())
    .then((data) => {
      data.todo.forEach((listItem) => {
        let due = '';
        if (listItem.dueDate !== 'undefined') {
          due = listItem.dueDate.split(' ');
          due = due.slice(0, 4);
          due = due.join(' ');
        } else {
          due = '';
        }
        const rowItems = [listItem.name, due];
        if (listItem.done !== true) {
          const row = tableRow(`${tableItems(rowItems)}<td><button class="complete-button" id="${listItem.id}">Complete</button></td>`);
          todoList.innerHTML += row;
        } else {
          const row = tableRow(`${tableItems(rowItems)}<td></td>`);
          todoComplete.innerHTML += row;
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
  fetch(`${config.mongoHost}?id=${e.target.id}`, { method: 'PATCH', mode: 'cors' })
    .then((resp) => resp.text())
    .then((data) => {
      if (data === 'success') {
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      }
    });
};

const newEntry = (e) => {
  e.preventDefault();
  const todoItem = document.querySelector('.todo-item').value;
  const todoDate = document.querySelector('.todo-date').value;
  console.log(todoItem, todoDate);
  fetch(`${config.mongoHost}?name=${todoItem}&date=${todoDate}`, { method: 'POST', mode: 'cors' })
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
  addData.addEventListener('click', newEntry, false);
};

initialize();
