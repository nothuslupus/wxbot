import { getWeather } from '../utils/weatherApi.js';
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

			let city, state;

			const formatCity = city => city.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

			if (set) {
				[city, state] = set.split(',');
				city = formatCity(city);
				state = state.toUpperCase();
				setUserPreference(interaction.user.id, city, state);
				await interaction.reply(`Your default location has been set to ${city}, ${state}.`);
				return;
			}

			if (location) {
				[city, state] = location.split(',');
				city = formatCity(city);
				state = state.toUpperCase();
			} else {
				console.log(interaction.user.id)
				const preferences = await getUserPreference(interaction.user.id);
				console.log(preferences);
				if (preferences) {
					city = preferences.city;
					state = preferences.state;
				} else {
					await interaction.reply('No location found. You can set a default location with /weather set "city,state".');
					return;
				}
			}

			const weatherMessage = await getWeather(city.trim(), state.trim());
			await interaction.reply(weatherMessage);
		} catch (error) {
			console.error('An error occurred:', error);
			await interaction.reply('Sorry, something went wrong. Please try again later.');
		}
	}

};