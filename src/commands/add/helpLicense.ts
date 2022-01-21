import getFileJson, { getAll } from './getFileJson.ts';
import { getLicense } from './getLicense.ts';
import { color } from '../../deps.ts';

const colors = {
  blue: { r: 74, g: 165, b: 240 },
  pink: { r: 193, g: 98, b: 222 },
  orange: { r: 208, g: 142, b: 82 },
  red: { r: 255, g: 97, b: 110 },
} as const;

const blue = (str: string) => color.rgb24(str, colors.blue);
const pink = (str: string) => color.rgb24(str, colors.pink);
const orange = (str: string) => color.rgb24(str, colors.orange);
const red = (str: string) => color.rgb24(str, colors.red);
const bold = (str: string) => color.bold(str);

export default async function licenseHelp(license: string) {
  if (!license) {
    // Show all license descriptions
    const doc = await getAll('descriptions.json');
    const string = Object.keys(doc)
      .map(key => `    ${red('-')} ${doc[key].name} ${doc[key].id ? pink('(') + blue(doc[key].id) + pink(') ') : ''}${bold(doc[key].year + '')}`)
      .join('\n');
    const str = `
  ${bold('Supported Licenses:')}

${string}
    `;
    console.log(str);
  } else {
    try {
      license = getLicense(license);
      // Gets the exact license that the user queries for
      const file = (await getFileJson('descriptions.json', license)) as {
        [key: string]: any;
      };

      let maxPermissionLength = 0;
      let maxLimitationLength = 0;
      let maxConditionLength = 0;

      file.permissions.forEach((permission: { [key: string]: string }) => {
        maxPermissionLength = Math.max(permission.label.length, maxPermissionLength);
      });

      file.limitations.forEach((limitation: { [key: string]: string }) => {
        maxLimitationLength = Math.max(limitation.label.length, maxLimitationLength);
      });

      file.conditions.forEach((condition: { [key: string]: string }) => {
        maxConditionLength = Math.max(condition.label.length, maxConditionLength);
      });

      const str = `
  ${bold(file.name)} ${file.id ? orange('(') + pink(file.id) + orange(')') : ''}
  Created in ${orange(file.year + '')}

  ${bold(`Description:`)}

    ${file.description.split('\n').join(`\n     `)}

  ${bold(`Permissions:`)}

${
  file.permissions
    .map(
      (permission: { [key: string]: string }) =>
        `    ${blue(permission.label.padEnd(maxPermissionLength, ' '))}  ${red(`-`)} ${permission.detail
          .split('\n')
          .join(`\n      ${''.padEnd(maxPermissionLength, ' ')}`)}`,
    )
    .join('\n') || '    None'
}

  ${bold(`Limitations:`)}

${
  file.limitations
    .map(
      (limitation: { [key: string]: string }) =>
        `    ${blue(limitation.label.padEnd(maxLimitationLength, ' '))}  ${red(`-`)} ${limitation.detail
          .split('\n')
          .join(`\n      ${''.padEnd(maxLimitationLength, ' ')}`)}`,
    )
    .join('\n') || '    None'
}

  ${bold(`Conditions:`)}

${
  file.conditions
    .map(
      (condition: { [key: string]: string }) =>
        `    ${blue(condition.label.padEnd(maxConditionLength, ' '))}  ${red(`-`)} ${condition.detail
          .split('\n')
          .join(`\n      ${''.padEnd(maxConditionLength, ' ')}`)}`,
    )
    .join('\n') || '    None'
}
`;

      console.log(str);
    } catch (err) {
      console.log(err.message);
    }
  }
}
