import { licenses } from './../build/types/Configuration.ts';

export function getLicense(license: string) {
  for (const licensetype of licenses) {
    if (licensetype.accessor.test(license)) return licensetype.name;
  }
  throw new Error('We do not support that license type (check your spelling)');
}
