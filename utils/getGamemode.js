import { getGamemodeFromName } from "./getGamemodeFromName";

/**
 * @author Renascent
 * @returns Integer representing gamemode
 */
export const getGamemode = (name) => {
    let mode = Client.getMinecraft().field_71442_b.func_178889_l().toString().toLowerCase();
    return getGamemodeFromName(mode);
}