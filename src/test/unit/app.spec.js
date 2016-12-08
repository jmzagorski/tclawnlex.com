import {App} from '../../src/app';

class RouterStub {
  configure(handler) {
    handler(this);
  }

  map(routes) {
    this.routes = routes;
  }
}

describe('the App module', () => {
  var sut;
  var mockedRouter;

  beforeEach(() => {
    mockedRouter = new RouterStub();
    sut = new App();
    sut.configureRouter(mockedRouter, mockedRouter);
  });

  it('contains a router property', () => {
    expect(sut.router).toBeDefined();
  });

  it('configures the router title', () => {
    expect(sut.router.title).toEqual('TC Lawn Lex');
  });

  it('has a welcome route', () => {
    expect(sut.router.routes).toContain({
      route: ['', 'welcome'],
      name: 'welcome',
      moduleId: 'welcome',
      nav: true,
      title: 'Welcome'
    });
  });

  it('has a services route', () => {
    expect(sut.router.routes).toContain({
      route: 'services',
      name: 'services',
      moduleId: 'services',
      nav: true,
      title: 'Services'
    });
  });

  it('has an about route', () => {
    expect(sut.router.routes).toContain({
      route: 'about',
      name: 'about',
      moduleId: 'about',
      nav: true,
      title: 'About'
    });
  });

  it('has a testimonials route', () => {
    expect(sut.router.routes).toContain({
      route: 'testimonials',
      name: 'testimonials',
      moduleId: 'testimonials',
      nav: true,
      title: 'Testimonials'
    });
  });

  it('has a gallery route', () => {
    expect(sut.router.routes).toContain({
      route: 'gallery',
      name: 'gallery',
      moduleId: 'gallery',
      nav: true,
      title: 'Gallery'
    });
  });

  it('has a contact route', () => {
    expect(sut.router.routes).toContain({
      route: 'contact',
      name: 'contact',
      moduleId: 'contact',
      nav: true,
      title: 'Contact'
    });
  });

  it('has an employment route', () => {
    expect(sut.router.routes).toContain({
      route: 'employment',
      name: 'employment',
      moduleId: 'employment',
      nav: true,
      title: 'Employment'
    });
  });
});
