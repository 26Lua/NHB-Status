// <3 LUNCH 

import { Client, Intents } from 'discord.js';
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] })

function getServer(state) {
    if (!state.match(/^🇺🇸\d/gi)) return null;
    return state.match(/^🇺🇸\d/gi)[0].split('🇺🇸')[1];
}

function getPlayers(state) {
    if (!state.match(/\d+?\/\d+? players/g)) return null;
    return state.state.match(/\d+?\/\d+? players/g)[0];
}

client.on('presenceUpdate', (oldPresence, newPresence) => {
    if (!oldPresence || oldPresence == newPresence || newPresence.user.bot || newPresence.activities.length == 0 || !newPresence.activities.find(r => r.name == "FiveM")) return;

    var status = newPresence.activities.find(r => r.name == "FiveM");  // get the status of the user
    var old_status = oldPresence.activities.find(r => r.name == "FiveM"); // get the prior status to compare
    if (!status && !old_status || old_status == status) return;  // test the status. If there is none, there is no point proceeding, and if both are the same then it doesn't matter.

    var old_server = getServer(old_status.state); // get the server the user was on. Returns null if no old_server
    var new_server = getServer(status.state); // get the server the user is on. Returns null if no new_server
    var old_players = getPlayers(old_status.state); // get the players on the server the user was on. Returns null if no old_players
    var new_players = getPlayers(status.state); // get the new server players. Returns null if there is no valid status

    // If old_server has the server format, but new_server doesn't, then the user has left the server.
    if (old_server != null && new_server == null) {
        client.channels.cache.get('ID').send(`${newPresence.user.username} (${newPresence.user.id}) left 🇺🇸 ${old_server}. Playercount: ${old_players}`);
    }
    // If new_server has the server format, but old_server doesn't, then the user has joined the server.
    else if (old_server == null && new_server != null) {
        client.channels.cache.get('ID').send(`${newPresence.user.username} (${newPresence.user.id}) joined 🇺🇸 ${new_server}. Playercount: ${new_players}`);
    }
    // If both have the server format, then the user has changed servers.
    else if (old_server != null && new_server != null) {
        client.channels.cache.get('ID').send(`${newPresence.user.username} (${newPresence.user.id}) changed servers from 🇺🇸 ${old_server} to 🇺🇸 ${new_server}`);
    }
});

client.login("Token");