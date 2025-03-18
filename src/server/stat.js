import { supabase } from './supabase';

export const startTestAttempt = async testId => {
  const { data, error } = await supabase
    .from('test_attempts')
    .insert([{ test_id: testId, created_at: new Date() }])
    .select();

  if (error) {
    console.error('Error starting test attempt:', error);
    return null;
  }

  return data[0];
};

export const completeTestAttempt = async (attemptId, startTime) => {
  const duration = Math.round((Date.now() - startTime) / 1000);

  const { error } = await supabase
    .from('test_attempts')
    .update({ completed_at: new Date(), duration })
    .eq('id', attemptId);

  if (error) {
    console.error('Error completing test attempt:', error);
  }
};

export const saveUserAnswer = async (
  attemptId,
  questionId,
  answerId = null
) => {
  const { error } = await supabase.from('question_answers').insert([
    {
      attempt_id: attemptId,
      question_id: questionId,
      answer_id: answerId,
    },
  ]);

  if (error) {
    console.error('Ошибка сохранения ответа:', error);
  }
};
