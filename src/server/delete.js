import { supabase } from './supabase';
import Notiflix from 'notiflix';
export const deleteTest = async testId => {
  try {
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

    Notiflix.Notify.success('Тест був успішно видалений');
    location.reload();
  } catch (error) {
    Notiflix.Notify.failure(
      `Вибачте, сталася непередбачувана помилка ${error}`
    );
  }
};
