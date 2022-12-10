import {
	CommandInteraction,
	SlashCommandBuilder,
	AttachmentBuilder,
} from "discord.js"
import jimp from "jimp"
import bingo from "../assets/bingo.json"
import { BingoChart } from "../interfaces/BingoChart"
import { createBingoCharts } from "../scripts/createBingoCharts"
import { createJimpGridImage } from "../scripts/createEmptyGrid"
import { populateGrid } from "../scripts/populateGrid"

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bingo")
		.setDescription("Criar cartelas de bingo.")
		.addUserOption((option) =>
			option
				.setName("usuario")
				.setDescription("Para quem será esta cartela?")
				.setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild

		// if the user is not in a guild, interaction.member will be null

		let chartQty = 1

		const user = interaction.options.getUser("usuario")

		const events = bingo.find((e) => e.category === "terror").events

		let cartelas: Array<BingoChart> = createBingoCharts(
			events,
			Number(chartQty)
		)

		const grid = await createJimpGridImage()
		const populatedGrid = await populateGrid(
			cartelas[0],
			grid,
			user.username
		)
		const attach = new AttachmentBuilder(
			await populatedGrid.getBufferAsync(jimp.MIME_PNG)
		)

		await interaction.reply({
			//mention user
			content: `Aqui está sua cartela, ${user}`,

			files: [attach],
		})
	},
}
