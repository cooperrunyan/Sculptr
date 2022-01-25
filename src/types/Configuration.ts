import { licenses, platforms, scripts, styles } from '../support/index.ts';
import { License } from './index.ts';

export type Configuration = {
  platform: Platform;
  script: Script;
  style: Style;
  license?: License;
  strict: boolean;
};

export type IncompleteConfig = {
  style?: Style;
  script?: Script;
  platform: Platform;
  license?: License;
  strict?: boolean;
  installDependencies: boolean;
};

export type Platform = typeof platforms[number];
export type Script = typeof scripts[number];
export type Style = typeof styles[number];
export type LicenseInfo = typeof licenses[number];
