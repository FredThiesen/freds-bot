// @ts-nocheck
import Snoowrap from "snoowrap"
import config from "../../config.json"
import fs from "fs"
import path from "path"
import { SubredditPost } from "../../interfaces/SubredditPost"

// use snoowrap to fetch the top reddit post on a specific subreddit
export const fetchTopPostsFromSubreddit = async (
	subreddit: string,
	time: "week" | "day" | "hour" | "month" | "year" = "day"
): Promise<SubredditPost[]> => {
	try {
		const reddit = new Snoowrap({
			userAgent: "fredsbot",
			clientId: config.redditId,
			clientSecret: config.redditSecret,
			username: config.redditUsername,
			password: config.redditPassword,
		})

		const topPosts = await reddit
			.getSubreddit(subreddit)
			.getTop({ time, limit: 3 })

		const formattedTopPosts = topPosts.map((post) => {
			const url = `https://www.reddit.com${post.permalink}`
			const description = post.selftext ?? ""
			const title = post.title ?? ""
			const author = post.author.name ?? ""
			const upvotes = post.ups ?? 0
			const preview = getPreview(post.preview)
			const thumbnail = post.thumbnail ?? ""
			const created = post.created_utc ?? 0
			const isVideo = post.is_video ?? false
			const embedColor = getEmbedColor(subreddit)

			return {
				url,
				description,
				title,
				author,
				upvotes,
				preview,
				created,
				thumbnail,
				isVideo,
				embedColor,
			}
		})

		// if (subreddit === "VALORANT") {
		// fs.writeFileSync(
		// 	path.join(__dirname, `topPosts${subreddit}.json`),
		// 	JSON.stringify(topPosts, null, 2)
		// )
		// }
		// } else {
		// 	fs.writeFileSync(
		// 		path.join(__dirname, "topPosts2.json"),
		// 		JSON.stringify(topPosts, null, 2)
		// 	)
		// }

		return formattedTopPosts
	} catch (err) {
		console.error(err)
	}
}

const getPreview = (preview: any): string =>
	(!!preview &&
		preview?.enabled &&
		preview.images.filter((image) =>
			image.resolutions.filter(
				(res) => res.width > 450 && res.width < 700
			)
		)[0]?.source.url) ??
	""

const getEmbedColor = (subreddit: string): string => {
	switch (subreddit) {
		case "VALORANT":
			return "fd4556"
		case "Brasil":
			return "009739"
		default:
			return "6c25be"
	}
}
