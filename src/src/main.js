import 'bootstrap';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  aurelia.use
    .plugin('aurelia-animator-css')
    .feature('resources');

  aurelia.start().then(() => aurelia.setRoot());
}
