"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSchema = exports.AllGamesSchema = void 0;
var typebox_1 = require("@sinclair/typebox");
var AllGamesSchema = typebox_1.Type.Array(typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    title: typebox_1.Type.String(),
    description: typebox_1.Type.String()
}));
exports.AllGamesSchema = AllGamesSchema;
var GameSchema = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    title: typebox_1.Type.String(),
    description: typebox_1.Type.String()
});
exports.GameSchema = GameSchema;
