// @ts-nocheck
import {
	CommandInteraction,
	SlashCommandBuilder,
	AttachmentBuilder,
} from "discord.js"
import jimp from "jimp"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("reacao")
		.setDescription("Minha reação honesta.")
		.addStringOption((option) =>
			option
				.setName("url")
				.setDescription(
					"Link de uma imagem png ou jpg ou sei lá (opcional)"
				)
				.setRequired(false)
		),
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild

		// if the user is not in a guild, interaction.member will be null

		const url = interaction.options.get("url")
		const userAvatar = interaction.user.avatarURL()

		// console.log(inputUser)

		// get image from url with jimp
		let imageUrl = String(url && url?.value ? url.value : userAvatar)

		if (imageUrl?.match(/(\.webp)/gi)) {
			imageUrl = imageUrl.replace("webp", "png")
		}

		let image = await jimp.read(imageUrl)

		// resize image
		image.resize(jimp.AUTO, 512)

		// insert text into image centralized
		image.print(
			await jimp.loadFont(jimp.FONT_SANS_64_WHITE),
			0,
			-50,
			{
				text: "minha reação honesta a essa informação",
				alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
				alignmentY: jimp.VERTICAL_ALIGN_BOTTOM,
			},
			image.getWidth(),
			image.getHeight()
		)

		// Add the image as an attachement
		let attach = new AttachmentBuilder(
			await image.getBufferAsync(jimp.MIME_PNG)
		)

		// let attach = new AttachmentBuilder(image, {
		// 	name: "delete.png",
		// })

		await interaction.reply({
			files: [attach],
		})
	},
}
