/// <reference path="../../typings/phaser.d.ts"/>
import { AbstractState } from "./AbstractState";
import { UnderthiefGame } from "../UnderthiefGame";
import { Player } from "../entities/Player";

import { Pathfinder } from "../ia/services/Pathfinder";
import { DamageResolver } from "../utils/DamageResolver";

export class Level extends AbstractState {

    player: Player;
    collisionSprites: Phaser.Group;
    pathfinder: Pathfinder;
    damageResolver: DamageResolver;

    constructor() {
        super();
    }

    preload() {
        Player.preload(this.game);
        this.game.load.tilemap('map', 'levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('interior', 'sprites/opengameart/LPC_house_interior/interior.png');
        this.game.load.image('arabic1', 'sprites/opengameart/arabic_set/arabic1.png');
        this.game.load.image('house_inside', 'sprites/opengameart/house_inside.png');
        this.game.load.image('misc', 'sprites/opengameart/misc.png');
    }

    create() {
        super.create();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        const map = this.game.add.tilemap('map');
        map.addTilesetImage('interior');
        map.addTilesetImage('arabic1');
        map.addTilesetImage('house_inside');
        map.addTilesetImage('misc');

        const layer = map.createLayer('ground');
        map.createLayer('doors_and_furnitures');
        layer.resizeWorld();

        this.damageResolver = new DamageResolver(this.game);

        /*this.collisionSprites = this.game.add.physicsGroup(Phaser.Physics.ARCADE);;
        for (let o of map.objects['collision']) {
            if (o.rectangle) {
                const sprite = this.game.add.sprite(o.x, o.y);
                this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
                sprite.body.immovable = true;
                sprite.width = o.width;
                sprite.height = o.height;
                this.collisionSprites.add(sprite);
            }
        }

        this.pathfinder = new Pathfinder(map);*/

        this.player = new Player(this.game);
        this.player.controls = (this.game as UnderthiefGame).controllers.getKeyboard();
    }

    update() {
        // this.pathfinder.update();
        this.game.physics.arcade.collide(this.player, this.collisionSprites);

    }

    render() {
    }
}
