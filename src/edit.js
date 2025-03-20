import { getTestById } from '../funcs/getTestById';
import { loadAnswersToQuestions } from '../funcs/loadAnswersToQuestions';
import { loadQuestionsToTest } from '../funcs/loadQuestionsToTest';
import { updateTest } from './server/update';
window.removeImage = removeImage;
window.addAnswer = addAnswer;
window.updateAnswerType = updateAnswerType;
window.previewImage = previewImage;
window.updateQuestionNumbers = updateQuestionNumbers;
window.dragEnd = dragEnd;
window.dragLeave = dragLeave;
window.dragOver = dragOver;
window.dragStart = dragStart;
window.drop = drop;
import {
  previewImage,
  removeImage,
  updateAnswerType,
  updateQuestionNumbers,
  addAnswer,
  dragEnd,
  dragLeave,
  dragOver,
  dragStart,
  drop,
} from '../funcs/manageTests';

(async () => {
  const params = new URLSearchParams(document.location.search);
  const id = params.get('test_id');

  const test = await getTestById(id);

  if (!test) {
    document.title = 'Нічого не знайдено';
    document.querySelector('.container').innerHTML = `
      <div>
        <a class="rollback" href="/">Повернутися назад</a>
        <h1>На жаль такого тесту ще не існує 🐷</h1>
      </div>
    `;
    return;
  }

  const questions = await loadQuestionsToTest(id);

  if (!questions) {
    document.title = 'Непередбачена помилка';
    document.querySelector('.container').innerHTML = `
      <div>
        <a class="rollback" href="/">Повернутися назад</a>
        <h1>До цього тесту не було знайдено данних, спробуйте пізніше 🐷</h1>
      </div>
    `;
  }

  const answers = await Promise.all(
    questions.map(async question => await loadAnswersToQuestions(question.id))
  );

  let questionCount = questions.length;


  window.removeElement = function removeElement(id) {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
      questionCount--;
      updateQuestionNumbers();
    }
  }

  window.removeImage = function removeImage(questionId) {
    const container = document.getElementById(questionId);
    console.log(questionId)
    const fileInput = container.querySelector(`input[type="file"]`);
  
    if (fileInput) {
      fileInput.value = null;
    }
  
    const imagePreview = container.querySelector(`.image-preview`);
    if (imagePreview) {
      imagePreview.innerHTML = '';
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
  const initEdit = async () => {
    document.title = `Редагування - ${test.title}`;

    document.querySelector('.container').innerHTML = `
      <a class="rollback" href="/">На головну</a>
      <div class="quiz-container">
        <h2>Редагувати тест - ${test.title}</h2>
        <div class="test-content">
          <label
            >Назва тесту:
            <input
              required
              type="text"
              id="test-title"
              placeholder="Введіть назву тесту"
              value="${test.title}"
            />
          </label>
          <label
            >Опис тесту:
            <textarea
              id="test-description"
              placeholder="Введіть опис тесту"
            >${test.description}</textarea>
          </label>
        </div>
        <div id="questions-container"></div>
        <div id="button-wrapper">
          <button class="add-question" id="add-question-btn">
            Додати питання
          </button>
          <button class="make-test" id="add-test-btn">Оновити тест</button>
        </div>
      </div>
  `;
    questions.map((question, index) => {
      const questionDiv = document.createElement('div');
      let questionId = `question-${index + 1}`;

      questionDiv.classList.add('question');
      questionDiv.dataset.id = question.id;
      questionDiv.setAttribute('id', `${questionId}`);
      questionDiv.setAttribute('draggable', true);

      questionDiv.innerHTML = `
      <div class="question-header">
              <span class="drag-handle">☰</span>
              <label><span class="question-title">Питання ${index + 1}:</span> 
                  <input type="text" id="question-title" name="question" value="${
                    question.question
                  }" placeholder="Введіть питання">
              </label>
              <label>Тип: 
                  <select id="question-type" onchange="updateAnswerType('${questionId}', this)">
                      <option value="text" ${
                        question.type === 'text' ? 'selected' : ''
                      }>Текст</option>
                      <option value="single" ${
                        question.type === 'single' ? 'selected' : ''
                      }>Один варіант</option>
                      <option value="multiple" ${
                        question.type === 'multiple' ? 'selected' : ''
                      }>Кілька варіантів</option>
                  </select>
              </label>
              <button onclick="removeElement('${questionId}')">Видалити</button>
          </div>
  
          <div class="image-upload">
              <input type="file" accept="image/*" onchange="previewImage(event, '${questionId}')">
              <div class="image-preview" id="${questionId}-image-preview">
                ${
                  question.image_url
                    ? `<div class="image-wrapper">
              <img src="${question.image_url}">
              <button class="delete-image" onclick="removeImage('${questionId}')">×</button>
            </div>`
                    : ''
                }
              </div>
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
      answers[index].map((a, index) => {
        const answersDiv = document.getElementById(`${questionId}-answers`);
        const questionType = document.querySelector(
          `#${questionId} select`
        ).value;

        if (questionType === 'text') {
          if (answersDiv.children.length === 0) {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = 'text-answer';
            input.value = a.answer;
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
                <input type="text" value="${
                  a.answer
                }" name="answer" class="answer-input" placeholder="Варіант">
                <input type="${inputType}" class="correct-answer" name="correct" ${
          a.is_right === 'true' ? 'checked' : ''
        }> <span>Правильна відповідь</span>
            </label>
            <button class="remove-question" onclick="this.parentElement.remove()">Видалити</button>
        `;
        answersDiv.appendChild(answerDiv);
      });
    });
  };

  initEdit();
  document.getElementById('add-question-btn').addEventListener('click', () => {
    addQuestion();
    questionCount++;
    updateQuestionNumbers();
  });
  document
    .getElementById('add-test-btn')
    .addEventListener('click', async () => {
      await updateTest(test.id);
      setTimeout(() => {
        window.location.replace('/');
      }, 1000);
      
    });
})();
