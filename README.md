# GhostX
GhostX is a versatile ChatTriggers module for Minecraft that provides several utilities dealing with ghost blocks and ghost items.

# Installation
1. Download [Forge for 1.8.9](https://files.minecraftforge.net/net/minecraftforge/forge/index_1.8.9.html) if you do not have it already, then download the latest version of [ChatTriggers for 1.8.9](https://www.chattriggers.com/) and drag the ChatTriggers .jar file into your mods folder.
2. Download the GhostX module from this page. To do this, find the releases tab on the right-hand side, and click download ZIP.
3. Drag the GhostX file into your ChatTriggers modules folder, which you can get to by typing `/ct files` in-game. If the file is zipped, unzip it. You may also have to rename the file from `GhostX-main` to `GhostX` depending on how you installed the file.
4. Type `/ct reload` in chat.
5. Now you should be all set! In order to verify that the module has been installed correctly, you can run `/ghostx help` and you should see the GhostX help message or alternatively run `/ct modules` and GhostX should appear under modules.

# Features
## Ghost Blocks
In order to place and remove blocks (ghost blocks) on the clientside you must be in "Ghost Mode". Ghost Mode can be enabled by pressing the toggle keybind `G`. Once you are in Ghost Mode you can see the block you have selected indicated by a red ESP box. You can place a ghost block on the highlighted block by pressing `P` or remove the highlighted block clientside by pressing `X`.

Ghost Mode is highly configurable and its behavior can be adjusted in the GhostX settings (Accessed via `/gx config`). Additionally all Ghost Mode related keybinds can be adjusted in Minecraft Controls.

Other related ghost block features:
- You can use the `/gx setblocktype` command to directly set the ghost block material without having to navigate through `/gx config`
- You can add a ghostblock at specific coordinates with the command `/gx setblock` which functions almost identically to the vanilla `/setblock` command in terms of its parameters.

![image](https://github.com/Arisings/GhostX/assets/96034376/084a48f8-9345-4cc1-a725-01b314d4f460)

## Ghost Items
You can give yourself ghost items using the `/gx give` command. There are two ways to use the `/gx give` command.
- The first way is to directly input a NBT string into the command via `/gx give <nbt>`. This NBT string can be copied directly from an item by holding it and running `/gx copyitem`. Additionally if an item's full NBT string does not fit in the chat box you can load it in by running `/gx give clipboard` with your clipboards content containing a valid NBT string.
- The second way is to load in an item by passing in an item type, optional item count, optional item damage, and optional NBT tag. This way works nearly identically to the vanilla 1.8.9 /give command.

Keep in mind items given to yourself on the clientside are completely temporary and will dissapear if your inventory is updated (i.e. an item is added or removed) or the ghost item itself is clicked in your inventory. Nonetheless ghost items are able to indirectly interact with the server in interesting ways such as ghost tools allowing you to break blocks faster than normal (this is nearly identical to a client's fast break feature), which should be kept in mind with dealing with ghost items on public servers. 

![image](https://github.com/Arisings/GhostX/assets/96034376/19f1001f-4602-4414-aaf4-a7961b3453d0)

## Ghost Gamemode
You can set your clientside gamemode using the `/gx gamemode` command. Additionally, you can reset your gamemode back to the server gamemode using `/gx gamemode reset` (Note: the system in place to reset your gamemode is not foolproof and may glitch out if your gamemode is updated by the server while you are in a clientside gamemode).

You can choose between the 4 vanilla gamemodes to set yourself clientside:
- Survival (0)
- Creative (1)
- Adventure (2)
- Spectator (3)

Keep in mind that on most servers being in ghost creative and spectator modes will allow you to fly even if you shouldn't be able to which will be flagged as fly hacks and set off the anticheat. Additionally being in ghost creative gives you an extra block of reach that you normally should not have and may be flagged as reach hacks.

![image](https://github.com/Arisings/GhostX/assets/96034376/d3448962-2de6-466d-b032-0035dc5b5ca2)

## Commands
# GhostX Commands
Here is a list of available commands for the GhostX module:
(Note: the `/gx` alias can be used in place of `GhostX` at any time)

- **/ghostx config**  
  Open the configuration GUI for GhostX.

- **/ghostx setblocktype <reset/block type>**  
  Set the block type for placing ghost blocks. Use the parameter `reset` to reset the block type to the default stone.

- **/ghostx setblock <x> <y> <z> <block type>**  
  Place a ghost block at the specified coordinate. If no specific block type is set, it will default to the configured block material.

- **/ghostx copyitem**  
  Copies the NBT of your held item to the clipboard to be used later with `/ghostx give`.

- **/ghostx give <nbt>**  
  Give yourself a ghost item with the specified NBT (Using NBT tag from `/ghostx copyitem`). Replace `<nbt>` with `clipboard` to auto populate the NBT from your clipboard  contents.

- **/ghostx give <item type> <count> <damage> <tag>**  
  Give yourself a ghost item with the specified values.

- **/ghostx gamemode <reset/gamemode>**  
  Change your gamemode clientside. Use the parameter `reset` to reset your gamemode to the serverside gamemode.

- **/gx help**
  Show an in-game help message with all these commands.
  
# ⚠️ Disclaimer ⚠️
This module was made purely for educational purposes in order to explore the capabilities of clientside blocks and items and their interactions with the server. If used incorrectly, many features of this module can be indistinguishable from the functionalities of a hacked client from the server's point of view. I do not condone abuse of this module to gain advantages over other players on public servers and I am not responsible if you are banned as a result of using this module. Please use this module at your own risk and common sense.
