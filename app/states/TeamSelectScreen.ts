/// <reference path="../../typings/phaser.d.ts"/>
import { AbstractState } from "./AbstractState";
import { LevelConfig } from "./Level";
import { Menu } from "../ui/Menu";
import { MenuSelect, MenuSelectOption } from "../ui/MenuSelect";
import { UnderthiefGame } from "../UnderthiefGame";
import { ControllerType } from "../utils/Controls";

export class TeamSelectScreen extends AbstractState {

    bettySelect: MenuSelect<ControllerType>;
    betty2Select: MenuSelect<ControllerType>;
    georgeSelect: MenuSelect<ControllerType>;
    george2Select: MenuSelect<ControllerType>;

    constructor() {
        super();
    }

    preload() {
        Menu.preload(this.game);
        this.game.load.atlasXML('betty', 'sprites/opengameart/betty.png', 'sprites/opengameart/player.xml');
        this.game.load.atlasXML('betty2', 'sprites/opengameart/betty2.png', 'sprites/opengameart/player.xml');
        this.game.load.atlasXML('george', 'sprites/opengameart/george.png', 'sprites/opengameart/player.xml');
        this.game.load.atlasXML('george2', 'sprites/opengameart/george2.png', 'sprites/opengameart/player.xml');

    }

    create() {
        super.create();
        let logo = this.game.add.text(this.game.world.centerX, 0, 'Team selection', { font: "64px monospace", fill: 'white' });
        logo.scale.x = 2;
        logo.scale.y = 2;
        logo.anchor.setTo(0.5, 0);

        let betty = this.add.sprite(150, 175, 'betty', 0);
        (<UnderthiefGame>this.game).addSpriteAnimation(betty, 'player.wait', 1);
        betty.play('player.wait', 8, true);

        let betty2 = this.add.sprite(150, 275, 'betty2', 0);
        (<UnderthiefGame>this.game).addSpriteAnimation(betty2, 'player.wait', 1);
        betty2.play('player.wait', 8, true);

        let george = this.add.sprite(1060, 375, 'george', 0);
        (<UnderthiefGame>this.game).addSpriteAnimation(george, 'player.wait', 1);
        george.play('player.wait', 8, true);

        let george2 = this.add.sprite(1060, 475, 'george2', 0);
        (<UnderthiefGame>this.game).addSpriteAnimation(george2, 'player.wait', 1);
        george2.play('player.wait', 8, true);

        const menu = new Menu(this.game);

        let playerOptions = [
            new MenuSelectOption<ControllerType>(ControllerType.CPU, 'CPU'),
            new MenuSelectOption<ControllerType>(ControllerType.KEYBOARD, 'Keyboard'),
            new MenuSelectOption<ControllerType>(ControllerType.PAD1, 'Pad 1'),
            new MenuSelectOption<ControllerType>(ControllerType.PAD2, 'Pad 2'),
            new MenuSelectOption<ControllerType>(ControllerType.PAD3, 'Pad 3'),
            new MenuSelectOption<ControllerType>(ControllerType.PAD4, 'Pad 4')
        ];

        this.bettySelect = menu.select(200, 150, playerOptions);
        this.betty2Select = menu.select(200, 250, playerOptions);
        this.georgeSelect = menu.select(200, 350, playerOptions);
        this.george2Select = menu.select(200, 450, playerOptions);

        this.autoSelect();
        menu.button("Play", 200, 600, () => {
            let config = new LevelConfig();
            config.bettyController = this.bettySelect.getSelectedValue();
            config.betty2Controller = this.betty2Select.getSelectedValue();
            config.georgeController = this.georgeSelect.getSelectedValue();
            config.george2Controller = this.george2Select.getSelectedValue();
            this.game.state.start('Level', true, false, config)
        });

        this.input.gamepad.onConnectCallback = this.input.gamepad.onDisconnectCallback = () => this.autoSelect();
    }

    shutdown() {
        this.input.gamepad.onConnectCallback = this.input.gamepad.onDisconnectCallback = null;
    }

    autoSelect() {
        switch (this.input.gamepad.padsConnected) {
            case 0:
                this.bettySelect.setSelectedValue(ControllerType.KEYBOARD);
                this.betty2Select.setSelectedValue(ControllerType.CPU);
                this.georgeSelect.setSelectedValue(ControllerType.CPU);
                this.george2Select.setSelectedValue(ControllerType.CPU);
                break;
            case 1:
                this.bettySelect.setSelectedValue(ControllerType.PAD1);
                this.betty2Select.setSelectedValue(ControllerType.CPU);
                this.georgeSelect.setSelectedValue(ControllerType.CPU);
                this.george2Select.setSelectedValue(ControllerType.CPU);
                break;
            case 2:
                this.bettySelect.setSelectedValue(ControllerType.PAD1);
                this.betty2Select.setSelectedValue(ControllerType.CPU);
                this.georgeSelect.setSelectedValue(ControllerType.PAD2);
                this.george2Select.setSelectedValue(ControllerType.CPU);
                break;
            case 3:
                this.bettySelect.setSelectedValue(ControllerType.PAD1);
                this.betty2Select.setSelectedValue(ControllerType.PAD2);
                this.georgeSelect.setSelectedValue(ControllerType.PAD3);
                this.george2Select.setSelectedValue(ControllerType.CPU);
                break;
            default:
                this.bettySelect.setSelectedValue(ControllerType.PAD1);
                this.betty2Select.setSelectedValue(ControllerType.PAD2);
                this.georgeSelect.setSelectedValue(ControllerType.PAD3);
                this.george2Select.setSelectedValue(ControllerType.PAD4);
                break;
        }
    }
}
