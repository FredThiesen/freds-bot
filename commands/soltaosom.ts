import {
	DiscordGatewayAdapterCreator,
	NoSubscriberBehavior,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} from "@discordjs/voice"
import {
	CommandInteraction,
	GuildMember,
	PermissionsBitField,
	SlashCommandBuilder,
} from "discord.js"
import play, { YouTubeVideo } from "play-dl"

//@ts-ignore
module.exports = {
	data: new SlashCommandBuilder()
		.setName("soltaosom")
		.setDescription("Tocar uma música do youtube.")
		.addStringOption((option) =>
			option
				.setName("musica")
				.setDescription("Bota o nome ou link da música")
				.setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		if (!interaction.isCommand()) return
		if (!interaction.member) return

		// console.log("testando comando somnacaixa")
		let argSongName = interaction.options.get("musica")?.value as string

		const isUrl = argSongName.includes("https://")

		console.log("argSongName", argSongName)

		const member = interaction.member as GuildMember

		const { channel } = member?.voice || {}
		if (!channel)
			return interaction.reply(
				"vc precisa estar em um canal pra tocar música, jamelão 👺👺👺👺"
			)

		const connection = joinVoiceChannel({
			channelId: channel.id,
			//@ts-ignore
			guildId: interaction.guildId,
			adapterCreator: interaction.guild
				?.voiceAdapterCreator as DiscordGatewayAdapterCreator,
		})

		let ytInfo: YouTubeVideo[] | undefined

		if (!isUrl)
			ytInfo = await play.search(argSongName, {
				limit: 1,
			})

		const getMusicSource = () => {
			if (isUrl) return argSongName
			if (!!ytInfo) return ytInfo[0].url
			return ""
		}

		const musicSource = getMusicSource()
		if (!musicSource)
			return interaction.reply("Não achei essa música, jamelão 👺👺👺👺")
		try {
			const stream = await play.stream(musicSource)
			const audioResource = createAudioResource(stream.stream, {
				inputType: stream.type,
			})

			const player = createAudioPlayer({
				behaviors: {
					noSubscriber: NoSubscriberBehavior.Play,
				},
			})

			player.play(audioResource)

			connection.subscribe(player)
		} catch (e) {
			return interaction.reply(
				"preciso de um link do youtube, jamelão 👺👺👺👺"
			)
		}

		if (!!ytInfo)
			interaction.reply(`Tocando agora: \n > 📻🎶 ${ytInfo[0].title}`)
		else interaction.reply(`> Tocando sua música 📻🎶`)
	},
	permissions: [
		PermissionsBitField.Flags.Connect,
		PermissionsBitField.Flags.Speak,
		PermissionsBitField.Flags.AddReactions,
		PermissionsBitField.Flags.ManageMessages,
	],
}
