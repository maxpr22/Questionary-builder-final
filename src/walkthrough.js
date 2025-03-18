import { loadAnswersToQuestions } from '../funcs/loadAnswersToQuestions';
import { loadQuestionsToTest } from '../funcs/loadQuestionsToTest';
import { loadTest } from '../funcs/loadTests';
import { checkAnswers, updateCompletions } from './server/completed';
import { saveUserAnswer } from './server/stat';
import { startTestAttempt, completeTestAttempt } from './server/stat';
import { getAnswerById, getAnswerDistribution } from '../funcs/getStats';
import { getAverageCompletionTime } from '../funcs/getStats';

let attemptId = null;
let startTime = null;

async function initTest() {
  let ques = 0;
  const params = new URLSearchParams(document.location.search);
  const id = params.get('test_id');

  if (!id) return window.location.replace('/');

  const test = await loadTest(id);

  startTime = Date.now();
  const attempt = await startTestAttempt(test[0].id);
  if (attempt) {
    attemptId = attempt.id;
  }

  if (test.length === 0) {
    document.title = 'Нічого не знайдено';
    document.querySelector('.container').innerHTML = `
      <div>
        <a class="rollback" href="/">Повернутися назад</a>
        <h1>На жаль такого тесту ще не існує 🐷</h1>
      </div>
    `;
    return;
  }

  document.title = test[0].title;

  const questions = await loadQuestionsToTest(id);

  const answers = await Promise.all(
    questions.map(async question => await loadAnswersToQuestions(question.id))
  );

  const answersState = {};
  const checkIfAllAnswered = () => {
    const allAnswered = questions.every(q => {
      const answerElement = document.querySelector(`[name="answer-${q.id}"]`);
      if (q.type === 'text') {
        return answerElement && answerElement.value.trim() !== '';
      }
      if (q.type === 'single') {
        return document.querySelector(`[name="answer-${q.id}"]:checked`);
      }
      if (q.type === 'multiple') {
        return (
          document.querySelectorAll(`[name="answer-${q.id}[]"]:checked`)
            .length > 0
        );
      }
      return false;
    });
    finish.disabled = !allAnswered;
  };
  if (test && questions && answers) {
    document.querySelector('.container').innerHTML = `
      <a class="rollback" href="/">На головну</a>
      <h1>${test[0].title}</h1>
      <p class="test-description">${test[0].description}</p>
      <div id="wrapper">
        <button id="prev" disabled><</button>
        <button id="next">></button>
      </div>
      <button id="finish" disabled>Завершити тест</button>
    `;

    const wrapper = document.getElementById('wrapper');

    const questionsToInsert = await Promise.all(
      questions.map(async q => {
        return `<div class="question-card">
          <h3>${q.question}</h3>
          ${
            q.image_url
              ? `
              <a data-fslightbox href="${q.image_url}">
                <img draggable="false" data-lightbox="image-1" class="q-image" src="${q.image_url}" alt="${q.question}">
              </a>
              `
              : ''
          }
        </div>`;
      })
    );

    wrapper.insertAdjacentHTML('beforeend', questionsToInsert.join(''));
    refreshFsLightbox();
    const cards = document.querySelectorAll('.question-card');

    const answersToInsert = questions.map(q => {
      const questionAnswers = answers
        .flat()
        .filter(answer => answer.question_id === q.id);
      let answersHTML = '';

      switch (q.type) {
        case 'text':
          answersHTML = `<input type="text" name="answer-${q.id}" class="text-answer" placeholder="Ваша відповідь:">`;
          break;

        case 'single':
          answersHTML = questionAnswers
            .map(
              answer => `
            <label>
              <input type="radio" name="answer-${q.id}" value="${answer.id}">
              ${answer.answer}
            </label>
          `
            )
            .join('');
          break;

        case 'multiple':
          answersHTML = questionAnswers
            .map(
              answer => `
            <label>
              <input type="checkbox" name="answer-${q.id}[]" value="${answer.id}">
              ${answer.answer}
            </label>
          `
            )
            .join('');
          break;

        default:
          answersHTML = '<p>Невідомий тип</p>';
          break;
      }

      return `<div class="answers">${answersHTML}</div>`;
    });

    answersToInsert.forEach((html, index) => {
      cards[index].insertAdjacentHTML('beforeend', html);
    });

    const next = document.getElementById('next');
    const prev = document.getElementById('prev');
    const finish = document.getElementById('finish');

    const updateButtons = () => {
      if (ques + 1 >= questions.length) {
        next.setAttribute('disabled', true);
      } else {
        next.removeAttribute('disabled');
      }

      if (ques - 1 < 0) {
        prev.setAttribute('disabled', true);
      } else {
        prev.removeAttribute('disabled');
      }
    };

    updateButtons();

    const gatherAnswers = () => {
      return questions.map(q => {
        if (q.type === 'text') {
          const answerElement = document.querySelector(
            `[name="answer-${q.id}"]`
          );
          const possibleAnswers =
            answers.find(group => group[0]?.question_id === q.id) || [];

          return {
            questionId: q.id,
            answer: answerElement ? answerElement.value.trim() : null,
            answerId:
              possibleAnswers.length > 0 ? possibleAnswers[0]?.id : null,
          };
        }

        if (q.type === 'single') {
          const inputs = Array.from(
            document.querySelectorAll(`[name="answer-${q.id}"]`)
          );
          const selectedAnswer = inputs.find(a => a.checked);
          const answerIndex = selectedAnswer
            ? inputs.indexOf(selectedAnswer)
            : null;

          const possibleAnswers =
            answers.find(group => group[0]?.question_id === q.id) || [];

          return {
            questionId: q.id,
            answer: selectedAnswer
              ? selectedAnswer.parentElement.textContent.trim()
              : null,
            answerId:
              answerIndex !== null ? possibleAnswers[answerIndex]?.id : null,
          };
        }

        if (q.type === 'multiple') {
          const inputs = Array.from(
            document.querySelectorAll(`[name="answer-${q.id}[]"]`)
          );
          const selectedAnswers = inputs.filter(input => input.checked);

          const possibleAnswers =
            answers.find(group => group[0]?.question_id === q.id) || [];

          return {
            questionId: q.id,
            answers: selectedAnswers.map(input =>
              input.parentElement.textContent.trim()
            ),
            answerIds: selectedAnswers
              .map(input => {
                const index = inputs.indexOf(input);
                return possibleAnswers[index]?.id || null;
              })
              .filter(id => id !== null),
          };
        }

        return { questionId: q.id, answer: null, answerId: null };
      });
    };

    next.addEventListener('click', () => {
      if (ques + 1 >= questions.length) {
        return;
      }
      ques++;
      cards.forEach(c => {
        c.style.transform = `translateX(${-ques * 100}%)`;
      });
      updateButtons();
    });

    prev.addEventListener('click', () => {
      if (ques - 1 < 0) {
        return;
      }
      ques--;
      cards.forEach(c => {
        c.style.transform = `translateX(${-ques * 100}%)`;
      });
      updateButtons();
    });

    document.addEventListener('input', event => {
      if (event.target.matches('[name^="answer-"]')) {
        const questionId = event.target.name.split('-')[1];
        if (event.target.type === 'checkbox' || event.target.type === 'radio') {
          answersState[questionId] = event.target.checked
            ? event.target.value
            : null;
        } else {
          answersState[questionId] = event.target.value.trim();
        }
        checkIfAllAnswered();
      }
    });
    setTimeout(() => {
      checkIfAllAnswered();
    }, 1000);
    function generateRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r}, ${g}, ${b})`;
    }
    finish.addEventListener('click', async () => {
      if (!attemptId) {
        console.error('Цієї спроби не знайдено...');
        return;
      }

      localStorage.removeItem(`quizAnswers_${test[0].id}`);
      const answers = gatherAnswers();

      const { grade, correctAnswersCount, totalCorrectAnswers } =
        await checkAnswers(answers);

      if (attemptId) {
        for (const answer of answers) {
          if (
            Array.isArray(answer.answers) &&
            Array.isArray(answer.answerIds)
          ) {
            for (let i = 0; i < answer.answers.length; i++) {
              const ans = answer.answers[i];
              const ansId = answer.answerIds[i];

              await saveUserAnswer(
                Number(attemptId),
                Number(answer.questionId),
                ansId ? Number(ansId) : null,
                ansId ? null : ans
              );
            }
          } else if (answer.answer) {
            await saveUserAnswer(
              Number(attemptId),
              Number(answer.questionId),
              answer.answerId ? Number(answer.answerId) : null,
              answer.answerId ? null : answer.answer
            );
          }
        }
      }

      await completeTestAttempt(attemptId, startTime);
      await updateCompletions(test);
      const answerDistribution = await getAnswerDistribution(test[0].id);
      const avgTime = await getAverageCompletionTime(test[0].id);
      wrapper.innerHTML = `<div id="dashboard">
        <div>
          <h2>Ваш результат: ${Math.round(grade)}%</h2>
          <p>Ви відповіли правильно на ${correctAnswersCount}/${totalCorrectAnswers} правильних відповідей</p>
          <p>Середній час проходження цього тесту серед інших: ${avgTime}</p>
        </div>
        <div id="questions-list">
          <h3>Ваші відповіді:</h3>
          <ul>
            ${answers
              .map(answer => {
                const questionObj = questions.find(
                  q => q.id === answer.questionId
                );

                const questionText = questionObj
                  ? questionObj.question
                  : 'Питання не знайдено';
                let answerText =
                  Array.isArray(answer.answers) && answer.answers.length > 0
                    ? answer.answers.join(', ')
                    : answer.answer || 'Без відповіді';
                if (questionObj.type == 'text') {
                  return `<li>
                          <strong>Питання:</strong> ${questionText}<br>
                          <strong>Ваш відповідь:</strong> ${answerText}<br>
                        </li>`;
                }
                return `<li>
                          <strong>Питання:</strong> ${questionText}<br>
                          <strong>Ваш відповідь:</strong> ${answerText}<br>
                          <canvas class="pieChart" id="pie-${answer.questionId}" width="200" height="200"></canvas>
                        </li>`;
              })
              .join('')}
          </ul>
        </div>
      </div>`;

      finish.remove();

      setTimeout(() => {
        answers.forEach(async answer => {
          const questionId = String(answer.questionId);

          const questionDistribution = answerDistribution.filter(
            item => String(item.questionId) === questionId
          );

          if (questionDistribution.length === 0) {
            return;
          }

          const pieData = await Promise.all(
            questionDistribution.map(async item => ({
              label: await getAnswerById(item.answerId),
              value: item.count,
            }))
          );

          const pieLabels = pieData.map(item => `Відповідь: ${item.label}`);
          const pieValues = pieData.map(item => item.value);

          const pieColors = pieData.map(() => generateRandomColor());

          const canvas = document.getElementById(`pie-${questionId}`);
          if (canvas) {
            const ctx = canvas.getContext('2d');

            if (ctx) {
              new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: pieLabels,
                  datasets: [
                    {
                      label: 'Кількість',
                      data: pieValues,
                      backgroundColor: pieColors,
                      hoverOffset: 4,
                    },
                  ],
                },
              });
            } else {
              console.error('Не удалось получить контекст для канваса');
            }
          } else {
            console.error(
              'Не удалось найти канвас для questionId:',
              questionId
            );
          }
        });
      }, 100);
    });
  }
}

initTest();
