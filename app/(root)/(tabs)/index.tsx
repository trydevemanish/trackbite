import NutritionValueforArrayInput from "@/components/NutritionValueforArrayInput";
import Recentmeal from "@/components/Recentmeal";
import Skeleton from "@/components/Skeleton";
import { dummyMealData } from "@/constant/data";
import { ThemeContext } from "@/context/ThemeContext";
import { useGlobalContext } from "@/lib/GlobalContext";
import { mealDataType } from '@/types/type';
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter()
  const { currentTheme,toggleTheme } = useContext(ThemeContext);
  // this state is used for the state of data received from calling this fetchlatestmeal method.
  const [mealData,setMealData] = useState<mealDataType[] | null>(null)
  const [loading,setLoading] = useState<boolean>(false)
  const { user,refetch } = useGlobalContext()

  useEffect(() => {

    const fetchLatestMeal = async() => {
      try {

        setLoading(true)

        const res  = await fetch(`${process.env.EXPO_PUBLIC_CALL_BACKEND_API}/meal/latest`,{
          method : 'POST',
          headers : {
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({ userid: user?.$id })   
        })
        
        if(!res){
          throw new Error('Response invalid') 
        }
        
        const data = await res.json()

        setMealData(data?.data)

      } catch (error) {
        console.error('Issue Occured fetching data',error)
      } finally {
        setLoading(false) 
      }
    }

    fetchLatestMeal() 
  },[])

  const handleCardPress = (id:string) => {
    router.push({
      pathname: "/singleMealReport/[id]",
      params: { id },
    });
  }
  
  return (
    <SafeAreaView>
      <ScrollView contentContainerClassName="pb-48 min-h-screen bg-accent-100" horizontal={false} showsVerticalScrollIndicator={false} >
        <View className={`${currentTheme == 'dark' ? 'bg-black-DEFAUlt text-accent-100' : 'bg-accent-100 text-black-DEFAUlt'}  min-h-screen px-6 py-4`}>

          <View className="flex flex-row items-center justify-between mt-5">
            <View className="flex flex-col items-start">
                <Text className={`font-rubik-medium text-xl ${currentTheme == 'dark' ?'text-accent-100' : 'text-black-DEFAUlt'} `}>Trackbite</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Image source={{ uri : user?.avatar }}  className="size-10 rounded-full" />
            </TouchableOpacity>
          </View>

          <View className="bg-[#fff] shadow-lg shadow-[#fff] rounded-2xl overflow-hidden mt-12">
            <Image source={require('@/assets/images/chicken.jpg')} className="w-fit object-cover h-32 relative" blurRadius={2} />
            <View className="absolute top-2 flex flex-col items-start justify-center gap-3 px-4 py-5">
              <Text className="font-rubik-bold text-lg text-[#fff] shadow-black-DEFAUlt shadow-xl">Track Your Meal Nutrition.</Text>
              <TouchableOpacity className="bg-[#35c863] rounded-xl" onPress={() => router.push('/scan')}>
                <Text className="px-4 py-2 font-rubik-medium text-[#fff]">Get started</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex flex-col items-start gap-1 mt-12">
            <Text className="text-xl font-rubik-medium">Hi {user?.name ? user.name : 'user'}</Text>
            <Text className="text-base font-rubik-light opacity-60">here's your latest uploaded meal nutrition info</Text>
          </View>

          {/* this shows the nutrition value .  */}
          <View className="py-9">
              {
                mealData ? 
                <View>
                  <NutritionValueforArrayInput mealData={mealData}  />
                  <View className="py-7 flex flex-row item-center gap-2">
                    <Image source={require('@/assets/icons/light.png')} className="size-7" />
                      <TouchableOpacity>
                        <Text className="font-rubik-medium text-lg text-[#35c863]">+ How you can lose this calorie ?</Text>
                      </TouchableOpacity>
                  </View>
                </View> : 
                <NutritionValueforArrayInput mealData={dummyMealData}  />
              }
          </View>

          <View className="mt-2">
            <View className="flex flex-row justify-between items-center">
              <Text className="font-rubik-medium text-black-DEFAUlt text-lg">Recent data.</Text>
              <TouchableOpacity onPress={() => router.push("/todayReport")}>
                <Text className="font-rubik-bold text-[#35c863] text-lg underline">See All</Text> 
              </TouchableOpacity>
            </View>
            <View className="py-9">
              {
                  loading ? 
                    [...Array(1)].map((_, index) => (
                      <Skeleton key={index} />
                    )) 
                  : 
                    (
                      Array.isArray(mealData) && mealData.length > 0 ?
                        (
                          mealData.map((data:mealDataType,index:number) => (
                            <View key={index}>
                              <Recentmeal onPress={() => handleCardPress(data?.$id)} foodname={data?.foodname} calorie={data?.calories} uploadedon={data?.timestamp} />
                              <View className="mt-7 relative">
                                <View className="flex flex-col items-center gap-2 mt-8">
                                  <Text>Track every bite, by scanning easily.</Text>
                                </View>
                                <Image source={require('@/assets/icons/arrow.png')} className="size-12 absolute right-[5rem] top-36" />
                              </View>
                            </View>
                          ))
                        ) :
                        (
                          <View>
                            <View className="flex flex-col items-center gap-2 mt-8">
                              <Text>No recent data share.</Text>
                              <Text>Start tacking your meal, by scanning easily.</Text>
                            </View>
                            <Image source={require('@/assets/icons/arrow.png')} className="size-12 absolute right-[5rem] top-36" />
                          </View>
                        )
                    )
                }
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}