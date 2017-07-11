"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const star_1 = require("./star");
const fleet_1 = require("./fleet");
class Universe {
    constructor(data) {
        this.rawData = data;
        this.playerId = data.player_uid;
        this.fleets = new Map();
        Object.keys(data.fleets)
            .forEach(fid => {
            this.fleets.set(fid, new fleet_1.Fleet(data.fleets[fid]));
        });
        this.stars = new Map();
        Object.keys(data.stars)
            .forEach(sid => {
            this.stars.set(sid, new star_1.Star(data.stars[sid]));
        });
    }
    getStars() {
        return Array.from(this.stars.values());
    }
    getStar(id) {
        const star = this.stars[id];
        if (!star) {
            throw Error(`Could not get star by ID: ${id}`);
        }
        return star;
    }
    getStarByName(name) {
        const safeName = (name || '').toLowerCase();
        return this.getStars().find(star => star.name.toLowerCase() === safeName);
    }
    getPlayerStars(playerId = this.playerId) {
        return this.getStars().filter(star => star.ownerId === playerId);
    }
    getOwnStars() {
        return this.getPlayerStars(this.playerId);
    }
    getFleets() {
        return Array.from(this.fleets.values());
    }
    getFleetsAtStar(star, playerId = this.playerId) {
        return this.getFleets().filter(fleet => fleet.orbitingStarId = star.id);
    }
}
exports.Universe = Universe;
//# sourceMappingURL=universe.js.map