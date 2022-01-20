import { getLicense } from './getLicense.ts';

export default function licenseHelp(license?: string) {
  if (license === undefined) {
    // Show all license descriptions
  } else {
    license = getLicense(license);
    // Gets the exact license that the user queries for
  }
}
