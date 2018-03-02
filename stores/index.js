import { extendObservable } from 'mobx';
import provider from 'ueno-starter/provider';

class Planets {

  constructor() {
    extendObservable(this, {
      planets: ['Earth', 'Mars', 'Jupiter'],
    });
  }
}

export default provider({
  planets: Planets,
});
