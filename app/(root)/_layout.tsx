import { useGlobalContext } from "@/lib/GlobalContext";
import { router, Slot } from "expo-router";
import { ActivityIndicator, SafeAreaView } from "react-native";

export default function AppLayout(){
    const { isloggedIn,loading } = useGlobalContext()

    if(loading){
        return (
            <SafeAreaView className="bg-accent-100 h-full flex justify-center items-center">
                <ActivityIndicator className="text-primary-300" size={'large'} />
            </SafeAreaView>
        )
    }

    if(!isloggedIn){
        router.push('/signin')
    };

    return <Slot />
}