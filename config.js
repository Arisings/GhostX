import { @Vigilant, @SwitchProperty, @CheckboxProperty, @ButtonProperty, @PercentSliderProperty, @TextProperty, @SliderProperty } from 'Vigilance';


@Vigilant("GhostX", "GhostX Configuration")
class Settings {

    @SwitchProperty({
        name: "Ghost Mode Toggled Indicator",
        description: 'Whether or not there should be an indicator in the top left corner when ghost mode is enabled.',
        category: "Settings",
        subcategory: "General",
    })
    toggleDisplay = true;

    @SwitchProperty({
        name: "Infinite Ghost Mode Range",
        description: 'If toggled, while in ghost mode you will be able to place blocks from an infinite amount of range. Otherwise, you will only be able to break and place ghost blocks within your normal player range.',
        category: "Settings",
        subcategory: "General",
    })
    useRayTracing = false;

    @SwitchProperty({
        name: "Ghost Mode Selected Block Indicator",
        description: 'Whether or not a ESP outline should be shown over the block you have selected to run an action on (whether to ghost break the block or place a ghost block on it) while in ghost mode.',
        category: "Settings",
        subcategory: "General",
    })
    selectedBlockIndicator = true;

    @SwitchProperty({
        name: "Play Sound",
        description: 'Whether or not a sound should be played whenever a block is removed or created.',
        category: "Settings",
        subcategory: "General",
    })
    actionSound = true;

    @SliderProperty({
        name: "Ghost Break Delay",
        description: "Time to wait between breaking ghost blocks when holding down the break key (in miliseconds). Default delay in vanilla minecraft is 300ms.\n\nNote: very low cooldown times may make it difficult to break one block at a time.",
        category: "Settings",
        subcategory: "Ghost Break",
        min: 0,
        max: 1000
    })
    ghostBreakDelay = 300;

    @TextProperty({
        name: "Ghost Block Material",
        description: "The type of block that will be placed when placing ghost blocks. Make sure to specify a valid Minecraft Block ID otherwise the block type will default to stone.",
        category: "Settings",
        subcategory: "Ghost Place",
    })
    blockType = "minecraft:stone";

    @SwitchProperty({
        name: "Prevent Placing Blocks in Yourself",
        description: 'Whether or not the mod should prevent you from being able to place ghost blocks inside of yourself.',
        category: "Settings",
        subcategory: "Ghost Place",
    })
    preventSelfPlace = true;

    @SliderProperty({
        name: "Ghost Place Delay",
        description: "Time to wait between placing ghost blocks when holding down the break key (in miliseconds). Default delay in vanilla minecraft is 200ms.\n\nNote: very low cooldown times may make it difficult to place down one block at a time.",
        category: "Settings",
        subcategory: "Ghost Place",
        min: 0,
        max: 1000
    })
    ghostPlaceDelay = 200;

    constructor() {
        this.initialize(this);
        this.setCategoryDescription("Settings", "&aGhostX Configuration\n\n&bThe multi-purpose utility client for creating ghost blocks, created by Arisings.")
        this.setSubcategoryDescription("Settings", "Ghost Break", "Configure the settings related to the ghost break function.")
        this.setSubcategoryDescription("Settings", "Ghost Place", "Configure the settings related to the ghost place function.")
    }
}

export default new Settings();