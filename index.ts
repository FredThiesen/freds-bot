// @ts-nocheck

import {
	Message,
	Client,
	Events,
	Collection,
	GatewayIntentBits,
} from "discord.js"
import { fetchTopPostsFromSubreddit } from "./scripts/fetchTopRedditPost"
import { sendTopPostsMessage } from "./scripts/sendTopPostsMessage"
import fs from "node:fs"
import path from "node:path"
import { token } from "./config.json"

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

client.once(Events.ClientReady, async (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`)

	try {
		const topPosts = await fetchTopPostsFromSubreddit()

		sendTopPostsMessage(topPosts, client)
	} catch (err) {
		console.error(err)
	}
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
			content: "Ops, algo deu errado 🤓",
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
