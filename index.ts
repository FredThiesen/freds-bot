//ignore ts erros in all file
// @ts-nocheck

// https://discord.com/api/oauth2/authorize?client_id=840577499885076520&permissions=8&scope=bot%20applications.commands

// Require the necessary discord.js classes
const { Client, Events, Collection, GatewayIntentBits } = require("discord.js")
const fs = require("node:fs")
const path = require("node:path")
const { token } = require("./config.json")

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = new Collection()

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".ts"))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	console.log(`Loading command ${command.data.name}`)
	if ("data" in command && "execute" in command) {
		console.log('Command has "data" and "execute"')
		client.commands.set(command.data.name, command)
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
		)
	}
}

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
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

// client.on(Events.InteractionCreate, (interaction) => {
// 	console.log(interaction)
// })

// client.on(Events.InteractionCreate, (interaction) => {
// 	if (!interaction.isChatInputCommand()) return
// 	console.log(interaction)
// })

// Log in to Discord with your client's token
client.login(token)
