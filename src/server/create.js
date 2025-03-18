import { supabase } from './supabase';
import Notiflix from 'notiflix';

const uploadImage = async file => {
  const fileName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(fileName, file);

  if (error)
    throw new Error('Помилка завантаження зображення: ' + error.message);

  const { data: publicUrl } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);
  return publicUrl.publicURL;
};

export const createTest = async () => {
  let testId = null;

  try {
    const testTitle = document.getElementById('test-title').value.trim();
    const testDescription = document
      .getElementById('test-description')
      .value.trim();

    if (!testTitle || !testDescription) {
      throw new Error('Назва і опис тексту не можуть бути пустими!');
    }

    const questions = await Promise.all(
      Array.from(document.querySelectorAll('.question')).map(async question => {
        const questionId = question.id;
        const title = question
          .querySelector('input[name="question"]')
          .value.trim();
        const type = question.querySelector('select').value;

        if (!title) throw new Error('Питання не може бути пустим!');

        let imageFile = question.querySelector('input[type="file"]').files[0];
        let imageUrl = imageFile
          ? await uploadImage(imageFile, questionId)
          : null;

        let answers = Array.from(question.querySelectorAll('.answer')).map(
          answer => {
            const inputField = answer.querySelector('input[name="answer"]');
            const isChecked = answer.querySelector('.correct-answer')?.checked;
            const answerText = inputField.value.trim();

            if (!answerText) throw new Error('Відповідь не може бути пустою!');

            return {
              text: answerText,
              correct_answer:
                type === 'text' ? answerText : isChecked ? 'true' : 'false',
            };
          }
        );

        if (type === 'text' && answers.length === 0) {
          const inputField = question.querySelector(
            'input[name="text-answer"]'
          );
          if (!inputField)
            throw new Error('Відсутнє поле для вводу відповіді!');
          const textAnswer = inputField.value.trim();
          if (!textAnswer)
            throw new Error(
              'Відповідь на текстове питання не може бути пустою!'
            );
          answers = [{ text: textAnswer, correct_answer: textAnswer }];
        }

        return { id: questionId, title, type, imageUrl, answers };
      })
    );

    const { data: newTest, error: tError } = await supabase
      .from('tests')
      .insert([
        {
          title: testTitle,
          description: testDescription,
          count_questions: questions.length,
          completed: 0,
        },
      ])
      .select();

    if (tError) throw new Error(tError.message);
    testId = newTest[0].id;

    const questionsToInsert = questions.map(q => ({
      test_id: testId,
      question: q.title,
      type: q.type,
      image_url: q.imageUrl,
    }));

    const { data: relatedQuestions, error: qError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
      .select();

    if (qError) throw new Error(qError.message);

    const answersToInsert = relatedQuestions.flatMap((q, index) =>
      questions[index].answers.map(answer => ({
        question_id: q.id,
        answer: answer.text,
        is_right: answer.correct_answer,
      }))
    );

    const { error: ansError } = await supabase
      .from('answers')
      .insert(answersToInsert);
    if (ansError) throw new Error(ansError.message);

    Notiflix.Notify.success('Успішно додано новий тест!');
    return true
  } catch (error) {
    Notiflix.Notify.failure(error.message);
    console.error(error);

    if (testId) {
      await supabase.from('tests').delete().eq('id', testId);
    }
    return false
  }
};
