/// <reference path="../../typings/phaser.d.ts"/>
import { AbstractState } from "./AbstractState";
import { UnderthiefGame } from "../UnderthiefGame";
import { Player } from "../entities/Player";
import { Team } from "../entities/Team";

import { Pathfinder } from "../ia/services/Pathfinder";
import { DamageResolver } from "../utils/DamageResolver";

import { ControllerType } from "../utils/Controls";

export class LevelConfig {
    bettyController: ControllerType;
    betty2Controller: ControllerType;
    georgeController: ControllerType;
    george2Controller: ControllerType;
}

export class Level extends AbstractState {

    config: LevelConfig;
    collisionSprites: Phaser.Group;
    pathfinder: Pathfinder;
    damageResolver: DamageResolver;
    leftTeam: Team;
    rightTeam: Team;

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

    init(config: LevelConfig) {
        this.config = config;
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

        this.collisionSprites = this.game.add.physicsGroup(Phaser.Physics.ARCADE);;
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

        this.pathfinder = new Pathfinder(map);

        let controllers = (this.game as UnderthiefGame).controllers;

        this.leftTeam = new Team(this.game);
        let betty = new Player(this.game, 'betty');
        betty.x = 256;
        betty.y = 320;
        betty.controls = controllers.getController(this.config.bettyController);
        this.leftTeam.add(betty);

        let betty2 = new Player(this.game, 'betty2');
        betty2.x = 256;
        betty2.y = 480;
        betty2.controls = controllers.getController(this.config.betty2Controller);
        this.leftTeam.add(betty2);

        this.rightTeam = new Team(this.game);
        let george = new Player(this.game, 'george');
        george.x = 1024;
        george.y = 320;
        george.controls = controllers.getController(this.config.georgeController);
        this.rightTeam.add(george);

        let george2 = new Player(this.game, 'george2');
        george2.x = 1024;
        george2.y = 480;
        george2.controls = controllers.getController(this.config.george2Controller);
        this.rightTeam.add(george2);
        /*        leftTeam.getAt(0).controls = (this.game as UnderthiefGame).controllers.getKeyboard();
        leftTeam.getAt(1).controls = (this.game as UnderthiefGame).controllers.getPad(1);
        leftTeam.getAt(2).controls = (this.game as UnderthiefGame).controllers.getPad(1);
        leftTeam.getAt(4).controls = (this.game as UnderthiefGame).controllers.getPad(1);
*/
    }

    update() {
        // this.pathfinder.update();
        this.game.physics.arcade.collide(this.leftTeam, this.collisionSprites);
        this.game.physics.arcade.collide(this.rightTeam, this.collisionSprites);

    }

    render() {
    }
}
