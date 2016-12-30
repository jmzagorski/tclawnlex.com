import {PLATFORM} from 'aurelia-pal';

export function sendto() {
  const isDev = (PLATFORM.location.host.match(/tclawnlex/i) ? false : true);

  if (isDev) {
    return 'dssrun@yahoo.com';
  }

  return 'tclawncarellc@gmail.com';
}
