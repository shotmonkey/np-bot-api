"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require("isomorphic-fetch");
const setCookieParser = require("set-cookie-parser");
const path = require("path");
const fs = require("fs");
const util_1 = require("util");
const universe_1 = require("./universe");
const writeFileP = util_1.promisify(fs.writeFile);
const readFileP = util_1.promisify(fs.readFile);
const loginUrl = 'https://np.ironhelmet.com/arequest/login';
const ordersUrl = 'https://np.ironhelmet.com/trequest/order';
exports.ALL = Symbol('ALL');
function encodeFormData(data) {
    return Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');
}
function sum(...items) {
    return items.reduce((sum, item) => sum + item, 0);
}
class NeptunesPrideApi {
    getAuthToken(username, password) {
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
                password,
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
    setGameId(gameId) {
        console.log('setGameId');
        this.universeFilePath = path.join(__dirname, `universe.${gameId}.json`);
        this.gameId = gameId;
    }
    sendOrder(order, updateUniverse = false) {
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
                if (updateUniverse) {
                    this.universe = new universe_1.Universe(json.report);
                }
                ;
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
    getUniverse() {
        console.log('getUniverse');
        return this.sendOrder('full_universe_report', true);
    }
    buildFleet(star, ships = 1) {
        return this.sendOrder(`new_fleet,${star.uid},${ships}`);
    }
    moveShipsToFleet(fleet, ships) {
        return this.sendOrder(`ship_transfer,${fleet.uid},${fleet.st + ships}`);
    }
    moveAllShipsToStar(star) {
        return this.sendOrder(`gather_all_ships,${star.uid}`);
    }
    saveUniverse() {
        console.log('saveUniverse', this.universeFilePath);
        return writeFileP(this.universeFilePath, JSON.stringify(this.universe.rawData, null, 2));
    }
    getSavedUniverse() {
        console.log('getSavedUniverse');
        return readFileP(this.universeFilePath)
            .then(data => new universe_1.Universe(JSON.parse(data)));
    }
    splitShipsToFleets(star) {
        const fleets = this.universe.getFleetsAtStar(star);
        const shipsAtStar = star.st;
        const accurateShipsPerFleet = shipsAtStar / fleets.length;
        const shipsPerFleet = fleets.map(fleet => ({ fleet, shipsToMove: Math.floor(accurateShipsPerFleet) }));
        while (sum(...shipsPerFleet.map(spf => spf.shipsToMove)) < shipsAtStar) {
            shipsPerFleet[0].shipsToMove++;
        }
        return Promise.all(shipsPerFleet
            .filter(spf => spf.shipsToMove)
            .map(spf => this.moveShipsToFleet(spf.fleet, spf.shipsToMove)));
    }
}
exports.default = NeptunesPrideApi;
//# sourceMappingURL=api.js.map