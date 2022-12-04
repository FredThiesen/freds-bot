import { SlashCommandBuilder } from "discord.js"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async execute(interaction) {
		console.log('executando comando "ping"')
		await interaction.reply("Pong!")
	},
}
