import { extendObservable } from 'mobx';
import provider from '../@ueno/starter-kit/provider';

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
