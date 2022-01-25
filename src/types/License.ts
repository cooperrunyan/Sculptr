import { licenses } from '../support/index.ts';

export type License = typeof licenses[number]['name'];
export type LicenseContent = {
  description: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
};

export type LicenseDescriptions = {
  permissions: { [key: string]: string };
  limitations: { [key: string]: string };
  conditions: { [key: string]: string };
};

export type LicenseDescription = {
  name: string;
  id: string;
  year: number;
  description: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
};
