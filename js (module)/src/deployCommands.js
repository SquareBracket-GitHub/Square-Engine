import { REST, Routes } from 'discord.js';
import config from '../configs/config.js'
import fs from 'fs';

let commands = [];
const { TOKEN, COMMAND_MODE, TEST_GUILD, CLIENT_ID } = config;

const commandsFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith(".js"));

commandsFiles.forEach(async file => {
  const command = await import(`./commands/${file}`);

  commands.push(command.default.data);
});

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    if (COMMAND_MODE === 'GLOBAL') {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    } else if (COMMAND_MODE === 'GUILD') {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: {} })
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD), { body: commands });
    }

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();