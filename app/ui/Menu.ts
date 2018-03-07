/// <reference path="../../typings/phaser.d.ts"/>

import { MenuCursor } from "./MenuCursor";
import { MenuButton } from "./MenuButton";
import { MenuSelect, MenuSelectOption } from "./MenuSelect";

export class Menu extends Phaser.Group {
    buttons: Phaser.Group;
    constructor(game: Phaser.Game, enableCursor = true) {
        super(game);
        this.buttons = game.add.group();
        this.add(this.buttons);
        if(enableCursor) {
            const cursor = new MenuCursor(game, this.buttons);
            this.add(cursor);
        }
        game.add.existing(this);
    }

    button(label: string, x: number, y: number, callback: Function) {
        this.buttons.add(new MenuButton(this.game, label, x, y, callback));
    }

    select<T>(x: number, y: number, options: Array<MenuSelectOption<T>>): MenuSelect<T>  {
        const select = new MenuSelect(this.game, x, y, options);
        this.buttons.add(select);
        return select;
    }

    static preload(game: Phaser.Game) {
        game.load.atlasXML('menu-buttons', 'menu/buttons.png', 'menu/buttons.xml');
    }
}