export interface RawEntityData {
    uid: number;
    puid: number;
    n: string;
}
export declare abstract class Entity {
    id: number;
    ownerId: number;
    name: string;
    constructor(data: RawEntityData);
}
