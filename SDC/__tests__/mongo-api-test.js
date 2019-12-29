const frisby = require('frisby');
const port = 3001;
const url = `localhost:${port}`

describe('Basic connections', function() {
  it(`it should connect to test server at port ${port}`, function() {
    return frisby
      .get(`http://localhost:${port}`)
      .expect('status', 200);
  });

  it(`get route should return responses with requested info`, function() {
    return frisby
      .get(`http://localhost:${port}`)
      .expect('responseTime', 300);
  });
});