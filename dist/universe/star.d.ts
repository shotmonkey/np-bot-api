import { Entity, RawEntityData } from './entity';
export interface RawStarData extends RawEntityData {
    st: number;
}
export declare class Star extends Entity {
    ships: number;
    constructor(data: RawStarData);
}
