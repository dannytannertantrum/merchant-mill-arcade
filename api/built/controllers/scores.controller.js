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
exports.updateScore = exports.getScores = exports.getScore = exports.deleteScore = exports.addScore = void 0;
var uuid_1 = require("uuid");
var scores_ts_1 = require("../../scores.ts");
var allScores = scores_ts_1.default;
var getScores = function (req, res) {
    res.send(scores_ts_1.default);
};
exports.getScores = getScores;
var getScore = function (req, res) {
    var id = req.params.id;
    var scoreToGet = scores_ts_1.default.find(function (score) { return score.id === id; });
    res.send(scoreToGet);
};
exports.getScore = getScore;
var addScore = function (req, res) {
    var _a = req.body, initials = _a.initials, score = _a.score, game = _a.game;
    var scoreToAdd = {
        id: (0, uuid_1.v4)(),
        initials: initials,
        score: score,
        game: game
    };
    allScores = __spreadArray(__spreadArray([], scores_ts_1.default, true), [scoreToAdd], false);
    res.code(201).send(scoreToAdd);
};
exports.addScore = addScore;
var deleteScore = function (req, res) {
    var id = req.params.id;
    allScores = allScores.filter(function (score) { return score.id !== id; });
    res.send({ message: "Score ".concat(id, " has been removed") });
};
exports.deleteScore = deleteScore;
var updateScore = function (req, res) {
    var id = req.params.id;
    var _a = req.body, initials = _a.initials, score = _a.score, game = _a.game;
    allScores = allScores.map(function (score) { return (score.id === id ? { id: id, initials: initials, score: score, game: game } : score); });
    var scoreToUpdate = allScores.find(function (game) { return game.id === id; });
    res.send(scoreToUpdate);
};
exports.updateScore = updateScore;
