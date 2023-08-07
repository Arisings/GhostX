// Borrowed code from CT Discord and Ruler module
export const getTargetBlock = (offset = false, useRayTracing) => {
    if (!useRayTracing) {
        let la = Player.lookingAt()
        if (!la || !(la instanceof Block)) return null
        let [x, y, z] = [la.getX(), la.getY(), la.getZ()]
        if (offset) return [x + la.face.getOffsetX(), y + la.face.getOffsetY(), z + la.face.getOffsetZ()]
        return [x, y, z]
    } else {
        let ray = Player.getPlayer().func_174822_a(500, Tessellator.partialTicks); // Raytrace block
        let rayBlockPos = ray?.func_178782_a() // getBlockPos
        let [rayX, rayY, rayZ] = [rayBlockPos.func_177958_n(), rayBlockPos.func_177956_o(), rayBlockPos.func_177952_p()]
        if (World.getBlockAt(rayX, rayY, rayZ).getType().getRegistryName() === "minecraft:air") return null // Make sure block is valid
        if (offset) {
            return [rayX + ray.field_178784_b.func_82601_c(), rayY + ray.field_178784_b.func_96559_d(), rayZ + ray.field_178784_b.func_82599_e()] // SideHit + getFrontOffsetX/Y/Z
        }
        return [rayX, rayY, rayZ]
    }
}