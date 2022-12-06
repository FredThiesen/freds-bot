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
		.setName("bobrosslink")
		.setDescription("Uma obra de arte")
		.addStringOption((option) =>
			option
				.setName("url")
				.setDescription("O endereço da imagem (link)")
				.setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild

		// if the user is not in a guild, interaction.member will be null

		const inputImage = interaction.options.get("url")

		let image = inputImage?.value

		const img = await handleImageGeneration(
			String(image),
			ImageGeneratorEnum.BOBROSS
		)

		//send img as gif
		await interaction.reply({
			files: [img],
		})
	},
}
