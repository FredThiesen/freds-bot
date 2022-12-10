// @ts-nocheck
import { BingoChart } from "../interfaces/BingoChart"

export const createBingoCharts = (events: string[], chartQty: number) => {
	const randomEventSets: Array<string[]> = []
	for (let i = 0; i < chartQty; i++) {
		const randomEvents = events.sort(() => Math.random() - 0.5)
		randomEventSets.push(randomEvents)
	}

	const charts: Array<BingoChart> = []
	for (let i = 0; i < chartQty; i++) {
		const chart: BingoChart = {
			chart: [
				[
					randomEventSets[i][0],
					randomEventSets[i][1],
					randomEventSets[i][2],
				],
				[
					randomEventSets[i][3],
					randomEventSets[i][4],
					randomEventSets[i][5],
				],

				[
					randomEventSets[i][6],
					randomEventSets[i][7],
					randomEventSets[i][8],
				],
			],
			index: i + 1,
		}
		charts.push(chart)
	}

	return charts
}
