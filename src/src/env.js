//removeIf(production)-->
import {PLATFORM} from "aurelia-pal";
//endRemoveIf(production)-->

export function sendto() {
  //removeIf(production)-->
  const isDev = (PLATFORM.location.host.match(/tclawnlex/i) ? false : true);

  if (isDev) {
    return 'dssrun@yahoo.com'
  } 
  //endRemoveIf(production)-->

  return 'tclawncarellc@gmail.com'
}
