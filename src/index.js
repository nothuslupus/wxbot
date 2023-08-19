import fs from 'fs';
import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';

dotenv.config();
const { TOKEN, COMMANDS_PATH } = process.env;

// Start a new Client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
	],
});

// Create a new Collection to store our commands
client.commands = new Map();

// Read the commands directory and filter out any non-JS files
const isJs = file => file.endsWith('.js')
const commandFiles = fs.readdirSync('./src/commands/').filter(isJs);

// Loop over each file and load the command
for (const file of commandFiles) {
	const commandModule = await import(`./commands/${file}`);
    const command = commandModule.default;
    client.commands.set(command.data.name, command);
}

// Read the events directory and filter out any non-JS files
const eventFiles = fs.readdirSync('./src/events').filter(isJs);

// Loop over each file and load the event
for (const file of eventFiles) {
	const eventModule = await import(`./events/${file}`);
    const event = eventModule.default;
    const listen = (...args) => event.execute(...args, client);
	if (event.once) {
		client.once(event.name, listen);
	} else {
		client.on(event.name, listen);
	}
}

client.login(TOKEN);
