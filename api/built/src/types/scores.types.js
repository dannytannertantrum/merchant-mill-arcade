"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreSchema = exports.AllScoresSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var AllScoresSchema = typebox_1.Type.Array(typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    initials: typebox_1.Type.String(),
    score: typebox_1.Type.Integer(),
    game: typebox_1.Type.String()
}));
exports.AllScoresSchema = AllScoresSchema;
var ScoreSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    initials: typebox_1.Type.String(),
    score: typebox_1.Type.Integer(),
    game: typebox_1.Type.String()
});
exports.ScoreSchema = ScoreSchema;
