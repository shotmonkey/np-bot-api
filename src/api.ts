declare var __dirname;

import * as fetch from  'isomorphic-fetch';
import * as setCookieParser from 'set-cookie-parser';
import * as path from 'path';
import * as fs from 'fs';
import { promisify } from 'util';

import { Universe, Star, Fleet } from './universe';

const writeFileP = promisify(fs.writeFile);
const readFileP = promisify(fs.readFile);

const loginUrl = 'https://np.ironhelmet.com/arequest/login';
const ordersUrl = 'https://np.ironhelmet.com/trequest/order';

export const ALL = Symbol('ALL');

function encodeFormData(data) {
  return Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

function sum(...items) {
  return items.reduce((sum, item) => sum + item, 0);
}

export default class NeptunesPrideApi {

  authToken: string;
  universeFilePath: string;
  gameId: string;
  universe: Universe;

  getAuthToken(username: string, password: string) : Promise<string> {
    console.log('getAuthToken');
    return fetch(loginUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/javascript, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      body: encodeFormData({
        type: 'login',
        alias: username,
        password
      }),
    })
    .then((res) => {
      // eslint-disable-next-line no-underscore-dangle
      const setCookieHeader = res.headers._headers['set-cookie'];
      if (setCookieHeader) {
        const cookies = setCookieParser.parse(setCookieHeader);
        const authCookie = cookies.find(c => c.name === 'auth');
        if (authCookie) {
          console.log('auth:', authCookie.value);
          this.authToken = authCookie.value;
          return authCookie.value;
        }
      }
      throw Error('No auth cookie received');
    });
  }

  setGameId(gameId: string) {
    console.log('setGameId');
    this.universeFilePath = path.join(__dirname, `universe.${gameId}.json`);
    this.gameId = gameId;
  }

  sendOrder(order, updateUniverse : boolean = false) : Promise<Universe> {
    console.log('sendOrder', order);

    const authToken = this.authToken;
    if (!authToken) {
      throw Error('Auth token required, call getAuthToken first');
    }

    const gameId = this.gameId;
    if (!gameId) {
      throw Error('Game ID required, call setGameId first');
    }

    return fetch(ordersUrl, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json, text/javascript, */*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        cookie: `auth=${authToken}`,
      },
      body: encodeFormData({
        type: 'order',
        order,
        version: '',
        game_number: gameId,
      }),
    })
    .then(res => {
      return res.json()
        .then((json) => {
          if (updateUniverse) { this.universe = new Universe(json.report) };
          return this.universe;
        })
        .catch(err => {
          console.error(err);
          return res.blob()
            .then(blob => {
              console.error(blob);
              throw Error(err);
            });
        });
    });
  }

  getUniverse() : Promise<Universe> {
    console.log('getUniverse');
    return this.sendOrder('full_universe_report', true);
  }

  getTotalShips(star: Star, playerId: number = this.universe.playerId) {
    const starShips = star.ownerId === playerId ? star.ships : 0;
    return starShips + sum(this.universe.getFleetsAtStar(star).map(fleet => fleet.ships));
  }

  buildFleet(star: Star, ships: number = 1) : Promise<Universe> {
    return this.sendOrder(`new_fleet,${star.id},${ships}`);
  }

  moveShipsToFleet(fleet: Fleet, totalShips: number) : Promise<Universe> {
    return this.sendOrder(`ship_transfer,${fleet.id},${totalShips}`);
  }

  moveAllShipsToStar(star: Star) : Promise<Universe> {
    return this.sendOrder(`gather_all_ships,${star.id}`);
  }

  saveUniverse() : Promise<any> {
    console.log('saveUniverse', this.universeFilePath);
    return writeFileP(this.universeFilePath, JSON.stringify(this.universe.rawData, null, 2));
  }

  getSavedUniverse() : Promise<Universe> {
    console.log('getSavedUniverse');
    return readFileP(this.universeFilePath)
      .then(data => new Universe(JSON.parse(data)));
  }

  splitShipsToFleets(star: Star) : Promise<Array<Universe>> {

    const fleets = this.universe.getFleetsAtStar(star);
    const shipsAtStar = this.getTotalShips(star);

    const accurateShipsPerFleet = shipsAtStar / fleets.length;
    const shipsPerFleet = fleets.map(fleet => ({ fleet, shipsToMove: Math.floor(accurateShipsPerFleet) }));

    while(sum(...shipsPerFleet.map(spf => spf.shipsToMove)) < shipsAtStar) {
      shipsPerFleet[0].shipsToMove++;
    }

    return Promise.all(
        shipsPerFleet
          .filter(spf => spf.shipsToMove)
          .map(spf => this.moveShipsToFleet(spf.fleet, spf.shipsToMove))
      );
  }

}
