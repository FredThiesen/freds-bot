import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import moment from "moment"
import {
	handleImageGeneration,
	ImageGeneratorEnum,
} from "../scripts/handleImageGeneration"

//set moment locale to pt-br
moment.locale("pt-br")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("trigger")
		.setDescription("Tá brabo?")
		.addUserOption((option) =>
			option
				.setName("usuario")
				.setDescription("O nome de usuário do maluco")
				.setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild

		// if the user is not in a guild, interaction.member will be null

		const inputUser = interaction.options.get("usuario")

		let avatar = inputUser?.user?.avatarURL({ forceStatic: true })

		const img = await handleImageGeneration(
			String(avatar),
			ImageGeneratorEnum.TRIGGER
		)

		//send img as gif
		await interaction.reply({
			files: [
				{
					attachment: img,
					name: "trigger.gif",
					//set the file as a gif
					//this is a workaround for discord.js not supporting gifs
					//as of 2021-08-01
				},
			],
		})
	},
}
