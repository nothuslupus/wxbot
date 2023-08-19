export default {
	name: 'interactionCreate',
	async execute(interaction) {
		console.log(`Received interaction: ${interaction.commandName}`);

		if (!interaction.isCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
		console.log(`Executing command: ${command.data.name}`);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};
