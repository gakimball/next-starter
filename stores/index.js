import { observable, decorate, action } from 'mobx';
import store from 'ueno-starter/store';

class Planets {

  planets = ['Earth', 'Mars', 'Jupiter']

  async addPlanet(planet) {
    this.planets.push(planet);
  }
}

decorate(Planets, {
  planets: observable,
  addPlanet: action.bound,
});

export default store({
  planets: Planets,
});
