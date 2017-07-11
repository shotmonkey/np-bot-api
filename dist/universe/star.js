"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("./entity");
class Star extends entity_1.Entity {
    constructor(data) {
        super(data);
        this.ships = data.st;
    }
}
exports.Star = Star;
//# sourceMappingURL=star.js.map