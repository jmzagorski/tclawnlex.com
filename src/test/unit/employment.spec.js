import {Employment} from '../../src/employment';
import * as env from '../../src/env';
import Canidate from '../../src/canidate';
import {StageComponent, ComponentTester} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';
import {BootstrapFormRenderer} from '../../src/resources/renderers/bootstrap-form-renderer'
//import { Container } from 'aurelia-dependency-injection';
//import { BindingLanguage } from 'aurelia-templating';
//import { TemplatingBindingLanguage } from 'aurelia-templating-binding';
import {
  StandardValidator,
  ValidationRules,
  ValidationParser,
  ValidateResult,
  ValidationControllerFactory,
  ValidationController
} from 'aurelia-validation';
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
  let sut;
  let http;
  let controller;
  let component;
  let validator;

  beforeAll(done => {
    component = StageComponent.withResources().inView('<div></div>').boundTo({});
    component.bootstrap(aurelia => aurelia.use.standardConfiguration().plugin('aurelia-validation'));
    component.create(bootstrap).then(done);

    /* ValidationRules setup
    const container = new Container();
    container.registerInstance(BindingLanguage, container.get(TemplatingBindingLanguage));
    const parser = container.get(ValidationParser);
    ValidationRules.initialize(parser);
    validator = container.get(StandardValidator);
    */
  });

  afterAll(() => {
    component.dispose();
  });

  beforeEach(() => {
    const factory = jasmine.setupSpy('factory', ValidationControllerFactory.prototype);
    controller = jasmine.setupSpy('controller', ValidationController.prototype);
    http = new HttpStub();
    factory.createForCurrentScope.and.returnValue(controller);
    controller.validate.and.returnValue(Promise.resolve({valid: true}));

    sut = new Employment(http, factory);
  });

  it('initiates the current view model variables', () => {
    expect(sut.view).toEqual('./employment-form.html');
    expect(sut.canidate).toEqual(new Canidate());
    expect(sut.helpMsg).toEqual(null);
    expect(sut.loading).toBeFalsy();
    expect(sut.controller).toBe(controller);
    expect(controller.addRenderer).toHaveBeenCalledWith(new BootstrapFormRenderer());
  });

  // TODO
  xit('sets up validation rules on the canidate', () => {
    sut.canidate = 'anything'
    let rules = ValidationRules.ensure('prop').email().rules;
    validator.validateProperty(sut.canidate, 'fullName')
      .then(results => {
        const expected = [new ValidateResult(rules[0][0], sut.canidate, 'fullName', true, null)];
        expected[0].id = results[0].id;
        expect(results).toEqual(expected);
      })
      .then(() => {
        sut.canidate = '';
        rules = ValidationRules.ensure('fullName').email().rules;
        return validator.validateProperty(obj, 'prop', rules);
      })
      .then(results => {
        const expected = [new ValidateResult(rules[0][0], obj, 'prop', false, 'Prop is not a valid email.')];
        expected[0].id = results[0].id;
        expect(results).toEqual(expected);
      })
      .then(() => {
        obj = { prop: null };
        rules = ValidationRules.ensure('fullName').email().rules;
        return validator.validateProperty(obj, 'prop', rules);
      })
      .then(results => {
        const expected = [new ValidateResult(rules[0][0], obj, 'prop', true, null)];
        expected[0].id = results[0].id;
        expect(results).toEqual(expected);
      })
      .then(done);
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
    setTimeout(() => http.resolve({ json: () => sut.canidate }));
  });

  it('successfully posts the data', done => {
    sut.submit().then(() => {
      expect(sut.helpMsg).toEqual(null);
      expect(sut.view).toEqual('./thanks.html');
      done();
    });

    setTimeout(() => http.resolve({ json: () => {} }));
  });

  it('shows a help msg when posts fails', done => {
    sut.submit().then(() => {
      expect(sut.helpMsg).toContain('there was an error submitting your form');
      expect(sut.view).toEqual('./employment-form.html');
      done();
    });

    setTimeout(() => http.reject());
  });

  it('adds an error to the canidate and posts', () => {
    const errMsg = 'something';
    controller.validate.and.returnValue(Promise.reject(errMsg));

    sut.submit().catch(() => {
      expect(sut.candidate.error).toEqual('something');
      // if this is defined that means fetch was called
      expect(http.resolve).toBeDefined();
    });
  });
});
