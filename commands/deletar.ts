// @ts-nocheck
import {
	CommandInteraction,
	SlashCommandBuilder,
	AttachmentBuilder,
} from "discord.js"
import DIG from "discord-image-generation"
import {
	handleImageGeneration,
	ImageGeneratorEnum,
} from "../scripts/handleImageGeneration"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("deletar")
		.setDescription("Delete aquele cara chato.")
		.addUserOption((option) =>
			option
				.setName("usuario")
				.setDescription("Nome de usuário")
				.setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild

		// if the user is not in a guild, interaction.member will be null

		const inputUser = interaction.options.get("usuario")
		// console.log(inputUser)

		let avatar = inputUser?.user?.avatarURL({ forceStatic: true })

		// Make the image
		// const img = await new DIG.Delete().getImage(avatar ? avatar : "")
		const img = await handleImageGeneration(
			String(avatar),
			ImageGeneratorEnum.DELETAR
		)

		// Add the image as an attachement
		let attach = new AttachmentBuilder(img, {
			name: "delete.png",
		})

		await interaction.reply({
			files: [attach],
		})
	},
}
