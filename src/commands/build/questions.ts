import type Configuration from './types/Configuration.ts';

export default function getQuestions(options: Configuration) {
  const newOpts: Configuration = options;

  const scriptQuestion = {
    message: 'Do you want to build it in Javascript or Typescript?',
    choices: ['Typescript', 'Javascript'],
  };

  const styleQuestion = {
    message: 'Do you want use SCSS, Sass, or CSS?',
    choices: ['SCSS', 'Sass', 'CSS'],
  };

  const questions = [];

  if (newOpts.script === 'ASK') questions.push(scriptQuestion);
  if (newOpts.style === 'ASK') questions.push(styleQuestion);

  return questions;
}
