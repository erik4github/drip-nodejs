const sinon = require('sinon');
const client = require('../../lib/index')({ token: 'abc123', accountId: 9999999 });
const helper = require('../../lib/helpers');

describe('Broadcasts with callback', () => {
  beforeEach(() => {
    sinon.stub(client, 'request')
      .yields(null, { statusCode: 200 }, { broadcasts: {} });
  });

  afterEach(() => {
    client.request.restore();
  });

  it('should provide the correct base URL', () => {
    expect(helper.broadcastsUrl(123)).toBe('https://api.getdrip.com/v2/123/broadcasts/');
  });

  it('should list broadcasts and call request with get', (done) => {
    expect(typeof client.listBroadcasts).toEqual('function');

    client.listBroadcasts({ status: 'all' }, (error, response) => {
      expect(response.statusCode).toBe(200);
      expect(client.request.callCount).toBe(1);
    });
    done();
  });

  it('should fetch a broadcast and call request with get', (done) => {
    expect(typeof client.fetchBroadcast).toEqual('function');

    client.fetchBroadcast(8888888, (error, response) => {
      expect(response.statusCode).toBe(200);
      expect(client.request.callCount).toBe(1);
    });
    done();
  });
});

describe('Broadcasts with Promise', () => {
  const expectedResponse = {
    statusCode: 200,
    body: {
      broadcasts: [{}]
    }
  };

  const failTest = (error) => {
    expect(error).toBeUndefined();
  };

  beforeEach(() => {
    sinon.stub(client, 'request').resolves(expectedResponse);
    spyOn(client, 'get').and.callThrough();
  });

  afterEach(() => {
    client.request.restore();
  });

  it('should list broadcasts', (done) => {
    expect(typeof client.listBroadcasts).toEqual('function');

    client.listBroadcasts()
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(client.request.callCount).toBe(1);
      })
      .catch(failTest);
    done();

    expect(client.get).toHaveBeenCalledWith('9999999/broadcasts/', { qs: { status: 'all' } }, undefined);
  });

  it('should fetch broadcast', (done) => {
    expect(typeof client.fetchBroadcast).toEqual('function');

    client.fetchBroadcast(8888888)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(client.request.callCount).toBe(1);
      })
      .catch(failTest);
    done();

    expect(client.get).toHaveBeenCalledWith('9999999/broadcasts/8888888', {}, undefined);
  });
});
