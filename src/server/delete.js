import { supabase } from './supabase';
import Notiflix from 'notiflix';
export const deleteTest = async testId => {
  try {
    const { data: attempts, error: attemptsError } = await supabase
      .from('test_attempts')
      .select('id')
      .eq('test_id', testId);

    if (attemptsError) throw attemptsError;

    const attemptIds = attempts.map(a => a.id);

    if (attemptIds.length > 0) {
      await supabase.from('question_answers').delete().in('attempt_id', attemptIds);
      await supabase.from('test_attempts').delete().eq('test_id', testId);
    }

    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id')
      .eq('test_id', testId);

    if (questionsError) throw questionsError;

    const questionIds = questions.map(q => q.id);

    if (questionIds.length > 0) {
      await supabase.from('answers').delete().in('question_id', questionIds);
      await supabase.from('questions').delete().eq('test_id', testId);
    }
    await supabase.from('tests').delete().eq('id', testId);
    Notiflix.Notify.success('Тест был успешно удалён');
    window.location.reload()
  } catch (error) {
    Notiflix.Notify.failure(`Ошибка при удалении теста: ${error.message}`);
  }
};