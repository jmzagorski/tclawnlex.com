import {Employment} from '../../src/employment';
import using from 'jasmine-data-provider';
import * as env from '../../src/env';

class HttpStub {
  constructor() {
    this.url = null;
    this.config = null;
    this.resolve = null;
    this.reject = null;
  }

  fetch(url, blob) {
    this.url = url;
    this.blob = blob;
    let promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    return promise;
  }

  configure(func) {
    this.config = func;
  }
}

describe('the Employment module', () => {
  var sut;
  var http;

  beforeEach(() => {
    http = new HttpStub();
    sut = new Employment(http);
  });

  it('initiates the current view model variables', () => {
    expect(sut.view).toEqual('./employment-form.html');
    expect(sut.employment).toEqual(null);
    expect(sut.helpMsg).toEqual(null);
  });

  it('configures the http client with std configuration', () => {
    let useStdConfig = false;
    let config = {
      useStandardConfiguration: () => {
        useStdConfig = true;
        return config;
      },
      withBaseUrl: () => {}
    };

    http.config(config);

    expect(useStdConfig).toBeTruthy();
  });

  it('configures the http client with a base url', () => {
    let baseUrl = null;
    let config = {
      useStandardConfiguration: () => config,
      withBaseUrl: (url) => baseUrl = url
    };

    http.config(config);

    expect(baseUrl).toEqual('https:////formspree.io/');
  });

  it('fetches with post data', done => {
    spyOn(env, "sendto").and.returnValue('test');
    sut.employment = { id: 1 };
    http.itemStub = sut.employment;

    sut.submit().then(() => {
      expect(http.url).toEqual('test');
      expect(http.blob.method).toEqual('POST');
      let fr = new FileReader();
      fr.addEventListener("loadend", function() {
        expect(fr.result).toEqual("{\"id\":1}");
        done();
      });
      fr.readAsText(http.blob.body);
    });

    http.resolve({ json: () => sut.employment });
  });

  it('successfully posts the data', done => {
    sut.submit().then(() => {
      expect(sut.helpMsg).toEqual(null);
      expect(sut.view).toEqual('./thanks.html');
      done();
    });

    http.resolve({ json: () => {} });
  });

  it('shows a help msg when posts fails', done => {
    sut.submit().catch(() => {
      expect(sut.helpMsg).toContain('there was an error submitting your form');
      expect(sut.view).toEqual('./employment-form.html');
      done();
    });

    http.reject({});
  });
});
