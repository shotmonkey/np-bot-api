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
            const fleet = data.fleets[fid];
            this.fleets.set(fleet.uid, new fleet_1.Fleet(fleet));
        });
        this.stars = new Map();
        Object.keys(data.stars)
            .forEach(sid => {
            const star = data.stars[sid];
            this.stars.set(star.uid, new star_1.Star(star));
        });
    }
    getStars() {
        return Array.from(this.stars.values());
    }
    getStar(id) {
        return this.stars.get(id);
    }
    getStarByName(name) {
        const safeName = (name || '').toLowerCase();
        return this.getStars().find(star => star.name.toLowerCase() === safeName);
    }
    getPlayerStars(playerId) {
        return this.getStars().filter(star => star.ownerId === playerId);
    }
    getOwnStars() {
        return this.getPlayerStars(this.playerId);
    }
    getFleets() {
        return Array.from(this.fleets.values());
    }
    getFleet(id) {
        return this.fleets.get(id);
    }
    getFleetsAtStar(star, playerId) {
        const fleets = this.getFleets().filter(fleet => fleet.orbitingStarId === star.id);
        if (playerId) {
            return fleets.filter(fleet => fleet.ownerId === playerId);
        }
        return fleets;
    }
}
exports.Universe = Universe;
//# sourceMappingURL=universe.js.map