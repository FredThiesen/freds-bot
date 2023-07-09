// @ts-nocheck
import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import moment from "moment"
import { getAlmanax } from "../scripts/getAlmanax"

//set moment locale to pt-br
moment.locale("pt-br")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("almanax")
		.setDescription("Retorna o item do dia para o almanax"),
	async execute(interaction: CommandInteraction) {
		if (!interaction.isChatInputCommand()) return

		const date = moment()
		const almanaxItem = getAlmanax(date)

		if (!almanaxItem)
			interaction.reply("Não foi possível encontrar o item do dia")

		//format the almanax object in a nice way
		//the type of almanaxItem is Almanax
		const title = `**Almanax** de hoje: \n `
		const almanaxItemString = `> **Item**: \`${almanaxItem.oferenda}\` \n> **Recompensa**: ${almanaxItem.kamas} Kamas\n> **Bônus**: ${almanaxItem.meridiaBonus}`
		const franceDateString = `\n\nHorário da França: ${date
			.add(5, "hours")
			.format("HH:mm")}`
		await interaction.reply(title + almanaxItemString + franceDateString)
	},
}
