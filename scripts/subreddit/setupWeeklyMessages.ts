// @ts-nocheck

import { ChannelType, Client, TextChannel, bold, hyperlink } from "discord.js"

import { calculateTimeUntilNextMessage } from "./calculateTimeUntilNextMessage"
import { fetchTopPostsFromSubreddit } from "./fetchTopPostsFromSubreddit"
import { sendTopPostsMessageToSubscribedChannels } from "./sendTopPostsMessageToSubscribedChannels"
import { SubredditPost } from "../../interfaces/SubredditPost"

const TIME_AND_DAY_OF_WEEKLY_MESSAGE = { day: 4, hour: "20:30" }

/**
 * Fetches top posts from specified subreddits and sends them to subscribed channels.
 *
 * @param subreddits - An array of subreddit names.
 * @param client - The client object used to interact with Discord API.
 * @param channels - An array of channel IDs where the messages will be sent.
 */
const handleFetchPosts = async (
	subreddits: string[],
	client: Client<boolean>,
	channels: string[]
) => {
	channels.forEach((id) => {
		const channel = client.channels.cache.get(id)
		if (channel && channel.type == ChannelType.GuildText)
			channel.send({
				content: bold(
					"📢 Chegou o top (f)reddit semanal!\nConfira os posts mais votados nestes subreddits ⬇\n\n"
				),
			})
	})

	for (const subreddit of subreddits) {
		const topPosts: SubredditPost[] = await fetchTopPostsFromSubreddit(
			subreddit,
			"week"
		)
		await sendTopPostsMessageToSubscribedChannels(
			`r/${subreddit}\n`,
			topPosts,
			client,
			channels
		)
	}
}

/**
 * Sets up weekly messages for fetching posts from specified subreddits and sending them to specified channels.
 *
 * @param client - The Discord client.
 * @param subreddits - An array of subreddit names.
 * @param channels - An array of channel names.
 */
export const setupWeeklyMessages = async (
	client: Client,
	subreddits: string[],
	channels: string[]
) => {
	const now = new Date()
	const remainingTimeUntilNextMessage = calculateTimeUntilNextMessage(
		now,
		TIME_AND_DAY_OF_WEEKLY_MESSAGE
	)

	// await handleFetchPosts(subreddits, client, channels)

	// console.log("remaining time in ms", remainingTimeUntilNextMessage)
	setTimeout(async () => {
		await handleFetchPosts(subreddits, client, channels)
		setInterval(async () => {
			await handleFetchPosts(subreddits, client, channels)
		}, 7 * 24 * 60 * 60 * 1000)
	}, remainingTimeUntilNextMessage)
}
