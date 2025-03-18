document.addEventListener('DOMContentLoaded', function () {
  setTimeout(() => {
    const questionCards = document.querySelectorAll('.question-card');

    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('test_id');

    if (!testId) {
      console.error('test_id не найден в URL!');
      return;
    }

    const localStorageKey = `quizAnswers_${testId}`;

    function saveAnswers() {
      let answers = {};

      questionCards.forEach((card, index) => {
        const answersContainer = card.querySelector('.answers');
        if (!answersContainer) return;

        const textInput = answersContainer.querySelector("input[type='text']");
        const radioInputs = answersContainer.querySelectorAll(
          "input[type='radio']"
        );
        const checkboxInputs = answersContainer.querySelectorAll(
          "input[type='checkbox']"
        );

        if (textInput) {
          answers[`question-${index}`] = textInput.value.trim();
        }

        radioInputs.forEach(radio => {
          if (radio.checked) {
            answers[`question-${index}`] = radio.value;
          }
        });

        const checkedCheckboxes = [...checkboxInputs]
          .filter(cb => cb.checked)
          .map(cb => cb.value);
        if (checkedCheckboxes.length > 0) {
          answers[`question-${index}`] = checkedCheckboxes;
        }
      });

      localStorage.setItem(localStorageKey, JSON.stringify(answers));
    }

    function loadAnswers() {
      const savedAnswers =
        JSON.parse(localStorage.getItem(localStorageKey)) || {};

      questionCards.forEach((card, index) => {
        const answersContainer = card.querySelector('.answers');
        if (!answersContainer) return;

        const textInput = answersContainer.querySelector("input[type='text']");
        const radioInputs = answersContainer.querySelectorAll(
          "input[type='radio']"
        );
        const checkboxInputs = answersContainer.querySelectorAll(
          "input[type='checkbox']"
        );

        let hasAnswer = false; // Флаг, есть ли ответы

        if (textInput && savedAnswers[`question-${index}`]) {
          textInput.value = savedAnswers[`question-${index}`];
          hasAnswer = true;
        }

        radioInputs.forEach(radio => {
          if (savedAnswers[`question-${index}`] === radio.value) {
            radio.checked = true;
            hasAnswer = true;
          }
        });

        if (Array.isArray(savedAnswers[`question-${index}`])) {
          checkboxInputs.forEach(checkbox => {
            if (savedAnswers[`question-${index}`].includes(checkbox.value)) {
              checkbox.checked = true;
              hasAnswer = true;
            }
          });
        }
      });

      if (typeof checkIfAllAnswered === 'function') {
        checkIfAllAnswered();
      } else {
        console.error('Функция checkForAllAnswers не найдена');
      }
    }

    questionCards.forEach(card => {
      const answersContainer = card.querySelector('.answers');
      if (!answersContainer) return;

      const textInput = answersContainer.querySelector("input[type='text']");
      const radioInputs = answersContainer.querySelectorAll(
        "input[type='radio']"
      );
      const checkboxInputs = answersContainer.querySelectorAll(
        "input[type='checkbox']"
      );

      if (textInput) {
        textInput.addEventListener('input', saveAnswers);
      }

      radioInputs.forEach(radio => {
        radio.addEventListener('change', saveAnswers);
      });

      checkboxInputs.forEach(checkbox => {
        checkbox.addEventListener('change', saveAnswers);
      });
    });

    loadAnswers();
  }, 1000);
});
