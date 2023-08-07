const MCBlockPos = Java.type("net.minecraft.util.BlockPos");
const MCBlock = Java.type("net.minecraft.block.Block");

export const placeGhostBlock = (blockName, x, y, z, noAir = true) => {
    /*
    func_175656_a: setBlockState
    func_149684_b: getBlockFromName
    func_176223_P: getDefaultState
    */
    let block = MCBlock.func_149684_b(blockName)
    if (!block || (block instanceof net.minecraft.block.BlockAir && noAir)) block = MCBlock.func_149684_b("minecraft:stone") // If specified block type is invalid the block will default to stone
    World.getWorld().func_175656_a(new MCBlockPos(x, y, z), block.func_176223_P())
}