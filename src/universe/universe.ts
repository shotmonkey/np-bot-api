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
  stars: Map<number, Star>;
  fleets: Map<number, Fleet>;

  constructor(data: RawUniverseData) {
    this.rawData = data;
    this.playerId = data.player_uid;

    this.fleets = new Map<number, Fleet>();
    Object.keys(data.fleets)
      .forEach(fid => {
        const fleet = data.fleets[fid];
        this.fleets.set(fleet.uid, new Fleet(fleet));
      });

    this.stars = new Map<number, Star>();
    Object.keys(data.stars)
      .forEach(sid => {
        const star = data.stars[sid];
        this.stars.set(star.uid, new Star(star));
      });

  }

  getStars() : Star[] {
    return Array.from(this.stars.values());
  }

  getStar(id: number) : Star{
    return this.stars.get(id);
  }

  getStarByName(name: string) : Star {
    const safeName = (name || '').toLowerCase();
    return this.getStars().find(star => star.name.toLowerCase() === safeName);
  }

  getPlayerStars(playerId: number) : Star[] {
    return this.getStars().filter(star => star.ownerId === playerId);
  }

  getOwnStars() : Star[] {
    return this.getPlayerStars(this.playerId);
  }

  getFleets() : Fleet[] {
    return Array.from(this.fleets.values());
  }

  getFleet(id: number): Fleet {
    return this.fleets.get(id);
  }

  getFleetsAtStar(star: Star, playerId?: number) : Fleet[] {
      const fleets = this.getFleets().filter(fleet => fleet.orbitingStarId === star.id);
      if (playerId) {
        return fleets.filter(fleet => fleet.ownerId === playerId);
      }
      return fleets;
  }
}