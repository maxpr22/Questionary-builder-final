import { supabase } from '../src/server/supabase';

export const loadQuestionsToTest = async id => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('test_id', id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
