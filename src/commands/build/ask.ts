import { question } from '../../deps.ts';
import { scripts, styles } from '../../support/index.ts';

export async function ask(
  questions: {
    message: string;
    choices: string[];
  }[],
): Promise<{
  script: string | undefined;
  style: string | undefined;
}> {
  let answer: undefined | string = '';
  let script = '';
  let style = '';

  for (const q of questions) {
    answer = await question.default('list', q.message, q.choices);
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
