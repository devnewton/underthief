/// <reference path="../../typings/phaser.d.ts"/>
import { AbstractState } from "./AbstractState";
import { LevelConfig } from "./Level";
import { MenuButton } from "../ui/MenuButton";
import { MenuSelect, MenuSelectOption } from "../ui/MenuSelect";
import { UnderthiefGame } from "../UnderthiefGame";
import { ControllerType } from "../utils/Controls";

export class TeamSelectScreen extends AbstractState {

    constructor() {
        super();
    }

    preload() {
        MenuButton.preload(this.game);
        MenuSelect.preload(this.game);
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

        let playerOptions = [
            new MenuSelectOption<ControllerType>(ControllerType.CPU, 'CPU'),
            new MenuSelectOption<ControllerType>(ControllerType.KEYBOARD, 'Keyboard'),
            new MenuSelectOption<ControllerType>(ControllerType.PAD1, 'Pad 1'),
            new MenuSelectOption<ControllerType>(ControllerType.PAD2, 'Pad 2'),
            new MenuSelectOption<ControllerType>(ControllerType.PAD4, 'Pad 3'),
            new MenuSelectOption<ControllerType>(ControllerType.PAD4, 'Pad 4')
        ];

        let bettySelect = new MenuSelect<ControllerType>(this.game, 200, 150, playerOptions);
        let betty2Select = new MenuSelect<ControllerType>(this.game, 200, 250, playerOptions);
        let georgeSelect = new MenuSelect<ControllerType>(this.game, 200, 350, playerOptions);
        let george2Select = new MenuSelect<ControllerType>(this.game, 200, 450, playerOptions);

        switch (this.input.gamepad.padsConnected) {
            case 0:
                bettySelect.setSelectedValue(ControllerType.KEYBOARD);
                break;
            case 1:
                bettySelect.setSelectedValue(ControllerType.PAD1);
                break;
            case 2:
                bettySelect.setSelectedValue(ControllerType.PAD1);
                georgeSelect.setSelectedValue(ControllerType.PAD2);
                break;
            case 3:
                bettySelect.setSelectedValue(ControllerType.PAD1);
                betty2Select.setSelectedValue(ControllerType.PAD2);
                georgeSelect.setSelectedValue(ControllerType.PAD3);
                break;
            default:
                bettySelect.setSelectedValue(ControllerType.PAD1);
                betty2Select.setSelectedValue(ControllerType.PAD2);
                georgeSelect.setSelectedValue(ControllerType.PAD3);
                george2Select.setSelectedValue(ControllerType.PAD4);
                break;
        }
        new MenuButton(this.game, "Play", 200, 600, () => {
            let config = new LevelConfig();
            config.bettyController = bettySelect.getSelectedValue();
            config.betty2Controller = betty2Select.getSelectedValue();
                        config.georgeController = georgeSelect.getSelectedValue();
                        config.george2Controller = george2Select.getSelectedValue();
            this.game.state.start('Level', true, false, config)
        });
    }
}
