export default {
	expo: {
		name: "your-app-name",
		extra: {
			LIVEKIT_API_KEY: process.env.LIVEKIT_API_KEY,
			LIVEKIT_API_SECRET: process.env.LIVEKIT_API_SECRET,
		},
	},
}
