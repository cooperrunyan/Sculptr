import build from './commands/build/build.ts';
import generate from './commands/asset-generator/main.ts';
import add from './commands/add/index.ts';

export default {
  build,
  generatePwaAssets: generate,
  add,
};
