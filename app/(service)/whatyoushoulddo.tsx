// this page will use ai feature and look up your daily report and tell what you should do to overcome it ..
// we will reach to this page from the (load more) button of the today report page.

import Cycling from '@/assets/icons/cycling.png';
import Running from '@/assets/icons/running.png';
import Swimming from '@/assets/icons/swimming.png';
import Walking from '@/assets/icons/walking.png';
import Yoga from '@/assets/icons/yoga.png';
import { systemPrompt } from '@/constant/data';
import useDataStore from '@/utils/usestore';
import Groq from "groq-sdk";
import React, { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Activity = {
  activity: string;
  time: string;
  icon : any;
};

type ActivitiesByIntensity = {
  Light: Activity[];
  Moderate: Activity[];
  Intense: Activity[];
};

type CountdownProps = {
  initialSeconds: number;
  onFinish: () => void;
};

const Whatyoushoulddo = () => {
  const passingCalorieDataToAiModel = useDataStore(state => state.passingCalorieDataToAiModel)
  const groq = new Groq({ apiKey:process.env.EXPO_PUBLIC_GROK_API_KEY });
  const [showEditPage,setShowEditPage] = useState(false)
  const [userWeight,setUserWeight] = useState('56')
  const [userAge,setUserAge] = useState('24')
  const [receivedDataFromAi,SetReciviedDataFromAi] = useState({} as ActivitiesByIntensity)
  const [showReceivedDataToUser,setShowReceivedDataToUser] = useState(false)

  const [activeTimer, setActiveTimer] = useState<{
    icon : any;
    activity: string;
    remaining: number;
  } | null>(null);

  const calorie = passingCalorieDataToAiModel;

  const data: ActivitiesByIntensity = {
    Light: [
      { activity: receivedDataFromAi?.Light[0]?.activity, time: receivedDataFromAi?.Light[0]?.time, icon: Walking },
      { activity: receivedDataFromAi?.Light[1]?.activity, time: receivedDataFromAi?.Light[1]?.time, icon: Yoga }
    ],
    Moderate: [
      { activity: receivedDataFromAi?.Moderate[0]?.activity, time: receivedDataFromAi?.Moderate[0]?.time, icon: Cycling },
      { activity: receivedDataFromAi?.Moderate[1]?.activity, time: receivedDataFromAi?.Moderate[1]?.time, icon: Swimming }
    ],
    Intense: [
      { activity: receivedDataFromAi?.Intense[0]?.activity, time: receivedDataFromAi?.Intense[0]?.time, icon: Running },
      { activity: receivedDataFromAi?.Intense[1]?.activity, time: receivedDataFromAi?.Intense[1]?.time, icon: Walking }
    ]
  };

  const startTimer = (icon:any,activity: string, minutesStr: string) => {
    const minutes = parseInt(minutesStr);
    setActiveTimer({
      icon,
      activity,
      remaining: minutes * 60 
    });
  };

  function CountdownTimer({ initialSeconds, onFinish }: CountdownProps) {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {

      if (seconds <= 0) {
        onFinish();
        return;
      }

      const interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);

      return () => clearInterval(interval);
    }, [seconds]);

    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return (
      <Text className="text-xl font-semibold">
        {m}m {s}s
      </Text>
    );
  }

  function filterdata(input: string): ActivitiesByIntensity | null {

    const regex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
    const match = input.match(regex);

    let jsonString: string;

    if (match && match[1]) {
      jsonString = match[1];
    } else {
      jsonString = input;
    }

    try {

      const parsed = JSON.parse(jsonString.trim());
      return parsed as ActivitiesByIntensity;

    } catch (error) {
      console.error("Invalid JSON:", error);
      return null;
    }
  }

  async function GenerateSomeHelpsfullsuggesstion(){
    try {

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `
              Calorie amount to burn: ${calorie}
              User weight: ${userWeight} kg
              User Age: ${userAge}
            `,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });
  
      const response = completion.choices[0]?.message?.content
  
      if(!response){
        throw new Error('Response dose not receivied')
      }
  
      const dataFromai = filterdata(response!);
  
      if(!dataFromai){
        throw new Error('Error in Filtering the received data')
      }
  
      SetReciviedDataFromAi(dataFromai)

      setShowReceivedDataToUser(true)
  
    } catch (error) {
      throw new Error(`Failed in Generatinng response: ${error}`)
    }
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View className='px-6 py-6'>

          <View>
            <View className='bg-[#d0c264] rounded-xl '>
              <Text className='text-base font-rubik-medium text-accent-100 pl-4 py-4'>! This content is generated with Ai.</Text>
            </View>
            <View className='border border-black-DEFAUlt p-3 mt-2 rounded-xl'>
              <View className='flex flex-col p-1 gap-3'>
                <Text className='font-medium text-lg'>Calorie amount to burn: {calorie} kcal. </Text>

                <View className='flex flex-row items-center justify-between py-1'>
                  <Text className='font-medium text-lg'>User weight: {userWeight} kg</Text>
                  <TouchableOpacity onPress={() => setShowEditPage(true)}>
                    <Image source={require('@/assets/icons/edit.png')} className='size-5'  />
                  </TouchableOpacity>
                </View>

                <View className='flex flex-row items-center justify-between py-1'>
                  <Text className='font-medium text-lg'>User Age: {userAge}</Text>
                  <TouchableOpacity onPress={() => setShowEditPage(true)}>
                    <Image source={require('@/assets/icons/edit.png')} className='size-5'  />
                  </TouchableOpacity>
                </View>

                {/* <Text className='font-medium text-lg'>User Age: {userAge}</Text> */}
                <TouchableOpacity className='bg-black-DEFAUlt py-1 mt-2 rounded-xl' onPress={GenerateSomeHelpsfullsuggesstion}>
                  <Text className='text-base text-accent-100 text-center font-rubik-medium px-4 py-2'>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className='py-6'>
            <Text>
              You can follow these steps to loose calorie according to your intensity...
            </Text>
          </View>

          {
            showReceivedDataToUser &&
             
            <View className="flex-1 py-4">
            {(["Light", "Moderate", "Intense"] as const).map((level) => (
              <View key={level} className="mb-6">
                
                <Text className="text-lg font-medium py-3 mb-2 text-[#333]">
                  {level} intensity workout you can prefer.
                </Text>

                {data[level].map((item) => (
                  <View
                    key={item.activity}
                    className="flex flex-row justify-between p-3 rounded-md bg-[#fff] shadow-md items-center mb-2"
                  >
                    <View className='flex flex-row items-center gap-2 '>
                      <Image source={item?.icon} className='size-5' />
                      <Text className="text-lg font-semibold text-[#222]">
                        {item.activity}
                      </Text>
                    </View>
                    <Text className="font-rubik-medium">{item.time}</Text>
                    <TouchableOpacity
                      onPress={() => startTimer(item.icon,item.activity, item.time)}
                      className="bg-[#35c863] px-3 py-2 rounded-lg"
                    >
                      <Text className="text-[#fff] text-sm px-2 font-medium">Start</Text>
                    </TouchableOpacity>
                  </View>
                ))}

              </View>
            ))}

            {/* Timer Modal */}
              <Modal visible={!!activeTimer} transparent animationType="slide">
                <View className="flex-1 justify-center items-center bg-black-DEFAUlt/60">
                  <View className="bg-[#fff] p-6 rounded-2xl w-80">
                    {activeTimer && (
                      <View className='flex flex-col gap-2 p-1'>
                        <View className='flex flex-row gap-2 items-start'>
                          <Image source={activeTimer?.icon} className='size-6' />
                          <Text className="text-lg font-bold mb-2">
                            {activeTimer.activity}
                          </Text>
                        </View>
                        <Text>Time Remaining...</Text>
                        <View className='flex flex-row items-center justify-center py-3'>
                          <CountdownTimer
                            initialSeconds={activeTimer.remaining}
                            onFinish={() => setActiveTimer(null)}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => setActiveTimer(null)}
                          className="bg-red-500 bg-danger rounded-lg"
                        >
                          <Text className="text-[#fff] py-2 text-center font-medium">Stop Timer</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </Modal>

              {
                showEditPage && 
                <Modal transparent animationType="slide">
                  <View className="flex-1 justify-center items-center bg-black-DEFAUlt/60">
                    <View className="bg-[#fff] p-6 rounded-2xl w-80">
                      <Text>Edit Your stats here...</Text>

                        <View className='pt-5'>
                          <Text className='font-rubik-medium text-center'>Your Weight: </Text>
                          <TextInput value={userWeight} onChangeText={(weight) => setUserWeight(weight)} className='border-black-DEFAUlt rounded border my-2 px-2' />
                        </View>
                        <View className='pt-3'>
                          <Text className='font-rubik-medium text-center'>Your Age: </Text>
                          <TextInput value={userAge} onChangeText={(age) => setUserAge(age)} className='border-black-DEFAUlt rounded border my-2 px-2' />
                        </View>
                      
                      <View className='py-2 flex flex-row items-center '>
                          <TouchableOpacity onPress={() => setShowEditPage(false)} className='bg-[#41b867] w-full shadow-2xl shadow-[#fff] rounded-xl px-9 py-4'>
                              <Text className='text-accent-100 font-rubik-medium text-center'>Submit</Text>
                          </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
              }

            </View>
          }

        </View>
      </ScrollView>
    </SafeAreaView> 
  )
}

export default Whatyoushoulddo