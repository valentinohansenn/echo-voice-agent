import React, { useState } from "react"
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	SafeAreaView,
	ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { registerGlobals } from "@livekit/react-native"
import dotenv from "dotenv"

dotenv.config()

registerGlobals()

export default function Index() {
	// State to manage conversation loading and speaking states
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [isSpeaking, setIsSpeaking] = useState<boolean>(false)

	// Handle mic button press
	const handleMicPress = () => {
		setIsSpeaking(!isSpeaking)
		fetchApi()
		// Add your voice recording logic here
	}

	const fetchApi = async () => {
		try {
			const res = await fetch("http://localhost:8000/test")
			const data = await res.json()
			console.log(data)
		} catch (error) {
			console.error("Error fetching data:", error)
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			{/* Main content container */}
			<View style={styles.contentContainer}>
				{/* Conversation area */}
				<View style={styles.conversationContainer}>
					{isLoading ? (
						// Loading animation
						<View style={styles.loadingContainer}>
							<ActivityIndicator size="large" color="#007AFF" />
							<Text style={styles.loadingText}>Listening...</Text>
						</View>
					) : (
						// Placeholder or conversation history would go here
						<Text style={styles.placeholderText}>
							Tap the microphone button and start speaking
						</Text>
					)}
				</View>

				{/* Bottom control area */}
				<View style={styles.controlsContainer}>
					{/* Microphone button */}
					<TouchableOpacity
						style={[
							styles.micButton,
							isSpeaking && styles.micButtonActive,
						]}
						onPress={handleMicPress}
						activeOpacity={0.7}
					>
						<Ionicons
							name={isSpeaking ? "mic" : "mic-outline"}
							size={32}
							color="white"
						/>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	)
}

// Styles
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F2F2F7", // iOS background color
	},
	contentContainer: {
		flex: 1,
		justifyContent: "space-between",
		padding: 16,
	},
	conversationContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
		borderRadius: 12,
		marginBottom: 16,
		padding: 16,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	loadingContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	loadingText: {
		marginTop: 12,
		fontSize: 16,
		color: "#007AFF",
		fontWeight: "500",
	},
	placeholderText: {
		fontSize: 16,
		color: "#8E8E93",
		textAlign: "center",
	},
	controlsContainer: {
		alignItems: "center",
		paddingBottom: 16,
	},
	micButton: {
		width: 72,
		height: 72,
		borderRadius: 36,
		backgroundColor: "#007AFF",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	micButtonActive: {
		backgroundColor: "#FF3B30", // iOS red color when recording
	},
})
