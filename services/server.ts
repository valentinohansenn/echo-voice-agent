import { AccessToken } from 'livekit-server-sdk';
import Constants from 'expo-constants';

export const createToken = async () => {
   try {
      const room = "quickstart-room";
      const participantName = "quickstart-username";

      const apiKey = Constants.expoConfig?.extra?.LIVEKIT_API_KEY;
      const apiSecret = Constants.expoConfig?.extra?.LIVEKIT_API_SECRET;

      if (!apiKey || !apiSecret) {
         throw new Error('API Key or Secret not found');
      }

      const at = new AccessToken(apiKey, apiSecret, {
         identity: participantName,
         ttl: "10m",
      });

      at.addGrant({
         roomJoin: true,
         room: room,
      });

      return await at.toJwt()
   } catch (error) {
      console.error('Error creating token', error);
      throw error;
   }
}
