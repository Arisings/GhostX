/**
 * @author Renascent
 * @param {int} arg 
 * @returns String representing gamemode
 */
export const getGamemodeFromInt = (arg) => {
    switch(parseInt(arg)) {
        case 0: return "Survival";
        case 1: return "Creative";
        case 2: return "Adventure";
        case 3: return "Spectator";
        default: return  arg;
    }
}