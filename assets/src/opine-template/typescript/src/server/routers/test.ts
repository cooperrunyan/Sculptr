import { OpineRequest, OpineResponse } from '../../deps.ts';

export function test(req: OpineRequest, res: OpineResponse) {
  res.send({
    hello: 'world',
  });
}
