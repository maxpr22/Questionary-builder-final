import { supabase } from './supabase';
import Notiflix from 'notiflix';

export async function updateTest(testId) {
  const testTitle = document.getElementById('test-title').value;
  const testDescription = document.getElementById('test-description').value;
  
  const { error: testError } = await supabase
    .from('tests')
    .update({ title: testTitle, description: testDescription })
    .eq('id', testId);

  if (testError) {
    console.error('Помилка оновлення тесту:', testError);
    alert('Не вдалося оновити тест!');
    return;
  }

  const questionElements = document.querySelectorAll('.question');
  let order = 1; 

  for (const questionEl of questionElements) {
    const questionId = questionEl.dataset.id;
    const questionText = questionEl.querySelector('#question-title').value;
    const questionType = questionEl.querySelector('#question-type').value;
    const imageUrl = questionEl.querySelector('.image-preview img')?.src || null;

    if (questionId) {
      const { error: questionError } = await supabase
        .from('questions')
        .update({ question: questionText, type: questionType, image_url: imageUrl, order })
        .eq('id', questionId);

      if (questionError) {
        console.error('Помилка оновлення питання:', questionError);
        continue;
      }
    } else {
      const { data: newQuestion, error: newQuestionError } = await supabase
        .from('questions')
        .insert([{ question: questionText, type: questionType, test_id: testId, image_url: imageUrl, order }])
        .select()
        .single();

      if (newQuestionError) {
        console.error('Помилка додавання питання:', newQuestionError);
        continue;
      }
    }

    order++; 

    const answerElements = questionEl.querySelectorAll('.answer');
    for (const answerEl of answerElements) {
      const answerText = answerEl.querySelector('.answer-input').value;
      const isRight = answerEl.querySelector('.correct-answer').checked ? 'true' : 'false';

      const { data: existingAnswer, error: answerFetchError } = await supabase
        .from('answers')
        .select('*')
        .eq('question_id', questionId)
        .eq('answer', answerText)
        .single();

      if (answerFetchError || !existingAnswer) {
        await supabase.from('answers').insert([{ question_id: questionId, answer: answerText, is_right: isRight }]);
      } else {
        await supabase
          .from('answers')
          .update({ answer: answerText, is_right: isRight })
          .eq('id', existingAnswer.id);
      }
    }
  }

  const questionCount = questionElements.length;

  const { error: countError } = await supabase
    .from('tests')
    .update({ count_questions: questionCount })
    .eq('id', testId);

  if (countError) {
    console.error('Помилка оновлення count_questions:', countError);
  }

  Notiflix.Notify.success('Тест успішно оновлено')
}
