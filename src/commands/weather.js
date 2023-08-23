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

			// If no location or set option is provided, check if the user has a default location set
			if (!location && !set) {
				const preferences = await getUserPreference(interaction.user.id);
				
				if (preferences) {
					const { city, state } = preferences;
					const weatherMessage = await getWeather(city, state);
					await interaction.reply(weatherMessage);
				} else {
					await interaction.reply('No location found. You can set a default location with /weather set "city,state".');
				}
				return;
			}
			
			// Validate the city and state
			const validation = set ? await validateOption(set) : await validateOption(location);

			if (validation.invalid) {
				await interaction.reply(validation.message);
				return;
			}
			
			const { city, state } = validation.data;
			let preferenceSet = "";

			if (set) {
				setUserPreference(interaction.user.id, city, state);
				preferenceSet = `Your default location has been set to: ${city}, ${state}\n`;
			}

			const weatherMessage = await getWeather(city, state);
			await interaction.reply(preferenceSet + weatherMessage);
			return;
			
		} catch (error) {
			console.error('An error occurred:', error);
			await interaction.reply('Sorry, something went wrong. Please try again later.');
		}
	}
};