import { SlashCommandBuilder } from "discord.js"
import moment from "moment"

//set moment locale to pt-br
moment.locale("pt-br")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("user")
		.setDescription("Provides information about the user."),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
		await interaction.reply(
			`Você é ${
				interaction.user.username
			}, e entrou no servidor em ${moment(
				interaction.member.joinedAt
			).format("HH:mm de DD/MM/YYYY")}\nou seja, ${moment(
				interaction.member.joinedAt
			).fromNow()}`
		)
	},
}
