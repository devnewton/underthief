/// <reference path="../../typings/phaser.d.ts"/>
import { AbstractState } from "./AbstractState";
import { UnderthiefGame } from "../UnderthiefGame";
import { Player } from "../entities/Player";
import { Underwear, UnderwearCapturePoints, UnderwearCaptureCollisionResolver } from "../entities/Underwear";
import { Team, TeamCollisionResolver } from "../entities/Team";

import { Pathfinder } from "../ia/services/Pathfinder";

import { ControllerType, CPUControls } from "../utils/Controls";
import { CPU } from "../ia/CPU";

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
    leftTeam: Team;
    rightTeam: Team;
    braGroup: Phaser.Group;
    boxersGroup: Phaser.Group;
    teamCollisionResolver: TeamCollisionResolver;
    braCapturePoints: UnderwearCapturePoints;
    boxersCapturePoints: UnderwearCapturePoints;
    underwearCaptureCollisionResolver: UnderwearCaptureCollisionResolver;
    cpus = [];

    constructor() {
        super();
    }

    preload() {
        Player.preload(this.game);
        Underwear.preload(this.game);
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

        this.collisionSprites = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        for (let o of map.objects['collision']) {
            if(o.name === 'world-bounds' ) {
                this.game.physics.arcade.setBounds(o.x, o.y, o.width, o.height);
            } else if (o.rectangle) {
                const sprite = this.game.add.sprite(o.x, o.y);
                this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
                sprite.body.immovable = true;
                sprite.width = o.width;
                sprite.height = o.height;
                this.collisionSprites.add(sprite);
            }
        }

        this.braCapturePoints = new UnderwearCapturePoints(this.game, map, 'bra');
        this.boxersCapturePoints = new UnderwearCapturePoints(this.game, map, 'boxers');
        this.underwearCaptureCollisionResolver = new UnderwearCaptureCollisionResolver(this.game);

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

        this.braGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

        let bra1 = new Underwear(this.game, 'bra');
        bra1.x = 512;
        bra1.y = 240;
        this.braGroup.add(bra1);

        let bra2 = new Underwear(this.game, 'bra');
        bra2.x = 512;
        bra2.y = 400;
        this.braGroup.add(bra2);

        let bra3 = new Underwear(this.game, 'bra');
        bra3.x = 512;
        bra3.y = 560;
        this.braGroup.add(bra3);

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

        this.boxersGroup = this.game.add.physicsGroup(Phaser.Physics.ARCADE);

        let boxers1 = new Underwear(this.game, 'boxers');
        boxers1.x = 768;
        boxers1.y = 240;
        this.boxersGroup.add(boxers1);

        let boxers2 = new Underwear(this.game, 'boxers');
        boxers2.x = 768;
        boxers2.y = 400;
        this.boxersGroup.add(boxers2);

        let boxers3 = new Underwear(this.game, 'boxers');
        boxers3.x = 768;
        boxers3.y = 560;
        this.boxersGroup.add(boxers3);

        this.teamCollisionResolver = new TeamCollisionResolver(this.game);

        this.leftTeam.forEachAlive((player) => {
            if(player.controls instanceof CPUControls) {
                let cpu = new CPU();
                cpu.me = player;
                cpu.controls = player.controls;
                cpu.capturePoints = this.braCapturePoints;
                cpu.underwears = this.braGroup;
                this.cpus.push(cpu);
            }
        }, null);
    }

    isNotFirstFrame = false;

    update() {
        if (this.isNotFirstFrame) {
            // this.pathfinder.update();
            this.teamCollisionResolver.groupVersusGroup(this.leftTeam, this.rightTeam);
            this.underwearCaptureCollisionResolver.groupVersusGroup(this.braGroup, this.braCapturePoints);
            this.underwearCaptureCollisionResolver.groupVersusGroup(this.boxersGroup, this.boxersCapturePoints);
            this.game.physics.arcade.collide(this.braGroup);
            this.game.physics.arcade.collide(this.boxersGroup);
            this.game.physics.arcade.collide(this.braGroup, this.boxersGroup);
            this.game.physics.arcade.collide(this.braGroup, this.leftTeam);
            this.game.physics.arcade.collide(this.boxersGroup, this.leftTeam);
            this.game.physics.arcade.collide(this.braGroup, this.rightTeam);
            this.game.physics.arcade.collide(this.boxersGroup, this.rightTeam);
            this.game.physics.arcade.collide(this.leftTeam, this.collisionSprites);
            this.game.physics.arcade.collide(this.rightTeam, this.collisionSprites);
            this.game.physics.arcade.collide(this.braGroup, this.collisionSprites);
            this.game.physics.arcade.collide(this.boxersGroup, this.collisionSprites);

            this.cpus.forEach( c => c.think() );
        } else {
            this.isNotFirstFrame = true;
        }

    }

    render() {
    }
}
