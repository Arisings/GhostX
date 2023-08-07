/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from './config.js'
import RenderLib from "../RenderLib/index";
import { getTargetBlock } from "./utils/getTargetBlock";
import { placeAirGhostBlock } from "./utils/placeAirGhostBlock";
import { placeGhostBlock } from "./utils/placeGhostBlock";

const toggleDisplay = new Display();
toggleDisplay.setRenderLoc(1, 1)
toggleDisplay.addLine(new DisplayLine("&9Ghost Mode &8> &aEnabled").setShadow(true));
toggleDisplay.hide()

let ghostMode = false;

// Ghost action delay variables
let lastPlaceTime;
let lastBreakTime;

function notify(msg, res) {
    if (res) {
        ChatLib.clearChat(5050);
        new Message("§8[§9GhostX§8] " + msg).setChatLineId(5050).chat();
    } else {
        ChatLib.chat("§8[§9GhostX§8] " + msg)
    }
}

function toggle() {
    if (ghostMode) {
        ghostMode = false
        notify("&7Ghost Mode &cDisabled", true)
        if (Settings.toggleDisplay) toggleDisplay.hide()
    } else {
        ghostMode = true
        notify("&7Ghost Mode &aEnabled", true)
        if (Settings.toggleDisplay) toggleDisplay.show()
    }
}

register('renderWorld', () => {
    if (!Settings.toggleDisplay && toggleDisplay.getShouldRender()) toggleDisplay.hide()
    if (Settings.toggleDisplay && !toggleDisplay.getShouldRender() && ghostMode) toggleDisplay.show()
    if (ghostMode && Settings.selectedBlockIndicator) {
        const pos = getTargetBlock(false, Settings.useRayTracing)
        if (!pos) return
        RenderLib.drawInnerEspBox(pos[0] + 0.5, pos[1], pos[2] + 0.5, 1, 1, 255, 0, 0, 0.2, true)
    }
})

// Deleting/placing blocks clientside (ghost blocking)
const placeAirGhostBlockHotkey = new KeyBind("Remove Block Clientside", Keyboard.KEY_X, "GhostX")
const placeGhostBlockHotkey = new KeyBind("Place Ghost Block", Keyboard.KEY_P, "GhostX")


placeAirGhostBlockHotkey.registerKeyDown(() => {
    if (ghostMode) {
        // Cooldown
        let time = Date.now()
        if (time - lastBreakTime < Settings.ghostBreakDelay) return
        lastBreakTime = Date.now()

        const pos = getTargetBlock(false, Settings.useRayTracing)
        if (!pos) return

        placeAirGhostBlock(pos[0], pos[1], pos[2])
        if (Settings.actionSound) World.playSound("random.wood_click", 1, 1);
        notify(`&7Removed block at &b${pos[0]}&7, &b${pos[1]}&7, &b${pos[2]}&7.`, true)
    }
})

placeGhostBlockHotkey.registerKeyDown(() => {
    if (ghostMode) {
        // Cooldown
        let time = Date.now()
        if (time - lastPlaceTime < Settings.ghostPlaceDelay) return
        lastPlaceTime = Date.now()

        const pos = getTargetBlock(true, Settings.useRayTracing)
        if (!pos) return

        if (Settings.preventSelfPlace && ((Math.floor(Player.getX()) === pos[0] && Math.floor(Player.getY()) === pos[1] && Math.floor(Player.getZ()) === pos[2]) || (Math.floor(Player.getX()) === pos[0] && (Math.floor(Player.getY()) + 1) === pos[1] && Math.floor(Player.getZ()) === pos[2]))) return  // preventSelfPlace function

        placeGhostBlock(Settings.blockType, pos[0], pos[1], pos[2])
        if (Settings.actionSound) World.playSound("random.wood_click", 1, 1);
        notify(`&7Placed block at &b${pos[0]}&7, &b${pos[1]}&7, &b${pos[2]}&7.`, true)
    }
})

placeAirGhostBlockHotkey.registerKeyRelease(() => {
    lastBreakTime = undefined;
})

placeGhostBlockHotkey.registerKeyRelease(() => {
    lastPlaceTime = undefined;
})

const toggleGhostDelete = new KeyBind("Toggle Ghost Mode", Keyboard.KEY_G, "GhostX")
toggleGhostDelete.registerKeyPress(() => {
    toggle()
})

register('command', (...params) => {
    let mode = params[0]?.toLowerCase()
    if (mode === "config") {
        Settings.openGUI()
    } else if (mode === "setblock") {
        if (params.length < 4) return notify("&cInvalid Usage: /ghostx setblock <x> <y> <z> <type>")
        let x = parseInt(params[1])
        let y = parseInt(params[2])
        let z = parseInt(params[3])

        if (isNaN(x)) return notify(`&cError: the given X value "${params[1]}" is not a number!`)
        if (isNaN(y)) return notify(`&cError: the given Y value "${params[2]}" is not a number!`)
        if (isNaN(z)) return notify(`&cError: the given Z value "${params[3]}" is not a number!`)

        let type;
        if (params[4]) {
            if (net.minecraft.block.Block.func_149684_b(params[4])) {
                type = params[4]
            } else {
                return notify(`&cNo such block type "${params[4]}" exists!`, false)
            }
        } else { type = Settings.blockType }

        placeGhostBlock(type, x, y, z, false)

        if (Settings.actionSound) World.playSound("random.wood_click", 1, 1);
        notify(`&7Set the block at &b${x}&7, &b${y}&7, &b${z}&7 to &b${new BlockType(net.minecraft.block.Block.func_149684_b(params[4])).getName()}&7.`)
    } else if (mode === "give") {
        notify("&cThis command is currently unavailable.", false)
    } else if (mode === "gamemode") {
        notify("&cThis command is currently unavailable.", false)
    }
    else {
        ChatLib.chat("")
        ChatLib.chat("&7&lGhostX Commands")
        ChatLib.chat("&b/ghostx config &8- &3Open the configuration GUI for GhostX")
        ChatLib.chat("&b/ghostx setblock <x> <y> <z> <block type> &8- &3Place a ghost block at the specified coordinate. If no specific block type is set it will default to the configured block material.")
        ChatLib.chat("&c&lWIP &b/ghostx give <id> <count> <damage> <tag> &8- &3Give yourself a ghost item with the specified NBT")
        ChatLib.chat("&c&lWIP &b/ghostx gamemode <gamemode> &8- &3Change your gamemode clientside")
        ChatLib.chat("")
    }
}).setName('ghostx').setAliases("gx")