import { User } from "discord.js"
import jimp from "jimp"
import { BingoChart } from "../interfaces/BingoChart"
export const populateGrid = async (
	cartela: BingoChart,
	grid: jimp,
	username: string
) => {
	const yellowFont = await jimp.loadFont(
		"assets/fonts/montserrat-30-yellow.fnt"
	)
	//import font from assets/fonts "montserrat-16.fnt"

	const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK)
	const bigFont = await jimp.loadFont(jimp.FONT_SANS_64_WHITE)
	// print events in grid

	const isSingleWord = (event: string) => event.split(" ").length === 1

	cartela.chart.map((row, rowIndex) => {
		row.map((event, columnIndex) => {
			grid.print(
				font,
				columnIndex * 200,
				rowIndex * 200 + 100,
				{
					text: event,
					alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
					alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
				},
				190,
				190
			)
		})
	})

	grid.print(
		yellowFont,
		0,
		0,
		{
			text: username || "maluco",
			alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
			alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
		},
		grid.getWidth(),
		100
	)

	return grid
}
