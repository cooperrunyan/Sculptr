import getFileJson from './getFileJson.ts';
import { getLicense } from './getLicense.ts';

const example = {
  description:
    "Gives you a copyright and allows for a patent on the software so long as you include the original software, any of its copyrights or trademarks and a note saying that you modified it. Created by the same author as the Open Software License, this license is nearly identical but, unlike the Open Software License, not copyleft as it doesn't force derivative works to use the same license.",
  permissions: [
    { name: 'Commercial Use', description: 'License material and derivatives can be used for commercial use' },
    { name: 'Distribution', description: 'License material may be distributed' },
    { name: 'Modification', description: 'License material may be modified' },
    { name: 'Sublicense', description: 'The ability for you to grant/extend a license to the software.' },
  ],
  conditions: [
    { name: 'Disclose Source', description: 'Source code must be distributed when license material is published' },
    { name: 'License and Copyright Notice', description: 'A copy of the license and copyright notice must be included with the license material' },
    {
      name: 'Same License',
      description:
        'Modifications must be released under the same license when distributing the licensed material. In some cases a similar or related license may be used',
    },
    { name: 'State Changes', description: 'Changes made to the licensed material must be documented' },
  ],
  limitations: [
    { name: 'Liability', description: 'License includes a limitation of liability' },
    {
      name: 'Trademark use',
      description: 'Does NOT grant trademark rights.',
    },
  ],
};

export default async function licenseHelp(license?: string) {
  if (license === undefined) {
    // Show all license descriptions
  } else {
    license = getLicense(license);
    // Gets the exact license that the user queries for
    const file = await getFileJson('descriptions.json', license);
    console.log(file);
    // prettier-ignore
    const str = `
  Academic Free License 3.0 (afl-3.0)

  Description:

    Gives you a copyright and allows for a patent on the software so long as you include the original software, any of its copyrights or trademarks and a note saying that you modified it. Created by the same author as the Open Software License, this license is nearly identical but, unlike the Open Software License, not copyleft as it doesn't force derivative works to use the same license.

  Permissions:

    Commercial use  - License material and derivatives can be used for commercial use
    Distribution    - License material may be distributed
    Modification    - License material may be modified
    Sublicense      - The ability for you to grant/extend a license to the software

  Limitations:

    Liability      - License includes a limitation of liability
    Trademark use  - Does NOT grant trademark rights

  Conditions:

    Disclose source               - Source code must be distributed when license material is published
    License and Copyright Notice  - A copy of the license and copyright notice must be included with the license material
    Same License                  - Modifications must be released under the same license upon distributon
    State Change                  - Changes made to the licensed material must be documented`;
  }
}
