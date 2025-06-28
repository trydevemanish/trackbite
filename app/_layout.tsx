import ThemeProvider from '@/context/ThemeContext';
import GlobalProvider from "@/lib/GlobalContext";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from 'react-native';
import './global.css';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Rubik-Bold" : require('../assets/fonts/Rubik-Bold.ttf'),
    "Rubik-ExtraBold" : require('../assets/fonts/Rubik-ExtraBold.ttf'),
    "Rubik-Light" : require('../assets/fonts/Rubik-Light.ttf'),
    "Rubik-Medium" : require('../assets/fonts/Rubik-Medium.ttf'),
    "Rubik-Regular" : require('../assets/fonts/Rubik-Regular.ttf'),
    "Rubik-SemiBold" : require('../assets/fonts/Rubik-SemiBold.ttf'),
  })

  // const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {

    if(fontsLoaded){
      SplashScreen.hideAsync()
    }

  },[fontsLoaded])

  // useEffect(() => {
  //   const loadInitialRoute = async () => {
  //     const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
  //     setInitialRoute(hasSeen === 'true' ? '(root)/(tabs)/home' : 'onboarding');
  //   };

  //   loadInitialRoute();
  // },[])

  // if(!initialRoute) return null;

  if(!fontsLoaded) return null; 

  return (
    <ThemeProvider>
      <GlobalProvider>
        <StatusBar backgroundColor={'#000'}   />
        {/* <Stack screenOptions={{ headerShown : false }} initialRouteName={initialRoute} /> */}
        <Stack screenOptions={{ headerShown : false }} />
      </GlobalProvider>
    </ThemeProvider>
  );
}
  