"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Universe {
    constructor(data) {
        this.rawData = data;
        this.player_uid = data.player_uid;
        this.stars = data.stars;
        this.fleets = data.fleets;
    }
    starsAsArray() {
        return Object.keys(this.stars)
            .map(id => this.stars[id]);
    }
    getStar(id) {
        const star = this.stars[id];
        if (!star) {
            throw Error(`Could not get star by ID: ${id}`);
        }
        return star;
    }
    getStarByName(name) {
        const cleanName = (name || '').toLowerCase();
        return this.starsAsArray().find(star => star.n.toLowerCase() === cleanName);
    }
    getPlayerStars(playerId) {
        return this.starsAsArray().filter(star => star.puid === playerId);
    }
    getOwnStars() {
        return this.getPlayerStars(this.player_uid);
    }
    fleetsAsArray() {
        return Object.keys(this.fleets)
            .map(id => this.fleets[id]);
    }
    getFleetsAtStar(star) {
        return this.fleetsAsArray().filter(fleet => fleet.ouid === star.uid);
    }
}
exports.Universe = Universe;
//# sourceMappingURL=universe.js.map