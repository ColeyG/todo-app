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
        let due = '';
        if (listItem.dueDate !== 'undefined') {
          due = listItem.dueDate.split(' ');
          due = due.slice(0, 4);
          due = due.join(' ');
        } else {
          due = '';
        }
        const rowItems = [listItem.name, due];
        const row = tableRow(`${tableItems(rowItems)}<td></td>`);
        todoList.innerHTML += row;
      });
    });
}

fetchData();
