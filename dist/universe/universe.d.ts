import { Star } from './star';
import { Fleet } from './fleet';
export declare class Universe {
    rawData: any;
    player_uid: number;
    stars: Map<string, Star>;
    fleets: Map<string, Fleet>;
    constructor(data: any);
    starsAsArray(): Star[];
    getStar(id: any): Star;
    getStarByName(name: any): Star;
    getPlayerStars(playerId: any): Star[];
    getOwnStars(): Star[];
    fleetsAsArray(): Fleet[];
    getFleetsAtStar(star: Star): Fleet[];
}
