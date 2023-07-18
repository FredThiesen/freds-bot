// @ts-nocheck
import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import moment from "moment-timezone"
import { getAlmanax } from "../scripts/getAlmanax"
import { isObject, isEmpty } from "lodash"

//set moment locale to pt-br
moment.locale("pt-br")

//set moment timezone to brazil
moment.tz.setDefault("America/Sao_Paulo")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("almanax")
		.setDescription("Retorna o item do dia para o almanax"),
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return

		const date = moment()
		date.tz("America/Sao_Paulo")
		const almanaxItem = getAlmanax(date)

		if (!isObject(almanaxItem))
			interaction.reply("Não foi possível encontrar o item do dia")

		const tomorrowDate = moment(date).add(1, "day")
		const remainigTimeUntilMidnight = moment
			.duration(
				//get the remaining time until midnight based on date and return formatted string with moment
				moment(date).endOf("day").diff(date)
			)
			.humanize(true)

		const almanaxItemTomorrow = getAlmanax(tomorrowDate)

		//format the almanax object in a nice way
		//the type of almanaxItem is Almanax
		const title = `**Almanax** de hoje: \n `
		const almanaxItemString = `> **Item**: \`${almanaxItem.oferenda}\` \n`
		const almanaxRewardString = `> **Recompensa**: ${almanaxItem.kamas} Kamas\n`
		const almanaxBonusString =
			almanaxItem.meridiaBonus.length &&
			`> **Bônus**: ${almanaxItem.meridiaBonus}`
		const almanaxTomorrowItemString = isObject(almanaxItemTomorrow)
			? `\n\n > Se prepare para **Amanhã (${remainigTimeUntilMidnight}):** \`${almanaxItemTomorrow.oferenda}\` `
			: ""
		const franceDateString = `\n\nHorário da França: ${date.format(
			"HH:mm"
		)}`
		await interaction.reply(
			title +
				almanaxItemString +
				almanaxRewardString +
				almanaxBonusString +
				almanaxTomorrowItemString +
				franceDateString
		)
	},
}
