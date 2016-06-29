/* @flow */
/* globals Promise */

export const mockData = {
  'http://example.com/foo.json': JSON.stringify({foo: 1}),
};

class Response {
  _url: string;
  _data: string;

  constructor(url, data) {
    this._url = url;
    this._data = data;
  }
  json() {
    return new Promise((resolve, reject) => {
      try {
        resolve(JSON.parse(this._data));
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default function fetch(url: string): Promise {
  return new Promise((resolve, reject) => {
    if (mockData.hasOwnProperty(url)) {
      let data = mockData[url];
      resolve(new Response(url, data));
    } else {
      reject(new Error('Not Found: ' + url));
    }
  });
}

fetch.mockData = mockData;
