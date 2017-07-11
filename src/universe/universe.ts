import { Star } from './star';
import { Fleet } from './fleet';

export class Universe {

  rawData: any;

  player_uid: number;
  stars: Map<string, Star>;
  fleets: Map<string, Fleet>;

  constructor(data) {
    this.rawData = data;
    this.player_uid = data.player_uid;
    this.stars = data.stars;
    this.fleets = data.fleets;
  }

  starsAsArray() : Star[] {
    return Object.keys(this.stars)
      .map(id => this.stars[id]);
  }

  getStar(id) : Star{
    const star = this.stars[id];
    if (!star) {
      throw Error(`Could not get star by ID: ${id}`);
    }
    return star;
  }

  getStarByName(name) : Star {
    const cleanName = (name || '').toLowerCase();
    return this.starsAsArray().find(star => star.n.toLowerCase() === cleanName);
  }

  getPlayerStars(playerId) : Star[] {
    return this.starsAsArray().filter(star => star.puid === playerId);
  }

  getOwnStars() : Star[] {
    return this.getPlayerStars(this.player_uid);
  }

  fleetsAsArray() : Fleet[] {
    return Object.keys(this.fleets)
      .map(id => this.fleets[id]);
  }

  getFleetsAtStar(star: Star) : Fleet[] {
      return this.fleetsAsArray().filter(fleet => fleet.ouid === star.uid);
  }
}