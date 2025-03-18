import { supabase } from '../src/server/supabase';

export const loadAnswersToQuestions = async id => {
  const { data, error } = await supabase
    .from('answers')
    .select('question_id,answer, id')
    .eq('question_id', id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
