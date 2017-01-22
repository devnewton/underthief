/// <reference path="../../typings/phaser.d.ts"/>
import { UnderthiefGame } from "../UnderthiefGame";
import { AbstractControls } from "../utils/Controls";

interface PlayerState {
    update(player: Player);
}

class PlayerDashState implements PlayerState {

    dashSteps = 3;

    update(player: Player) {
        --this.dashSteps;
        if (this.dashSteps <= 0) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            if (this.dashSteps <= -10) {
                player.state = Player.RUNNING_STATE;
            }
        }
    }
}

class PlayerHammeredState implements PlayerState {

    steps = 60;

    update(player: Player) {
        this.steps--;
        if (this.steps <= 0) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            player.state = Player.RUNNING_STATE;
        } else {
            player.play("player.hammered", 8, false);
        }
    }
}

class PlayerRunningState implements PlayerState {
    update(player: Player) {
        player.hammerTime = false;
        if (!player.oldPos.equals(player.position)) {
            player.oldPos = player.position.clone();
        }
        if (player.controls) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            let dashAngle = player.controls.dashingAngle(player.body.center);
            if (null != dashAngle) {
                player.dash(dashAngle);
            } else if (player.controls.isHammerTime()) {
                player.hammerTime = true;
                player.play("player.hammertime", 8, false);
            } else {
                if (player.controls.isGoingLeft()) {
                    player.body.velocity.x = -300;
                } else if (player.controls.isGoingRight()) {
                    player.body.velocity.x = 300;
                }

                if (player.controls.isGoingUp()) {
                    player.body.velocity.y = -300;
                } else if (player.controls.isGoingDown()) {
                    player.body.velocity.y = 300;
                }

                if (player.body.velocity.y < 0) {
                    player.play("player.walk.back", 8, false);
                } else if (player.body.velocity.y > 0) {
                    player.play("player.walk.front", 8, false);
                } else if (player.body.velocity.x < 0) {
                    player.play("player.walk.left", 8, false);
                } else if (player.body.velocity.x > 0) {
                    player.play("player.walk.right", 8, false);
                } else {
                    player.play("player.wait", 8, false);
                }
            }
        }

    }
}


export class Player extends Phaser.Sprite {

    controls: AbstractControls;
    state: PlayerState;
    hammerTime = false;
    static RUNNING_STATE = new PlayerRunningState();

    constructor(game: Phaser.Game, key: string) {
        super(game, game.world.centerX, game.world.centerY, key);
        this.health = 3;
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.walk.back', 4);
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.walk.front', 4);
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.walk.left', 4);
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.walk.right', 4);
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.hammertime', 4);
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.hammered', 4);
        (<UnderthiefGame>game).addSpriteAnimation(this, 'player.wait', 1);

        this.play("player.wait", 8, false);
        this.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
        this.body.collideWorldBounds = true;
        this.game.add.existing(this);
        this.state = Player.RUNNING_STATE;
    }

    static preload(game: Phaser.Game) {
        game.load.atlasXML('betty', 'sprites/opengameart/betty.png', 'sprites/opengameart/player.xml');
        game.load.atlasXML('betty2', 'sprites/opengameart/betty2.png', 'sprites/opengameart/player.xml');
        game.load.atlasXML('george', 'sprites/opengameart/george.png', 'sprites/opengameart/player.xml');
        game.load.atlasXML('george2', 'sprites/opengameart/george2.png', 'sprites/opengameart/player.xml');
    }

    oldPos = new Phaser.Point(0, 0);

    update() {
        super.update()
        this.state.update(this);
    }

    dash(angle: number) {
        if (!(this.state instanceof PlayerDashState)) {
            this.state = new PlayerDashState();
            this.game.physics.arcade.velocityFromRotation(angle, 1200, this.body.velocity);
        }
    }

    hammer(other: Player) {
        if (!(other.state instanceof PlayerHammeredState)) {
            other.state = new PlayerHammeredState();
            let angle = Phaser.Math.angleBetweenPoints(this.body.center, other.body.center);
            this.game.physics.arcade.velocityFromRotation(angle, 300, other.body.velocity);
        }
    }
}