import type BuildArgs from './types/BuildArgs.ts';
import type Configuration from './types/Configuration.ts';

export default function createOptions(args: BuildArgs): Configuration {
  return {
    script: args.booleanOptions.typescript === true ? 'typescript' : args.booleanOptions.javascript === true ? 'javascript' : 'ASK',
    platform: args.platform,
    strict: args.booleanOptions.strict,
    style: args.booleanOptions.scss ? 'scss' : args.booleanOptions.css ? 'css' : args.booleanOptions.sass ? 'sass' : 'ASK',
  };
}
