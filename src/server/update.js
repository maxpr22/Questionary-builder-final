import { supabase } from './supabase';
import Notiflix from 'notiflix';

export async function removeElement(questionId) {
  const element = document.getElementById(questionId);
  if (!element) {
    console.warn(`Елемент ${questionId} не знайдено`);
    return;
  }

  const id = parseInt(element.dataset.id, 10);

  try {
    const { data: answers, error: answersError } = await supabase
      .from('answers')
      .select('id')
      .eq('question_id', id);

    if (answersError) throw answersError;

    const answerIds = answers.map(a => a.id);

    if (answerIds.length > 0) {
      await supabase.from('question_answers').delete().in('answer_id', answerIds);
      await supabase.from('answers').delete().in('id', answerIds);
    }

    await supabase.from('questions').delete().eq('id', id);

    element.remove();
    console.log(`Питання ${questionId} успішно видалено`);
  } catch (error) {
    console.error('Помилка видалення:', error);
  }
  updateQuestionNumbers();
}

export async function updateTest(testId) {
  const testTitle = document.getElementById('test-title').value;
  const testDescription = document.getElementById('test-description').value;
  const questionElements = document.querySelectorAll('.question');

  const { error: testError } = await supabase
    .from('tests')
    .update({ title: testTitle, description: testDescription, count_questions: questionElements.length })
    .eq('id', testId);

  if (testError) {
    console.error('Помилка оновлення тесту:', testError);
    Notiflix.Notify.failure('Не вдалося оновити тест!');
    return;
  }

  const { data: existingQuestions, error: fetchQuestionsError } = await supabase
    .from('questions')
    .select('id')
    .eq('test_id', testId);

  if (fetchQuestionsError) {
    console.error('Помилка отримання питань:', fetchQuestionsError);
    return;
  }

  const currentQuestionIds = Array.from(questionElements)
    .map(q => q.dataset.id ? parseInt(q.dataset.id, 10) : null)
    .filter(id => id !== null);

  const questionsToDelete = existingQuestions
    .map(q => q.id)
    .filter(id => !currentQuestionIds.includes(id));

  if (questionsToDelete.length > 0) {
    await supabase.from('question_answers').delete().in('question_id', questionsToDelete);
    await supabase.from('answers').delete().in('question_id', questionsToDelete);
    await supabase.from('questions').delete().in('id', questionsToDelete);
  }

  for (const [index, questionEl] of questionElements.entries()) {
    let questionId = questionEl.dataset.id ? parseInt(questionEl.dataset.id, 10) : null;
    const questionText = questionEl.querySelector('#question-title').value;
    const questionType = questionEl.querySelector('#question-type').value;
    const imageUrl = questionEl.querySelector('.image-preview img')?.src || null;

    console.log(`Оновлення питання ID ${questionId} з порядком ${index}`);

    if (questionId) {
      await supabase.from('questions').update({ question: questionText, type: questionType, image_url: imageUrl, order: index }).eq('id', questionId);
    } else {
      const { data: newQuestion, error: newQuestionError } = await supabase
        .from('questions')
        .insert([{ question: questionText, type: questionType, test_id: testId, image_url: imageUrl, order: index }])
        .select()
        .single();

      if (newQuestionError) {
        console.error('Помилка створення питання:', newQuestionError);
        continue;
      }
      questionId = newQuestion.id;
      questionEl.dataset.id = questionId;
    }

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
        await supabase.from('answers').update({ answer: answerText, is_right: isRight }).eq('id', existingAnswer.id);
      }
    }
  }

  const { data: updatedQuestions, error: checkOrderError } = await supabase
    .from('questions')
    .select('id, question, order')
    .eq('test_id', testId)
    .order('order', { ascending: true });

  if (checkOrderError) {
    console.error('Помилка перевірки порядку:', checkOrderError);
  } else {
    console.log('Перевірка порядку питань після збереження:', updatedQuestions);
  }

  Notiflix.Notify.success('Тест успішно оновлено!');
}