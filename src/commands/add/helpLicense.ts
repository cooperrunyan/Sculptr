import getFileJson from './getFileJson.ts';
import { getLicense } from './getLicense.ts';

export default async function licenseHelp(license?: string) {
  if (license === undefined) {
    // Show all license descriptions
  } else {
    license = getLicense(license);
    // Gets the exact license that the user queries for
    const file = await getFileJson('descriptions.json', license);
    console.log(file);
  }
}
