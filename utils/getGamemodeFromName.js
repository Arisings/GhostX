/**
 * @author Renascent
 * @param {string} arg 
 * @returns Int representing gamemode
 */
export const getGamemodeFromName = (arg) => {
    switch(arg) {
        case "survival":
        case "s": 
            return 0;
        case "creative":
        case "c":
            return 1;
        case "adventure":
        case "a":
            return 2;
        case "spectator":
        case "sp":
            return 3;
        default:
            return arg;
    }
}
