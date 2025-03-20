import { loadTests } from '../funcs/loadTests';
import { timeSince } from '../funcs/timeSpend';
import { sortTests } from '../funcs/sort';
import { deleteTest } from './server/delete';

const refs = {
  testList: document.querySelector('.test-list'),
  target: document.querySelector('.js-guard'),
};

let currentPage = 1;
const pageSize = 9;
let hasMore = true;

let options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '200px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

async function onLoad(entries) {
  for (const entry of entries) {
    if (entry.isIntersecting && hasMore) {
      try {
        const tests = await loadTests(currentPage, 9);

        if (tests.length < 9) {
          refs.testList.insertAdjacentHTML(
            'beforeend',
            createCatalogMarkup(tests)
          );
          sortTests(sortSelect.value);
          hasMore = false;
          createDropdownMenu();
          observer.unobserve(refs.target);
          return;
        }

        refs.testList.insertAdjacentHTML(
          'beforeend',
          createCatalogMarkup(tests)
        );
        currentPage++;
        createDropdownMenu();
        sortTests(sortSelect.value);
      } catch (error) {
        console.error('Помилка завантаження тестів:', error);
      }
    }
  }
}

function onMenuButtonClick(evt) {
  evt.stopPropagation();
  document.querySelectorAll('.menu-container').forEach(menu => {
    menu.classList.remove('active');
  });
  const menuContainer = evt.target.parentElement;
  menuContainer.classList.toggle('active');
}
function closeDropdownMenu(evt) {
  if (!evt.target.closest('.menu-container')) {
    document.querySelectorAll('.menu-container').forEach(menu => {
      menu.classList.remove('active');
    });
  }
}
document.addEventListener('click', closeDropdownMenu);

function createDropdownMenu() {
  document.querySelectorAll('.menu-button').forEach(button => {
    button.addEventListener('click', onMenuButtonClick);
  });
}

function createCatalogMarkup(tests) {
  sortTests(sortSelect.value);
  return tests
    .map(
      ({
        id,
        title,
        description,
        count_questions,
        completed,
        created_at,
      }) => ` <li class="test-card" data-created-at="${created_at}">
            <div class="card-content-wrapper">
            <div class="test-header">
                <h2 class = "test-title">${title ? title : `Тест #${id}`}</h2>
                <div class="menu-container">
                    <button class="menu-button">⋮</button>
                    <div class="dropdown-menu">
                        <button class="edit"><a class = "start-link" href="/edit.html?test_id=${id}">Редагувати</a></button>
                        <button class="delete"onClick="deleteTest(${id})">Видалити</button>
                        <button class="continue"><a class = "start-link" href="/walkthrough.html?test_id=${id}">Продовжити</a></button>
                    </div>
                </div>
            </div>
            <p class = "test-description">${description}</p>
            <p class="test-info">${count_questions} питань • Пройдено ${completed} разів</p>
            <p>${timeSince(created_at)}</p>
            </div>
            <div class="test-actions">
                <a class="start" href="/walkthrough.html?test_id=${id}">Запустити</a>
            </div>
        </li>`
    )
    .join('');
}

document.addEventListener('DOMContentLoaded', async function () {
  const tests = await loadTests(currentPage, pageSize);
  refs.testList.insertAdjacentHTML('beforeend', createCatalogMarkup(tests));
  observer.observe(refs.target);
  createDropdownMenu();
  currentPage++;
});

const sortSelect = document.getElementById('sort-type');
sortSelect.addEventListener('change', event => {
  sortTests(event.target.value);
  sortTests();
});

window.deleteTest = deleteTest;

//Я не джин 🐷, я джун. Сделать не успеваю
