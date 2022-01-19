import use from './index.ts';
import { cliffy } from '../../deps.ts';

export const command = new cliffy.Command();

command.alias('install').alias('update').description('Installs a given version of sculptr (defaults to the latest version)').action(use);
