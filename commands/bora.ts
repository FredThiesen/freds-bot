const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bora")
		.setDescription("Bora que o que?!"),
	async execute(interaction) {
		await interaction.reply("bora que eu tô com fome!!!")
	},
}
