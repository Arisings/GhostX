/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from './config.js'
import RenderLib from "../RenderLib/index";
import { getTargetBlock } from "./utils/getTargetBlock";
import { placeAirGhostBlock } from "./utils/placeAirGhostBlock";
import { placeGhostBlock } from "./utils/placeGhostBlock";
import { getGamemode } from './utils/getGamemode.js';
import { getGamemodeFromName } from './utils/getGamemodeFromName.js';
import { getGamemodeFromInt } from './utils/getGamemodeFromInt.js';
import getItemFromNBT from './utils/getItemFromNBT.js';
import getClipboardContents from './utils/getClipboardContents.js';

const toggleDisplay = new Display();
toggleDisplay.setRenderLoc(1, 1);
toggleDisplay.addLine(new DisplayLine("&9Ghost Mode &8> &aEnabled").setShadow(true));
toggleDisplay.hide();

let ghostMode = false;

// Ghost action delay variables
let lastPlaceTime;
let lastBreakTime;

// Gamemode spoofing
/* Large amount of gamemode spoofing code comes from @renascent */
const S2BPacketChangeGameState = net.minecraft.network.play.server.S2BPacketChangeGameState;
let gamemodeBeforeSpoof = null;

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

        placeGhostBlock(Settings.blockType, pos[0], pos[1], pos[2], true)
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
    if(!params) return notify("&cInvalid command. Use: &e/gx help &cfor help.", false)
    let mode = params[0]?.toLowerCase()
    if (mode === "config") {
        Settings.openGUI()
    } else if (mode === "setblock") {
        if (params.length < 4) return notify("&cInvalid Usage: /ghostx setblock <x> <y> <z> <type>", false)
        let x = parseInt(params[1])
        let y = parseInt(params[2])
        let z = parseInt(params[3])

        if (isNaN(x)) return notify(`&cError: the given X value "${params[1]}" is not a number!`, false)
        if (isNaN(y)) return notify(`&cError: the given Y value "${params[2]}" is not a number!`, false)
        if (isNaN(z)) return notify(`&cError: the given Z value "${params[3]}" is not a number!`, false)

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
        notify(`&7Set the block at &b${x}&7, &b${y}&7, &b${z}&7 to &b${new BlockType(net.minecraft.block.Block.func_149684_b(params[4])).getName()}&7.`, false)
    } else if (mode === "copyitem") {
        let item = Player.getHeldItem();
        if (item === null) return notify("&cYou must be holding an item to copy its NBT!", false)
        ChatLib.command(`ct copy ${item.getRawNBT()}`, true);
        new Message("§8[§9GhostX§8] §7Copied the NBT of ", item.getTextComponent(), " §7to your clipboard.").chat();
    } else if (mode === "give") {
        if (params.length < 2) {
            notify("&cInvalid Usage: /ghostx give <nbt>", false)
        } else if (params.length === 2 && params[1].startsWith("{")) { // /ghostx give <nbt>
            try {
                if(params[1].toLowerCase() === "clipboard") params[1] = getClipboardContents();
                let item = getItemFromNBT(params[1]);
                new Message("§8[§9GhostX§8] §7Gave you ", item.getTextComponent(), ` * ${item.getStackSize()} §7clientside.`).chat();
                Player.getPlayer().field_71071_by.func_70441_a(item.getItemStack());
            } catch (e) {
                return notify(`&cAn error occurred while creating the item: ${e}`, false)
            }
        } else if (params.length >= 2){ // /ghostx give <item type> <count> <damage> <tag>
            let itemType;
            let count;
            let damage;
            let tag;

            try{
                let test = new Item(params[1]);
                itemType = params[1];
            } catch (e) {
                return notify(`&cNo such item type '${params[1]}' exists!`, false)
            }
            
            if(params[2]){ 
                if(isNaN(parseInt(params[2]))) return notify(`&cItem Count: &c'${params[2]}' is not a valid number!`, false)
                if(parseInt(params[2]) < 1 || parseInt(params[2]) > 64) return notify(`&cItem Count: &c'${params[2]}' is not a valid number! Please choose a number between 1 and 64!`, false)
                count = parseInt(params[2]);
            } else {
                count = 1;
            }

            if(params[3]){
                if(isNaN(parseInt(params[3]))) return notify(`&cItem Damage: &c'${params[3]}' is not a valid number!`, false)
                if(parseInt(params[3]) < 0 || parseInt(params[3]) > 32767) return notify(`&cItem Damage: &c'${params[3]}' is not a valid number! Please choose a number between 0 and 32767!`, false)
                damage = parseInt(params[3]);
            } else {
                damage = 0;
            }

            if(params[4]){
                try{
                    let test = net.minecraft.nbt.JsonToNBT.func_180713_a(params[4]);
                    tag = params[4];
                } catch (e) {
                    return notify(`&cItem Tag: ${e}`, false)
                }
            } else {
                tag = "";
            }

            let item = new Item(itemType);
            item.setStackSize(count);
            item.setDamage(damage);
            item = item.getItemStack();
            if(tag != "") item.func_77982_d(net.minecraft.nbt.JsonToNBT.func_180713_a(params[4]));
            Player.getPlayer().field_71071_by.func_70441_a(item);
            new Message("§8[§9GhostX§8] §7Gave you ", new Item(item).getTextComponent(), ` * ${count} §7clientside.`).chat();
        }
    } else if (mode === "gamemode" || mode === "gm") {
        if(params.length < 2) return notify("&cInvalid Usage: /ghostx gamemode <reset/gamemode>");
        let gamemode = params[1].toLowerCase();

        // Checks
        if(!isNaN(parseInt(gamemode)) && parseInt(gamemode) > 3 || parseInt(gamemode) < 0) return notify(`&c'${gamemode}' is not a valid number! Please choose a number between 0 and 3!`, false)
        if(gamemode != "reset" && isNaN(parseInt(gamemode)) && !["creative", "survival", "adventure", "spectator", "c", "s", "a", "sp"].includes(gamemode)) return notify(`&c'${gamemode}' is not a valid gamemode!`, false)

        if(gamemode === "reset") {
            if(gamemodeBeforeSpoof === null) return notify("&cYou are already in your original gamemode!", false);
            notify(`&7Reset your gamemode to &b${getGamemodeFromInt(gamemodeBeforeSpoof)}&7.`, false);
            new S2BPacketChangeGameState(3, gamemodeBeforeSpoof).func_148833_a(Client.getMinecraft().func_147114_u());
            return gamemodeBeforeSpoof = null;
        } else if(!isNaN(gamemode)) {
            gamemode = parseInt(gamemode);
        } else {
            gamemode = getGamemodeFromName(gamemode);
        }

        if(gamemode === getGamemode()) return notify(`&cYou are already in gamemode &b${getGamemodeFromInt(gamemode)}&c!`, false);

        if(gamemodeBeforeSpoof === null) gamemodeBeforeSpoof = getGamemode();
        new S2BPacketChangeGameState(3, gamemode).func_148833_a(Client.getMinecraft().func_147114_u());
        notify(`&7Your clientside gamemode has been updated to &b${getGamemodeFromInt(gamemode)}&7.`, false);
    } else if (mode === "setblocktype") {
        if (params.length < 2) return notify("&cInvalid Usage: /ghostx setblocktype <reset/block type>", false)

        if(params[1].toLowerCase() === "reset") {
            Settings.blockType = "minecraft:stone"
            notify(`&7Reset the block type to &b${new BlockType(net.minecraft.block.Block.func_149684_b("minecraft:stone")).getName()}&7.`, false)
        } else if (net.minecraft.block.Block.func_149684_b(params[1])) {
            if (new BlockType(net.minecraft.block.Block.func_149684_b(params[1])).getID() === 0) return notify(`&cInvalid block type! To "place" air blocks use the destroy hotkey instead!`, false)
            Settings.blockType = params[1]
            notify(`&7Set the block type to &b${new BlockType(net.minecraft.block.Block.func_149684_b(params[1])).getName()}&7.`, false)
        } else {
            return notify(`&cNo such block type "${params[1]}" exists!`, false)
        }
    }
    else {
        ChatLib.chat("")
        ChatLib.chat("&7&lGhostX Commands")
        ChatLib.chat("&b/ghostx config &8- &3Open the configuration GUI for GhostX")
        ChatLib.chat("&b/ghostx setblocktype <reset/block type> &8- &3Set the block type for placing ghost blocks")
        ChatLib.chat("&b/ghostx setblock <x> <y> <z> <block type> &8- &3Place a ghost block at the specified coordinate. If no specific block type is set it will default to the configured block material.")
        ChatLib.chat("&b/ghostx copyitem &8- &3Copies the NBT of your held item to the clipboard to be used later with /ghostx give")
        ChatLib.chat("&b/ghostx give <nbt> &8- &3Give yourself a ghost item with the specified NBT (Using NBT tag from /ghostx copyitem) | Replace <nbt> with clipboard to auto populate the NBT from your clipboard contents")
        ChatLib.chat("&b/ghostx give <item type> <count> <damage> <tag> &8- &3Give yourself a ghost item with the specified NBT")
        ChatLib.chat("&b/ghostx gamemode <reset/gamemode> &8- &3Change your gamemode clientside")
        ChatLib.chat("")
    }
}).setName('ghostx').setAliases("gx")

register('worldLoad', () => {
    gamemodeBeforeSpoof = null;
})
