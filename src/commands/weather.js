import { getWeather } from '../utils/weatherApi.js';
import { validateOption } from '../utils/helperFunctions.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { setUserPreference, getUserPreference } from '../utils/userPreferences.js';

export default {
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('Get the current weather')
		.addStringOption(option =>
			option.setName('location')
				.setDescription('City and state, e.g. "Seattle, WA"')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('set')
				.setDescription('Set your default location, e.g. "Seattle, WA"')
				.setRequired(false)),
	async execute(interaction) {
		try {
			const location = interaction.options.getString('location');
			const set = interaction.options.getString('set');

			if (location && set) {
				await interaction.reply('Please provide either a location or use the "set" option to set your default location, but not both.');
				return;
			}

			if (!location && !set) {
				const preferences = await getUserPreference(interaction.user.id);
				
				if (preferences) {
					const { city, state } = preferences;
					const weatherMessage = await getWeather(city.trim(), state.trim());
					await interaction.reply(weatherMessage);
				} else {
					await interaction.reply('No location found. You can set a default location with /weather set "city,state".');
				}
				return;
			}
			
			// ternary operator
			let validation = set ? await validateOption(set) : await validateOption(location);

			if (validation.invalid) {
				await interaction.reply(validation.message);
				return;
			}
			
			let { city, state } = validation.data;

			if (set) {
				setUserPreference(interaction.user.id, city, state);
				await interaction.reply(`Your default location has been set to ${city}, ${state}.`);
				return;
			}

			const weatherMessage = await getWeather(city.trim(), state.trim());
			await interaction.reply(weatherMessage);
			
		} catch (error) {
			console.error('An error occurred:', error);
			await interaction.reply('Sorry, something went wrong. Please try again later.');
		}
	}
};