import * as assert from 'power-assert';

import { Framework } from '@midwayjs/web';
import { createApp, close, createHttpRequest } from '@midwayjs/mock';
import { Application } from 'egg';

describe('test/controller/home.test.ts', () => {
  let app: Application;
  let currentUser: any;
  beforeAll(async () => {
    app = await createApp<Framework>();
    const response = await createHttpRequest(app)
      .post('/auth/login')
      .type('form')
      .send(app.config.admin)
      .expect(200);
    currentUser = response.body.data;
  });

  afterAll(async () => {
    await close(app);
  });

  it('should GET /', async () => {
    const response = await createHttpRequest(app)
      .get('/')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);

    const msg: string = response.text;
    assert(msg && msg.includes('Hello Midwayjs!'));
    assert(/^reqId: "\d{19,}"/u.test(msg)); // 6755455236955799552
  });

  it('should GET /ping', async () => {
    const ret = await createHttpRequest(app).get('/ping').expect(200);

    const msg: string = ret.text;
    assert(msg && msg === 'OK');
  });

  it('should GET /genid_hex', async () => {
    const response = await createHttpRequest(app)
      .get('/genid_hex')
      .set('Authorization', `Bearer ${currentUser.token}`)
      .expect(200);

    const msg: string = response.text;
    assert(/^[\dA-F]{16}"/u.test(msg)); // 5DC032BEFECD8000
  });
});
