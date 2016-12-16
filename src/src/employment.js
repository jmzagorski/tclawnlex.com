import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import { sendto } from './env';
import Canidate from './canidate.js';
import 'fetch';

@inject(HttpClient)
export class Employment {
  constructor(http) {
    this.view = "./employment-form.html";
    this.helpMsg = null
    this._http = http;
    this.loading = false;
    this.canidate = new Canidate();

    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl(`https:////formspree.io/`);
    });
  }

  submit() {
    this.loading = true;

    return this._http.fetch(sendto(), {
      method: `POST`,
      body: json(this.canidate)
    }).then(response => response.json())
    .then(() => {
      this.helpMsg = null;
      this.view = "./thanks.html";
    }).catch(err => {
      this.helpMsg = `there was an error submitting your form. ` + 
        `Please try again or contact us direct from the Contact Page`;
    })
    .then(() => this.loading = false);
  }
}
