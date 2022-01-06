import makeTree from './utils/makeTree.ts';
import print from './utils/print.ts';

export default async function tree() {
  print('Files written');
  print('');
  print(`Making an visual representation of the folder tree...`);
  const tree = await makeTree();
  print('Tree created:');
  print('');
  console.log(tree);
  print('');
}
