/// <reference path="../../typings/phaser.d.ts"/>
import { UnderthiefGame } from "../UnderthiefGame";
import { AbstractControls } from "../utils/Controls";

export class Player extends Phaser.Sprite {

    controls: AbstractControls;

    constructor(game: Phaser.Game) {
        super(game, game.world.centerX, game.world.centerY, 'betty');
        this.health = 3;
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.walk.back', 4);
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.walk.front', 4);
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.walk.left', 4);
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.walk.right', 4);
        this.play("player.walk.front", 0, false);
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.setSize(16, 16, 24, 48);
        this.body.collideWorldBounds = true;
        this.game.add.existing(this);
    }

    static preload(game: Phaser.Game) {
        game.load.atlasXML('betty', 'sprites/opengameart/betty.png', 'sprites/opengameart/player.xml');
        game.load.atlasXML('bullets', 'sprites/devnewton/bullets.png', 'sprites/devnewton/bullets.xml');
    }

    update() {
        super.update();

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
                this.play("player.walk.front", 0, false);
            }
        }
    }
}