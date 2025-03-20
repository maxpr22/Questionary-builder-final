import { supabase } from '../src/server/supabase';

export const getTestById = async id => {
  try {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  } catch (error) {
    return error;
  }
};
