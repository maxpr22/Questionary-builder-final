import { supabase } from '../src/server/supabase';
import formatTime from './timeSpend';

export async function getAnswerDistribution(testId) {
  if (!testId) {
    console.error("Помилка: testId обов'язковий!");
    return null;
  }

  const { data, error } = await supabase
    .from('question_answers')
    .select('question_id, answer_id, questions!inner(test_id)')
    .eq('questions.test_id', testId);

  if (error) {
    console.error('Помилка отримання данних:', error);
    return null;
  }

  const counts = {};
  data.forEach(({ question_id, answer_id }) => {
    const key = `${question_id}-${answer_id}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  return Object.entries(counts).map(([key, count]) => {
    const [questionId, answerId] = key.split('-');
    return { testId, questionId, answerId, count };
  });
}

export async function getAverageCompletionTime(testId) {
  if (!testId) {
    console.error("Помилка: testId обов'язковий!");
    return null;
  }

  const { data, error } = await supabase
    .from('test_attempts')
    .select('started_at, completed_at')
    .eq('test_id', testId)
    .not('completed_at', 'is', null);

  if (error) {
    console.error('Помилка при отриманні данних:', error);
    return null;
  }

  const times = data.map(
    attempt =>
      (new Date(attempt.completed_at) - new Date(attempt.started_at)) / 1000
  );

  const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length;
  return formatTime(avgTime.toFixed(1));
}

export const getAnswerById = async id => {
  const { data, error } = await supabase
    .from('answers')
    .select('answer')
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return data[0].answer;
};
