export class App {
  configureRouter(config, router) {
    config.title = 'TC Lawn Lex';
    config.map([{
      route: ['', 'welcome'],
      name: 'welcome',
      moduleId: 'welcome',
      nav: true,
      title: 'Welcome'
    }, {
      route: 'services',
      name: 'services',
      moduleId: 'services',
      nav: true,
      title: 'Services'
    }, {
      route: 'about',
      name: 'about',
      moduleId: 'about',
      nav: true,
      title: 'About'
    }, {
      route: 'testimonials',
      name: 'testimonials',
      moduleId: 'testimonials',
      nav: true,
      title: 'Testimonials'
    }, {
      route: 'gallery',
      name: 'gallery',
      moduleId: 'gallery',
      nav: true, title:
      'Gallery'
    }, {
      route: 'contact',
      name: 'contact',
      moduleId: 'contact',
      nav: true,
      title: 'Contact'
    }, {
      route: 'employment',
      name: 'employment',
      moduleId: 'employment',
      nav: true,
      title: 'Employment'
    }]);

    this.router = router;
  }
}
