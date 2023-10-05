// @ts-nocheck

import { Message } from "discord.js"
const { Client, Events, Collection, GatewayIntentBits } = require("discord.js")
const fs = require("node:fs")
const path = require("node:path")
const { token } = require("./config.json")

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
	],
})

client.commands = new Collection()

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".ts"))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)

	console.log(`Loading command ${command?.data?.name} `)
	if ("data" in command && "execute" in command) {
		console.log('Command has "data" and "execute"')
		client.commands.set(command.data.name, command)
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
		)
	}
}

client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`)
})

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return

	const command = client.commands.get(interaction.commandName)

	if (!command) return

	try {
		await command.execute(interaction)
	} catch (error) {
		console.error(error)
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		})
	}
})

client.on(Events.MessageCreate, (message: Message) => {
	if (message.author.username === "gutoloko1") {
		message.react("🌈")
	}
})

client.login(token)
