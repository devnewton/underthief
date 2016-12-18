/// <reference path="../../typings/phaser.d.ts"/>
import { UnderthiefGame } from "../UnderthiefGame";
import { AbstractControls } from "../utils/Controls";

export class Player extends Phaser.Sprite {

    controls: AbstractControls;

    constructor(game: Phaser.Game, key: string) {
        super(game, game.world.centerX, game.world.centerY, key);
        this.health = 3;
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.walk.back', 4);
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.walk.front', 4);
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.walk.left', 4);
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.walk.right', 4);
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.wait', 1);

        this.play("player.wait", 8, false);
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.game.add.existing(this);
    }

    static preload(game: Phaser.Game) {
        game.load.atlasXML('betty', 'sprites/opengameart/betty.png', 'sprites/opengameart/player.xml');
        game.load.atlasXML('betty2', 'sprites/opengameart/betty2.png', 'sprites/opengameart/player.xml');
        game.load.atlasXML('george', 'sprites/opengameart/george.png', 'sprites/opengameart/player.xml');
        game.load.atlasXML('george2', 'sprites/opengameart/george2.png', 'sprites/opengameart/player.xml');
    }

    oldPos = new Phaser.Point(0, 0);

    update() {
        super.update();

        if (!this.oldPos.equals(this.position)) {
            console.log(this.position);
            this.oldPos = this.position.clone();
        }
        if (this.controls) {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;

            if (this.controls.isGoingLeft()) {
                this.body.velocity.x = -300;
            } else if (this.controls.isGoingRight()) {
                this.body.velocity.x = 300;
            }

            if (this.controls.isGoingUp()) {
                this.body.velocity.y = -300;
            } else if (this.controls.isGoingDown()) {
                this.body.velocity.y = 300;
            }

            if (this.body.velocity.y < 0) {
                this.play("player.walk.back", 8, false);
            } else if (this.body.velocity.y > 0) {
                this.play("player.walk.front", 8, false);
            } else if (this.body.velocity.x < 0) {
                this.play("player.walk.left", 8, false);
            } else if (this.body.velocity.x > 0) {
                this.play("player.walk.right", 8, false);
            } else {
                this.play("player.wait", 8, false);
            }
        }
    }
}