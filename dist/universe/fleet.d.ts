import { Entity, RawEntityData } from './entity';
export interface RawFleetData extends RawEntityData {
    st: number;
    ouid: number;
}
export declare class Fleet extends Entity {
    ships: number;
    orbitingStarId: number;
    constructor(data: RawFleetData);
}
