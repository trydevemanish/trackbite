import * as Linking from 'expo-linking'
import { openAuthSessionAsync } from 'expo-web-browser'
import { Account, Avatars, Client, OAuthProvider, Storage } from "react-native-appwrite"

export const config = {
    platform : 'com.jsm.trackbite',
    endpoint : process.env.EXPO_PUBLIC_APPWRITE_END_POINT,
    projectId : process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    storageid : process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID,
}

export const client = new Client()

client
    .setEndpoint(config.endpoint!)
    .setPlatform(config.platform!)
    .setProject(config.projectId!)


export const avatar = new Avatars(client);
export const account = new Account(client);
export const storage = new Storage(client);


// all the login, logout controller function will be here.

export async function login(){
    try {

        const redirectUri = Linking.createURL('/');

        const response = await account.createOAuth2Token(OAuthProvider.Google,redirectUri);

        if(!response) throw new Error('Failed to login');
        
        const browerResult = await openAuthSessionAsync(
            response.toString(),
            redirectUri
        );

        if(browerResult.type != 'success') throw new Error('failed to login');

        const url = new URL(browerResult.url);

        const secret = url.searchParams.get('secret')?.toString();

        const userid = url.searchParams.get('userId')?.toString();

        if(!secret || !userid) throw new Error('failed to login,no userid and sceret');

        const session = await account.createSession(userid,secret);

        if(!session) throw new Error('failed to create login session');

        return true;

    } catch (error) {
        console.error(error)
        return false
    }
}

export async function logout(){
   try {

        await account.deleteSession('current');

        return true;
        
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function getCurrentUser(params: Record<string, never>){
    try {

        const response = await account.get();

        if(response?.$id){
            const userAvatar = avatar.getInitials(response.name);

            return {
                ...response,
               avatar: userAvatar?.toString(),
            }
        }
        
    } catch (error) {
        console.error(error);
        return false;
    }

    return null;
}
