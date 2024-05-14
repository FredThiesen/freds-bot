import Snoowrap from "snoowrap"
import config from "../config.json"

// use snoowrap to fetch the top reddit post on a specific subreddit
export const fetchTopPostsFromSubreddit = async (
	subreddit: string = "VALORANT"
) => {
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
			.getTop({ time: "day", limit: 3 })

		const formattedTopPosts = topPosts.map((post) => {
			const url = post.url
			const description = post.selftext
			const title = post.title
			const author = post.author.name
			const upvotes = post.ups
			const preview = getPreview(post.preview)
			const thumbnail = post.thumbnail
			const created = post.created_utc

			return {
				url,
				description,
				title,
				author,
				upvotes,
				preview,
				created,
				thumbnail,
			}
		})

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
