import { Universe, Star, Fleet } from './universe';
export declare const ALL: symbol;
export default class NeptunesPrideApi {
    authToken: string;
    universeFilePath: string;
    gameId: string;
    universe: Universe;
    getAuthToken(username: string, password: string): Promise<string>;
    setGameId(gameId: string): void;
    sendOrder(order: any, updateUniverse?: boolean): Promise<Universe>;
    getUniverse(): Promise<Universe>;
    buildFleet(star: Star, ships?: number): Promise<Universe>;
    moveShipsToFleet(fleet: Fleet, ships: number): Promise<Universe>;
    moveAllShipsToStar(star: Star): Promise<Universe>;
    saveUniverse(): Promise<any>;
    getSavedUniverse(): Promise<Universe>;
    splitShipsToFleets(star: Star): Promise<Array<Universe>>;
}
