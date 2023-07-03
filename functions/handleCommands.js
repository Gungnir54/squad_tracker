const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const { TOKEN, CLIENT_ID, GUILD_ID } = require('../config.json');

module.exports = (bot) => {
  bot.handleCommands = async () => {
    const commandFolders = fs.readdirSync('./commands');
    for (const folder of commandFolders) {
      const commandFiles = `../commands/${folder}`;
      const { commands, commandsArray } = bot;
      const command = require(commandFiles);
      commands.set(command.cmd.name, command);
      commandsArray.push(command.cmd.toJSON());
    }

    const rest = new REST({ version: '9' }).setToken(TOKEN);
    try {
      console.log('Refresh de l\'application pour (/) commands...');

      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: bot.commandsArray,
      });

      console.log(
        'Le refresh de l\'application pour (/) commands est terminé !'
      );
    } catch (error) {
      console.log('Erreur lors du refresh de l\'application pour (/) commands');
      console.error(error);
    }
    console.log('Ready !');
  };
};
