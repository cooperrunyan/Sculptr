import type Configuration from './Configuration.ts';

type BuildArgs = { platform: Configuration['platform']; booleanOptions: { [key: string]: boolean } };
export default BuildArgs;
