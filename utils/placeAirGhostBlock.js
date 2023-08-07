const MCBlockPos = Java.type("net.minecraft.util.BlockPos")

export const placeAirGhostBlock = (x, y, z) => {
    /* 
    func_175698_g: setBlockToAir
    */
    World.getWorld().func_175698_g(new MCBlockPos(x, y, z))
}