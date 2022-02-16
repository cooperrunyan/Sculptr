import { Drash } from '../../deps.ts';

export class Test extends Drash.Resource {
  public paths = ['/api/test'];

  public GET(req: Drash.Request, res: Drash.Response) {
    return res.json({
      hello: 'world',
    });
  }
}
