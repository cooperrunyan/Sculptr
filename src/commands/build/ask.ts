import question from 'https://raw.githubusercontent.com/ocpu/question-deno/master/mod.ts';
import { scripts, styles } from './types/Configuration.ts';

export default async function ask(
  questions: {
    message: string;
    choices: string[];
  }[],
) {
  let answer: undefined | string = '';
  let script = '';
  let style = '';

  for (const q of questions) {
    answer = await question('list', q.message, q.choices);
    for (let i = 0; i < 10; i++) {
      if (answer?.toLowerCase() === scripts[i]?.toLowerCase()) script = answer.slice().toLowerCase();
      if (answer?.toLowerCase() === styles[i]?.toLowerCase()) style = answer.slice().toLowerCase();
    }
  }

  return {
    script,
    style,
  };
}
