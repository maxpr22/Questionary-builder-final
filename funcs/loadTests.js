import { supabase } from '../src/server/supabase';

export const loadTests = async (page = 1, pageSize = 9) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const { data: tests, error } = await supabase
    .from('tests')
    .select('*')
    .range(start, end);

  if (error) throw new Error(error.message);

  return tests;
};

export const loadTest = async id => {
  const { data: test, error } = await supabase
    .from('tests')
    .select('*')
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return test;
};
