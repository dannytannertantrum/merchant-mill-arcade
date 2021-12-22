"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreSchema = exports.GameSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var ScoreSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    initials: typebox_1.Type.String(),
    score: typebox_1.Type.Integer(),
    game: typebox_1.Type.String()
});
exports.ScoreSchema = ScoreSchema;
var GameSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    title: typebox_1.Type.String(),
    description: typebox_1.Type.String()
});
exports.GameSchema = GameSchema;
