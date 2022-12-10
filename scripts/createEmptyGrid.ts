// @ts-nocheck
import jimp from "jimp"
export const createJimpGridImage = async () => {
	const grid = await jimp.create(600, 700, "#F0F0F0")

	const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE)

	// create grid lines
	const line = await jimp.create(1.5, 600, "#0A122A")
	const horizontalLine = await jimp.create(600, 1.5, "#0A122A")
	//draw horizontal lines
	grid.composite(horizontalLine, 0, 100)

	grid.composite(horizontalLine, 0, 300)

	grid.composite(horizontalLine, 0, 500)

	//draw vertical lines
	grid.composite(line, 200, 100)

	grid.composite(line, 400, 100)

	//

	//create header
	const header = await jimp.create(600, 100, "#0A122A")
	//print "BINGO" centralized
	header.print(
		font,
		15,
		0,
		{
			text: `Cartela do`,
			alignmentX: jimp.HORIZONTAL_ALIGN_LEFT,
			alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
		},
		header.getWidth(),
		header.getHeight()
	)
	// add header to grid without overlapping
	grid.composite(header, 0, 0)

	return grid
}
