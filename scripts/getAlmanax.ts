import { Moment } from "moment"
const almanax = require("../assets/almanax.json")
import { Almanax } from "../interfaces/Almanax"

export const getAlmanax = (date: Moment): Almanax => {
	//convert from brazil to france dateTime
	date.add(5, "hours")

	const monthNumber = date.month() + 1
	const dayNumber = date.date()

	const almanaxDay = almanax[monthNumber][dayNumber] || null

	if (!almanaxDay) throw new Error("Almanax day not found")

	return almanaxDay
}
