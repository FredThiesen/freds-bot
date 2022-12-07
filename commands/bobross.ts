// @ts-nocheck
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
		.setName("bobross")
		.setDescription("O cara é uma obra de arte")
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

		console.log("esse cara é um bot?")
		console.log(inputUser?.user?.bot ? "sim" : "não")

		const img = await handleImageGeneration(
			String(avatar),
			ImageGeneratorEnum.BOBROSS
		)

		//send img as gif
		await interaction.reply({
			files: [img],
		})
	},
}
