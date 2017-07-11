"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("./entity");
class Fleet extends entity_1.Entity {
    constructor(data) {
        super(data);
        this.ships = data.st;
        this.orbitingStarId = data.ouid;
    }
}
exports.Fleet = Fleet;
//# sourceMappingURL=fleet.js.map