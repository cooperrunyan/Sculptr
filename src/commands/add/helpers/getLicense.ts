import { licenses } from '../../../support/index.ts';

export function getLicense(str: string) {
  for (const license of licenses) {
    if (license.accessor.test(str)) return license.name;
  }
  throw new Error('We do not support that license type (check your spelling)');
}
