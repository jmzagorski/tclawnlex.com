import { Employment } from '../../src/employment';
import * as env from '../../src/env';
import Canidate from '../../src/canidate';
import { StageComponent, ComponentTester } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { BootstrapFormRenderer } from '../../src/resources/renderers/bootstrap-form-renderer'
import { Container } from 'aurelia-dependency-injection';
import { BindingLanguage } from 'aurelia-templating';
import { TemplatingBindingLanguage } from 'aurelia-templating-binding';
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

    const container = new Container();
    container.registerInstance(BindingLanguage, container.get(TemplatingBindingLanguage));
    const parser = container.get(ValidationParser);
    ValidationRules.initialize(parser);
    validator = container.get(StandardValidator);
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
    expect(sut.helpMsg).toEqual(null);
    expect(sut.loading).toBeFalsy();
    expect(sut.canidate).toEqual(new Canidate());
    expect(sut.controller).toBe(controller);
    expect(sut.controller.addRenderer).toHaveBeenCalledWith(new BootstrapFormRenderer());
  });

  it('sets validation rules on the candidate instance', done => {
    let rules = ValidationRules.ensure('fullName').required().rules;
    let prop = 'fullName';

    validator.validateProperty(sut.canidate, prop, rules)
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, false, 'Full Name is required.');
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        prop = 'age';
        rules = ValidationRules.ensure(prop).required().rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, false, 'Age is required.');
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        prop = 'city';
        rules = ValidationRules.ensure(prop).required().rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, false, 'City is required.');
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        prop = 'phone';
        rules = ValidationRules.ensure(prop).required().rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, false, 'Phone is required.');
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        sut.canidate.phone = '8591112222'
        rules = ValidationRules.ensure(prop).matches(/\d{3}-\d{3}-\d{4}/).rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, false, 'Phone is not correctly formatted.');
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        sut.canidate.phone = '(859) 111-2222'
        rules = ValidationRules.ensure(prop).matches(/\d{3}-\d{3}-\d{4}/).rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, false, 'Phone is not correctly formatted.');
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        sut.canidate.phone = '859-111-2222'
        rules = ValidationRules.ensure(prop).matches(/\d{3}-\d{3}-\d{4}/).rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, true, null);
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        prop = 'email'
        sut.canidate.email = 'foo@bar.com'
        rules = ValidationRules.ensure(prop).email().rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, true, null);
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        sut.canidate.email = 'foo'
        rules = ValidationRules.ensure(prop).email().rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, false, 'Email is not a valid email.');
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        prop = 'citizen';
        rules = ValidationRules.ensure(prop).required().rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, false, 'Citizen is required.');
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        prop = 'canWork';
        rules = ValidationRules.ensure(prop).required().rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, false, 'Can Work is required.');
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        prop = 'canDrive';
        rules = ValidationRules.ensure(prop).required().rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, false, 'Can Drive is required.');
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        prop = 'hasFelony';
        rules = ValidationRules.ensure(prop).required().rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, false, 'Has Felony is required.');
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        sut.canidate.hasFelony = true;
        prop = 'felonies';
        rules = ValidationRules.ensure(prop).required().when(a => a.hasFelony).rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, false, 'Felonies is required.');
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
      })
      .then(() => {
        sut.canidate.hasFelony = false;
        rules = ValidationRules.ensure(prop).required().when(a => a.hasFelony).rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        expect(results).toEqual([]);
      })
      .then(() => {
        prop = 'experience';
        rules = ValidationRules.ensure(prop).required().rules;
        return validator.validateProperty(sut.canidate, prop, rules);
      })
      .then(results => {
        const expected = new ValidateResult(rules[0][0], sut.canidate,
          prop, false, 'Experience is required.');
        expected.id = results[0].id
        expect(results[0]).toEqual(expected);
        done();
      })
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
