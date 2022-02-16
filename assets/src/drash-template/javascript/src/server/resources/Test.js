import { Drash } from '../../deps.js';

export class Test extends Drash.Resource {
  paths = ['/api/test'];

  GET(req, res) {
    return res.json({
      hello: 'world',
    });
  }
}
