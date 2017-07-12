import { Universe, Star, Fleet } from './universe';
export declare const ALL: symbol;
export default class NeptunesPrideApi {
    authToken: string;
    universeFilePath: string;
    gameId: string;
    universe: Universe;
    orderQueue: Promise<Universe>;
    getAuthToken(username: string, password: string): Promise<string>;
    setGameId(gameId: string): void;
    handleOrderResponse(res: any): void;
    queueOrder(orderFunc: () => Promise<Universe>): Promise<Universe>;
    sendOrder(order: string): Promise<Universe>;
    getUniverse(): Promise<Universe>;
    getTotalShips(star: Star, playerId?: number): any;
    buildFleet(star: Star, ships?: number): Promise<Universe>;
    moveShipsToFleet(fleet: Fleet, totalShips: number): Promise<Universe>;
    moveAllShipsToStar(star: Star): Promise<Universe>;
    saveUniverse(): Promise<any>;
    getSavedUniverse(): Promise<Universe>;
    splitShipsToFleets(star: Star): Promise<Array<Universe>>;
}
