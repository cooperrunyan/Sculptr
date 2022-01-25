import { IncompleteConfig } from '../../types/index.ts';

export function getQuestions(options: IncompleteConfig) {
  const questions = [];

  if (!options.script) questions.push(scriptQuestion);
  if (!options.style) questions.push(styleQuestion);

  return questions;
}

const scriptQuestion = {
  message: 'Do you want to build it in Javascript or Typescript?',
  choices: ['Typescript', 'Javascript'],
};

const styleQuestion = {
  message: 'Do you want use SCSS, Sass, or CSS?',
  choices: ['SCSS', 'Sass', 'CSS'],
};
