export function removeImage(questionId) {
  const container = document.getElementById(questionId);

  const fileInput = container.querySelector('input[type="file"]');

  if (fileInput) {
    fileInput.value = null;
  }

  const imagePreview = container.querySelector('.image-preview');
  if (imagePreview) {
    imagePreview.innerHTML = '';
  }
}

export function addAnswer(questionId) {
  const answersDiv = document.getElementById(`${questionId}-answers`);
  const questionElement = document.getElementById(questionId);

  if (!questionElement) {
    return;
  }

  const questionType = questionElement.querySelector('select').value;

  if (questionType === 'text') {
    if (answersDiv.children.length === 0) {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = `text-answer`;
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
          <input type="${inputType}" class="correct-answer" name="correct-${questionId}">
          <span>Правильна відповідь</span>
      </label>
      <button class="remove-question" onclick="this.parentElement.remove()">Видалити</button>
  `;

  answersDiv.appendChild(answerDiv);
}

export function updateAnswerType(questionId, selectElement) {
  const answersDiv = document.getElementById(`${questionId}-answers`);
  answersDiv.innerHTML = '';
}

export function removeElement(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
    questionCount--;
    updateQuestionNumbers();
  }
}

export function previewImage(event, questionId) {
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

export function updateQuestionNumbers() {
  document.querySelectorAll('.question').forEach((question, index) => {
    const newId = `question-${index + 1}`;
    question.setAttribute('id', newId);

    question.querySelector('.question-title').innerText = `Питання ${
      index + 1
    }:`;

    const select = question.querySelector('select');
    select.setAttribute('onchange', `updateAnswerType('${newId}', this)`);

    const answerDiv = question.querySelector('.answers');
    answerDiv.setAttribute('id', `${newId}-answers`);

    const addAnswerBtn = question.querySelector('.add-answer');
    addAnswerBtn.setAttribute('onclick', `addAnswer('${newId}')`);

    const deleteBtn = question.querySelector(
      'button[onclick^="removeElement"]'
    );
    deleteBtn.setAttribute('onclick', `removeElement('${newId}')`);

    question.querySelectorAll('.correct-answer').forEach(input => {
      input.name = `correct-${newId}`;
    });
  });
}

export let draggedItem = null;

export function dragStart(event) {
  draggedItem = event.target;
  originalPosition = draggedItem.nextSibling;
  event.target.classList.add('dragging');
}

export function dragOver(event) {
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

export function drop(event) {
  event.preventDefault();
  draggedItem.classList.remove('dragging');
}

export function dragLeave(event) {
  event.target.closest('.question')?.classList.remove('drag-over');
}

export function dragEnd() {
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
