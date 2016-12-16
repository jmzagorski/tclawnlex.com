import {Employment} from '../../src/employment';
import using from 'jasmine-data-provider';
import * as env from '../../src/env';
import Canidate from '../../src/canidate';

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
    expect(sut.canidate).toEqual(new Canidate());
    expect(sut.helpMsg).toEqual(null);
    expect(sut.loading).toBeFalsy();
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
    const expectJson = '{"fullName":"tom","age":2,"city":"lex","phone":"1900",' + 
      '"email":"@.com","citizen":"yes","canWork":"no","canDrive":"yes",' + 
      '"hasFelony":"yes","felonies":"steal","movingViolations":"some",' +
      '"experience":"none"}';
    sut.canidate.fullName = 'tom';
    sut.canidate.age = 2;
    sut.canidate.city = 'lex';
    sut.canidate.phone = '1900';
    sut.canidate.email = '@.com';
    sut.canidate.citizen = 'yes';
    sut.canidate.canWork = 'no';
    sut.canidate.canDrive = 'yes';
    sut.canidate.hasFelony = 'yes';
    sut.canidate.felonies = 'steal';
    sut.canidate.movingViolations = 'some';
    sut.canidate.experience = 'none';

    spyOn(env, "sendto").and.returnValue('test');
    http.itemStub = sut.canidate;

    sut.submit().then(() => {
      expect(http.url).toEqual('test');
      expect(http.blob.method).toEqual('POST');
      expect(sut.loading).toBeFalsy();
      let fr = new FileReader();
      fr.addEventListener('loadend', function() {
        expect(fr.result).toEqual(expectJson);
        done();
      });
      fr.readAsText(http.blob.body);
    });

    expect(sut.loading).toBeTruthy();
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
    sut.submit().then(() => {
      expect(sut.helpMsg).toContain('there was an error submitting your form');
      expect(sut.view).toEqual('./employment-form.html');
      done();
    });

    http.reject({});
  });
});
