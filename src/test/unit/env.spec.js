import * as env from '../../src/env';
import {PLATFORM} from "aurelia-pal";

describe('the environment specific functions', () => {

  beforeEach(() => {
    PLATFORM.location = { location: null };
  });

  it('sets the dev email to a developer', () => {
    PLATFORM.location.host = 'localhost';

    let email = env.sendto();

    expect(email).toEqual('dssrun@yahoo.com');
  });

  it('set the prod email to the site owner', () => {
    PLATFORM.location.host = 'tclawnlex';

    let email = env.sendto();

    expect(email).toEqual('tclawncarellc@gmail.com');
  });
});
