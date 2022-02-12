import { getFileJson, getAll } from './getFileJson.ts';
import { getLicense } from './getLicense.ts';
import { chalk } from '../../../deps.ts';
import { print } from '../../build/utils/print.ts';

export async function licenseHelp(license: string) {
  if (!license) {
    // Show all license descriptions
    const doc = await getAll('descriptions.json');
    const string = Object.keys(doc)
      .map(
        (key) =>
          `    ${chalk.red('-')} ${doc[key].name} ${doc[key].id ? chalk.magenta('(') + chalk.blue(doc[key].id) + chalk.magenta(') ') : ''}${chalk.bold(
            doc[key].year + '',
          )}`,
      )
      .join('\n');
    const str = `
  ${chalk.bold('Supported Licenses:')}

${string}
    `;
    print(str);
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
  ${chalk.bold(file.name)} ${file.id ? chalk.yellow('(') + chalk.magenta(file.id) + chalk.yellow(')') : ''}
  Created in ${chalk.yellow(file.year + '')}

  ${chalk.bold(`Description:`)}

    ${file.description.split('\n').join(`\n     `)}

  ${chalk.bold(`Permissions:`)}

${
  file.permissions
    .map(
      (permission: { [key: string]: string }) =>
        `    ${chalk.blue(permission.label.padEnd(maxPermissionLength, ' '))}  ${chalk.red(`-`)} ${permission.detail
          .split('\n')
          .join(`\n      ${''.padEnd(maxPermissionLength, ' ')}`)}`,
    )
    .join('\n') || '    None'
}

  ${chalk.bold(`Limitations:`)}

${
  file.limitations
    .map(
      (limitation: { [key: string]: string }) =>
        `    ${chalk.blue(limitation.label.padEnd(maxLimitationLength, ' '))}  ${chalk.red(`-`)} ${limitation.detail
          .split('\n')
          .join(`\n      ${''.padEnd(maxLimitationLength, ' ')}`)}`,
    )
    .join('\n') || '    None'
}

  ${chalk.bold(`Conditions:`)}

${
  file.conditions
    .map(
      (condition: { [key: string]: string }) =>
        `    ${chalk.blue(condition.label.padEnd(maxConditionLength, ' '))}  ${chalk.red(`-`)} ${condition.detail
          .split('\n')
          .join(`\n      ${''.padEnd(maxConditionLength, ' ')}`)}`,
    )
    .join('\n') || '    None'
}
`;

      print(str);
    } catch (err) {
      print(err.message);
    }
  }
}
