import { supabase } from './supabase';

const getCorrectAnswer = async questionId => {
  const { data, error } = await supabase
    .from('answers')
    .select('question_id, answer, is_right')
    .eq('question_id', questionId);

  if (error) {
    throw new Error(error.message);
  }

  return data
    .filter(item => item.is_right === 'true' || item.is_right === item.answer)
    .map(item => item.answer.trim().toLowerCase());
};

export const updateCompletions = async test => {
  const { data, error } = await supabase
    .from('tests')
    .update({ completed: test[0].completed + 1 })
    .eq('id', test[0].id);

  if (error) {
    console.error('Error updating completions:', error);
  }

  return;
};

export const checkAnswers = async answers => {
  let correctAnswersCount = 0;
  let totalCorrectAnswers = 0;

  for (let a of answers) {
    const correctAnswers = await getCorrectAnswer(a.questionId);

    if (correctAnswers.length > 0) {
      const userAnswers = a.answers
        ? a.answers.map(ans => ans.trim().toLowerCase())
        : [a.answer.trim().toLowerCase()];

      totalCorrectAnswers += correctAnswers.length;

      const selectedCorrectAnswers = userAnswers.filter(answer =>
        correctAnswers.includes(answer)
      );

      if (
        selectedCorrectAnswers.length === correctAnswers.length &&
        selectedCorrectAnswers.length === userAnswers.length
      ) {
        correctAnswersCount += correctAnswers.length;
      }
    }
  }
  const grade = (correctAnswersCount / totalCorrectAnswers) * 100;

  return { grade, correctAnswersCount, totalCorrectAnswers };
};
