/// <reference path="../../typings/phaser.d.ts"/>
import { UnderthiefGame } from "../UnderthiefGame";
import { AbstractControls } from "../utils/Controls";
import { CollisionResolver } from "../utils/CollisionResolver";

export class Underwear extends Phaser.Sprite {

    constructor(game: Phaser.Game, key: string) {
        super(game, game.world.centerX, game.world.centerY, key);
        this.health = 3;
        (<UnderthiefGame>game).addSpriteAnimation(this, 'underwear.moving', 1);

        this.play("underwear.moving", 8, false);
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setCircle(32);
        this.body.collideWorldBounds = true;
        this.body.bounce.x = 0.8;
        this.body.bounce.y = 0.8;
    }

    static preload(game: Phaser.Game) {
        game.load.atlasXML('bra', 'sprites/devnewton/bra.png', 'sprites/devnewton/underwear.xml');
        game.load.atlasXML('boxers', 'sprites/devnewton/boxers.png', 'sprites/devnewton/underwear.xml');
    }
}

export class UnderwearCapturePoint extends Phaser.Sprite {
    containsUnderwear: boolean = false;

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.immovable = true;
    }
}

export class UnderwearCapturePoints extends Phaser.Group {
    constructor(game: Phaser.Game, map: Phaser.Tilemap, key: string) {
        super(game);
        for (let o of map.objects[key + '-capture-points']) {
            if (o.rectangle) {
                const capturePoint = new UnderwearCapturePoint(this.game, o.x, o.y);
                capturePoint.width = o.width;
                capturePoint.height = o.height;
                this.add(capturePoint);
            }
        }
    }

    areAllCaptured(): boolean {
        for(let c in this.children) {
            let child = <UnderwearCapturePoint> this.children[c];
            if(!child.containsUnderwear) {
                return false;
            }
        }
        return true;
    }
}

export class UnderwearCaptureCollisionResolver extends CollisionResolver {
    constructor(game: Phaser.Game) {
        super(game);
    }

    checkCollision(sa: Phaser.Sprite, sb: Phaser.Sprite) {
        let a = <Underwear>sa;
        let b = <UnderwearCapturePoint> sb;
        return !b.containsUnderwear && a.exists && b.exists && b.body.hitTest(a.centerX, a.centerY);
    }

    onCollide(sa: Phaser.Sprite, sb: Phaser.Sprite) {
        let a = <Underwear>sa;
        let b = <UnderwearCapturePoint> sb;
        a.body.enable = false;
        a.tint = 0xAADDAA;
        b.containsUnderwear = true;
    }
}