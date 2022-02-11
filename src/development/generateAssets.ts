import { fs, path } from '../deps.ts';
import { templateFolderNames as templates, scripts, styles, licenses } from '../support/index.ts';
import { LicenseContent, LicenseDescriptions } from '../types/index.ts';

function getTemplates() {
  const allFiles: any = {};

  templates.forEach((template) => {
    scripts.forEach((script) => {
      styles.forEach((style) => {
        const p = path.resolve('./assets/src', template, script, style);
        const jsonObj: any = {};

        function file(pat: string) {
          if (Deno.lstatSync(pat).isDirectory) {
            // recursive

            const children = Deno.readDirSync(pat);
            for (const child of children) {
              const childPath = path.resolve(pat, child.name);
              file(childPath);
            }
          } else {
            // if it's a file
            const relativePath = pat.split(`${template}/${script}/${style}`)[1];

            const pathToImage = `assets/src/${template}/${script}/${style}${relativePath}`;

            if (/.png$|.ico$|.jpg$|.jpeg$/.test(pat)) jsonObj[relativePath] = pathToImage;
            else jsonObj[relativePath] = Deno.readTextFileSync(pat);
          }
        }
        file(p);

        allFiles[`${template}/${script}/${style}`] = jsonObj;
      });
    });
  });
  return allFiles;
}

function writeTemplates(files: { [key: string]: string }) {
  fs.emptyDirSync('../assets/out');
  templates.forEach((template) => {
    fs.ensureDirSync(`./assets/out/${template}`);
    scripts.forEach((script) => {
      fs.ensureDirSync(`./assets/out/${template}/${script}`);
      styles.forEach((style) => {
        Deno.writeTextFileSync(`./assets/out/${template}/${script}/${style}.json`, JSON.stringify(files[`${template}/${script}/${style}`]));
      });
    });
  });
}

fs.emptyDirSync('./assets/out');
writeTemplates(getTemplates());
fs.copySync('./assets/src/files/tsconfig', 'assets/out/files/tsconfig');

function getLicenses() {
  const info: { [key: string]: string } = {};
  for (const license of licenses) {
    const content = Deno.readTextFileSync(`./assets/src/files/license/${license.name}.txt`);
    info[license.name] = content;
  }
  return info;
}

function writeLicenses(info: {}) {
  fs.emptyDirSync('./assets/out/files/license');
  fs.ensureFileSync('./assets/out/files/license/license.json');
  Deno.writeTextFileSync('./assets/out/files/license/license.json', JSON.stringify(info));
}
writeLicenses(getLicenses());

function getLicenseDescriptions() {
  const descriptions: LicenseDescriptions = JSON.parse(Deno.readTextFileSync('./src/commands/add/descriptions/descriptions.json'));
  const info: { [key: string]: LicenseContent } = {};
  for (const license of licenses) {
    const content: LicenseContent = JSON.parse(Deno.readTextFileSync(`./assets/src/files/license/descriptions/${license.name}.json`));

    for (const permission of content.permissions) {
      const index = content.permissions.indexOf(permission);
      if (descriptions.permissions[permission]) content.permissions[index] = descriptions.permissions[permission];
    }

    for (const limitation of content.limitations) {
      const index = content.limitations.indexOf(limitation);
      if (descriptions.limitations[limitation]) content.limitations[index] = descriptions.limitations[limitation];
    }

    for (const condition of content.conditions) {
      const index = content.conditions.indexOf(condition);
      if (descriptions.conditions[condition]) content.conditions[index] = descriptions.conditions[condition];
    }

    info[license.name] = content;
  }
  return info;
}

function writeLicenseDescriptions(licenses: { [key: string]: LicenseContent }) {
  fs.ensureFileSync('./assets/out/files/license/descriptions/descriptions.json');
  Deno.writeTextFileSync('./assets/out/files/license/descriptions/descriptions.json', JSON.stringify(licenses));
}

writeLicenseDescriptions(getLicenseDescriptions());
