"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGame = exports.getGames = exports.getGame = exports.deleteGame = exports.addGame = void 0;
var uuid_1 = require("uuid");
var games_ts_1 = require("../../games.ts");
var allGames = games_ts_1.default;
var getGames = function (req, res) {
    res.send(games_ts_1.default);
};
exports.getGames = getGames;
var getGame = function (req, res) {
    var id = req.params.id;
    var game = games_ts_1.default.find(function (game) { return game.id === id; });
    res.send(game);
};
exports.getGame = getGame;
var addGame = function (req, res) {
    var _a = req.body, title = _a.title, description = _a.description;
    var game = {
        id: (0, uuid_1.v4)(),
        title: title,
        description: description
    };
    allGames = __spreadArray(__spreadArray([], games_ts_1.default, true), [game], false);
    res.code(201).send(game);
};
exports.addGame = addGame;
var deleteGame = function (req, res) {
    var id = req.params.id;
    allGames = allGames.filter(function (game) { return game.id !== id; });
    res.send({ message: "Game ".concat(id, " has been removed") });
};
exports.deleteGame = deleteGame;
var updateGame = function (req, res) {
    var id = req.params.id;
    var _a = req.body, title = _a.title, description = _a.description;
    allGames = allGames.map(function (game) { return (game.id === id ? { id: id, title: title, description: description } : game); });
    var gameToUpdate = allGames.find(function (game) { return game.id === id; });
    res.send(gameToUpdate);
};
exports.updateGame = updateGame;
