import { Star, RawStarData } from './star';
import { Fleet, RawFleetData } from './fleet';
export interface RawUniverseData {
    player_uid: number;
    stars: {
        [key: string]: RawStarData;
    };
    fleets: {
        [key: string]: RawFleetData;
    };
}
export declare class Universe {
    rawData: RawUniverseData;
    playerId: number;
    stars: Map<string, Star>;
    fleets: Map<string, Fleet>;
    constructor(data: RawUniverseData);
    getStars(): Star[];
    getStar(id: string): Star;
    getStarByName(name: string): Star;
    getPlayerStars(playerId?: number): Star[];
    getOwnStars(): Star[];
    getFleets(): Fleet[];
    getFleetsAtStar(star: Star, playerId?: number): Fleet[];
}
