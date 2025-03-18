import { createTest } from './server/create';

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('add-question-btn')
    .addEventListener('click', addQuestion);
});

let questionCount = 0;

function removeImage(questionId) {
  document.getElementById(`${questionId}-image-preview`).innerHTML = '';
  document.getElementById(
    `question-1-image-preview`
  ).previousElementSibling.value = null;
}

function addAnswer(questionId) {
  const answersDiv = document.getElementById(`${questionId}-answers`);
  const questionType = document.querySelector(`#${questionId} select`).value;

  if (questionType === 'text') {
    if (answersDiv.children.length === 0) {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = 'text-answer';
      input.placeholder = 'Правильна відповідь';
      answersDiv.appendChild(input);
    }
    return;
  }

  const answerDiv = document.createElement('div');
  answerDiv.classList.add('answer');

  let inputType = questionType === 'single' ? 'radio' : 'checkbox';
  answerDiv.innerHTML = `
            <label>
                <input type="text" name="answer" class="answer-input" placeholder="Варіант">
                <input type="${inputType}" class="correct-answer" name="correct-${questionId}"> <span>Правильна відповідь</span>
            </label>
            <button class = "remove-question" onclick="this.parentElement.remove()">Видалити</button>
        `;

  answersDiv.appendChild(answerDiv);
}

function updateAnswerType(questionId, selectElement) {
  const answersDiv = document.getElementById(`${questionId}-answers`);
  answersDiv.innerHTML = '';
}

function removeElement(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
    questionCount--;
    updateQuestionNumbers();
  }
}

function previewImage(event, questionId) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewContainer = document.getElementById(
        `${questionId}-image-preview`
      );
      previewContainer.innerHTML = `
            <div class="image-wrapper">
              <img src="${e.target.result}" alt="Зображення">
              <button class="delete-image" onclick="removeImage('${questionId}')">×</button>
            </div>
          `;
    };
    reader.readAsDataURL(file);
  }
}

function addQuestion() {
  questionCount++;
  let questionId = `question-${questionCount}`;

  const questionDiv = document.createElement('div');
  questionDiv.classList.add('question');
  questionDiv.setAttribute('id', questionId);
  questionDiv.setAttribute('draggable', true);

  questionDiv.innerHTML = `
          <div class="question-header">
              <span class="drag-handle">☰</span>
              <label><span class="question-title">Питання ${questionCount}:</span> 
                  <input type="text" id="question-title" name="question" placeholder="Введіть питання">
              </label>
              <label>Тип: 
                  <select id="question-type" onchange="updateAnswerType('${questionId}', this)">
                      <option value="text">Текст</option>
                      <option value="single">Один варіант</option>
                      <option value="multiple">Кілька варіантів</option>
                  </select>
              </label>
              <button onclick="removeElement('${questionId}')">Видалити</button>
          </div>
  
          <div class="image-upload">
              <input type="file" accept="image/*" onchange="previewImage(event, '${questionId}')">
              <div class="image-preview" id="${questionId}-image-preview"></div>
          </div>
  
          <div class="answers" id="${questionId}-answers"></div>
          <button class="add-answer" onclick="addAnswer('${questionId}')">Додати відповідь</button> 
      `;

  document.getElementById('questions-container').appendChild(questionDiv);

  questionDiv.addEventListener('dragstart', dragStart);
  questionDiv.addEventListener('dragover', dragOver);
  questionDiv.addEventListener('drop', drop);
  questionDiv.addEventListener('dragleave', dragLeave);
  questionDiv.addEventListener('dragend', dragEnd);
}

function updateQuestionNumbers() {
  document
    .querySelectorAll('.question .question-title')
    .forEach((question, index) => {
      question.innerText = `Питання ${index + 1}:`;
      question.parentElement.parentNode.parentElement.setAttribute(
        'id',
        `question-${index + 1}`
      );
    });
}

let draggedItem = null;

function dragStart(event) {
  draggedItem = event.target;
  originalPosition = draggedItem.nextSibling;
  event.target.classList.add('dragging');
}

function dragOver(event) {
  event.preventDefault();
  const target = event.target.closest('.question');
  const container = document.getElementById('questions-container');

  if (target && target !== draggedItem && container.contains(target)) {
    const children = Array.from(container.children);
    const draggedIndex = children.indexOf(draggedItem);
    const targetIndex = children.indexOf(target);

    if (draggedIndex > targetIndex) {
      container.insertBefore(draggedItem, target);
    } else {
      container.insertBefore(draggedItem, target.nextSibling);
    }
  }
}

function drop(event) {
  event.preventDefault();
  draggedItem.classList.remove('dragging');
}

function dragLeave(event) {
  event.target.closest('.question')?.classList.remove('drag-over');
}

function dragEnd() {
  const container = document.getElementById('questions-container');
  if (!container.contains(draggedItem)) {
    originalPosition
      ? originalPosition.parentNode.insertBefore(draggedItem, originalPosition)
      : container.appendChild(draggedItem);
  }
  draggedItem.classList.remove('dragging');
  draggedItem = null;
  updateQuestionNumbers();
}

document.getElementById('add-test-btn').addEventListener('click', async e => {
  e.target.setAttribute('disabled', true);
  await createTest();
  setTimeout(() => {
    window.location.replace("/")
  }, 1000);
});

window.removeImage = removeImage;
window.addAnswer = addAnswer;
window.updateAnswerType = updateAnswerType;
window.removeElement = removeElement;
window.previewImage = previewImage;

addQuestion();
