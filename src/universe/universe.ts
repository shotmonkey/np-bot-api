import { Star, RawStarData } from './star';
import { Fleet, RawFleetData } from './fleet';

export interface RawUniverseData {
  player_uid: number;
  stars: { [key:string]:RawStarData };
  fleets: { [key:string]:RawFleetData };
}

export class Universe {

  rawData: RawUniverseData;

  playerId: number;
  stars: Map<string, Star>;
  fleets: Map<string, Fleet>;

  constructor(data: RawUniverseData) {
    this.rawData = data;
    this.playerId = data.player_uid;

    this.fleets = new Map<string, Fleet>();
    Object.keys(data.fleets)
      .forEach(fid => {
        this.fleets.set(fid, new Fleet(data.fleets[fid]));
      });

    this.stars = new Map<string, Star>();
    Object.keys(data.stars)
      .forEach(sid => {
        this.stars.set(sid, new Star(data.stars[sid]));
      });

  }

  getStars() : Star[] {
    return Array.from(this.stars.values());
  }

  getStar(id: string) : Star{
    const star = this.stars[id];
    if (!star) {
      throw Error(`Could not get star by ID: ${id}`);
    }
    return star;
  }

  getStarByName(name: string) : Star {
    const safeName = (name || '').toLowerCase();
    return this.getStars().find(star => star.name.toLowerCase() === safeName);
  }

  getPlayerStars(playerId: number = this.playerId) : Star[] {
    return this.getStars().filter(star => star.ownerId === playerId);
  }

  getOwnStars() : Star[] {
    return this.getPlayerStars(this.playerId);
  }

  getFleets() : Fleet[] {
    return Array.from(this.fleets.values());
  }

  getFleetsAtStar(star: Star, playerId: number = this.playerId) : Fleet[] {
      return this.getFleets().filter(fleet => fleet.orbitingStarId = star.id);
  }
}