/// <reference path="../../typings/phaser.d.ts"/>
import { Player } from "./Player";
import { CollisionResolver } from "../utils/CollisionResolver";

export class Team extends Phaser.Group {
    constructor(game: Phaser.Game) {
        super(game);
    }
}

export class TeamCollisionResolver extends CollisionResolver {
    constructor(game: Phaser.Game) {
        super(game);
    }

    onCollide(sa: Phaser.Sprite, sb: Phaser.Sprite) {
        let a = <Player>sa;
        let b = <Player>sb;
        if (a.hammerTime) {
            a.hammer(b);
        }
        if (b.hammerTime) {
            b.hammer(a);
        }
    }
}