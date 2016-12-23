import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import { sendto } from './env';
import Canidate from './canidate.js';
import 'fetch';
import {ValidationControllerFactory, ValidationRules} from 'aurelia-validation';
import {BootstrapFormRenderer} from './resources/renderers/bootstrap-form-renderer'

@inject(HttpClient, ValidationControllerFactory)
export class Employment {

  constructor(http, controllerFactory) {
    this.view = "./employment-form.html";
    this.helpMsg = null
    this.loading = false;
    this.canidate = new Canidate();
    this.controller = controllerFactory.createForCurrentScope();
    this.controller.addRenderer(new BootstrapFormRenderer());
    this._http = http;

    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl(`https:////formspree.io/`);
    });

    ValidationRules
      .ensure('fullName').required()
      .ensure('age').required()
      .ensure('city').required()
      .ensure('phone').required().matches(/\d{3}-\d{3}-\d{4}/)
      .withMessage('Please format your phone number like ###-###-####')
      .ensure('email').email()
      .ensure('citizen').required()
      .ensure('canWork').required()
      .ensure('canDrive').required()
      .ensure('hasFelony').required()
      .ensure('felonies').required().when(a => a.hasFelony)
      .ensure('experience').required()
      .on(this.canidate);
  }

  submit() {
    this.loading = true;

    return this.controller.validate()
      .then(result => {
        if (result.valid) {
          return this._post();
        }
      })
      .catch(error => {
        this.canidate.error = error;
        return this._post();
      })
      .then(() => this.loading = false);
  }

  _post() {
    return this._http.fetch(sendto(), {
      method: `POST`,
      body: json(this.canidate)
    }).then(response => response.json())
      .then(data => {
        this.helpMsg = null;
        this.view = "./thanks.html";
        return data;
      }).catch(err => {
        this.helpMsg = `there was an error submitting your form. ` + 
          `Please try again or contact us direct from the Contact Page`;
        return err;
      });
  }
}
