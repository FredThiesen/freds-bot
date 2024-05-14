//   // Calcula o tempo até o próximo envio da mensagem
//   const agora = new Date();
//   const [horas, minutos] = horarioEnvio.split(':');
//   const proximoEnvio = new Date(agora);
//   proximoEnvio.setHours(horas);
//   proximoEnvio.setMinutes(minutos);
//   proximoEnvio.setSeconds(0);
//   proximoEnvio.setMilliseconds(0);

import { ChannelType, Client, EmbedBuilder, TextChannel } from "discord.js"
import { bold } from "discord.js"
import { SubredditPost } from "../interfaces/SubredditPost"

//   // Se o horário do próximo envio já passou hoje, agendamos para a próxima semana
//   if (proximoEnvio.getTime() < agora.getTime()) {
// 	proximoEnvio.setDate(proximoEnvio.getDate() + 7);
//   }

//   // Calcula o tempo até o próximo envio em milissegundos
//   const tempoAteProximoEnvio = proximoEnvio.getTime() - agora.getTime();

//   // Agendamento do envio da mensagem
//   setTimeout(() => {
// 	enviarMensagem(); // Envio da mensagem imediato
// 	// Agendar o envio da mensagem toda semana
// 	setInterval(() => {
// 	  enviarMensagem();
// 	}, 7 * 24 * 60 * 60 * 1000); // 7 dias em milissegundos
//   }, tempoAteProximoEnvio);

export const sendTopPostsMessage = async (
	topPosts: SubredditPost[],
	client: Client
) => {
	const channelIds = ["1240031711530586133"]
	const channel = client.channels.cache.get(channelIds[0])

	if (!channel || channel.type !== ChannelType.GuildText)
		return console.error("Canal de texto não encontrado.")

	const embeds = []

	topPosts.forEach((post) => {
		try {
			const {
				url,
				description = "sem descrição",
				title = "sem título",
				author = "anônimo",
				upvotes = "sei lá quantos",
				preview = "https://static.itdg.com.br/images/640-400/707f63812d06b57480d0177887226947/318825-original.jpg",
				created,
				thumbnail,
			} = post

			const embed = new EmbedBuilder()
			embed
				.setColor(0x6c25be)
				.setTitle(title)
				.setURL(url)
				.setAuthor({
					name: author,
				})
				.setFooter({ text: `👍 ${upvotes} upvotes` })
			// .setTimestamp(created)

			if (description.length > 0) {
				embed.setDescription(description)
			}

			if (preview.length > 0) {
				embed.setImage(preview)
			} else if (thumbnail.length > 0) {
				embed.setImage(thumbnail)
			}

			embeds.push(embed)
		} catch (e) {
			console.error(e)
		}
	})

	if (embeds.length > 0) {
		const message = bold(
			"\nChegooou o top 3 de valorant da semana!  🔫🤓\n\n\n"
		)
		;(channel as TextChannel).send({ content: message, embeds })
	}
}
