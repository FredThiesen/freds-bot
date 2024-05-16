import { ChannelType, Client, EmbedBuilder, blockQuote } from "discord.js"
import { bold } from "discord.js"
import { SubredditPost } from "../../interfaces/SubredditPost"

const MAX_TITLE_LENGTH = 200

export const sendTopPostsMessageToSubscribedChannels = async (
	title: string,
	topPosts: SubredditPost[],
	client: Client,
	channelIds: string[]
) => {
	const embeds = []

	topPosts.forEach((post) => {
		const {
			url,
			description,
			title,
			author,
			upvotes,
			preview,
			created,
			thumbnail,
			embedColor,
		} = post
		try {
			const embed = new EmbedBuilder()
			let embedTitle: string = post.isVideo ? `🎬 - ${title}` : title
			if (embedTitle.length > MAX_TITLE_LENGTH) {
				embedTitle = embedTitle.substring(0, MAX_TITLE_LENGTH) + "..."
			}
			embed.setColor(`#${embedColor}`).setTitle(embedTitle).setURL(url)

			if (upvotes) {
				embed.setFooter({ text: `${author} • 👍 ${upvotes}` })
			}

			if (description.length > 0) {
				embed.setDescription(description)
			}

			if (preview.length > 0 && isValidUrl(preview)) {
				embed.setImage(preview)
			} else if (thumbnail.length > 0 && isValidUrl(thumbnail)) {
				embed.setImage(thumbnail)
			}
			embeds.push(embed)
		} catch (e) {
			console.error(e)
		}
	})

	if (embeds.length > 0) {
		channelIds.forEach((id) => {
			const channel = client.channels.cache.get(id)
			if (!channel || channel.type !== ChannelType.GuildText)
				return console.error("Canal de texto não encontrado.")

			const message = blockQuote(bold(title))

			channel.send({ content: message, embeds })
		})
	}
}

const isValidUrl = (string: string) => {
	try {
		new URL(string)
		return true
	} catch (_) {
		return false
	}
}
