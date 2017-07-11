"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Entity {
    constructor(data) {
        this.id = data.uid;
        this.ownerId = data.puid;
        this.name = data.n;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=entity.js.map