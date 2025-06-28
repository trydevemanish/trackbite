// this page will use ai feature and look up your daily report and tell what you should do to overcome it ..

// we will reach to this page from the (load more) button of the today report page.

import useDataStore from '@/utils/usestore';
import Groq from "groq-sdk";
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Activity = {
  activity: string;
  time: string;
};

type ActivitiesByIntensity = {
  light: Activity[];
  moderate: Activity[];
  intense: Activity[];
};

type CountdownProps = {
  initialSeconds: number;
  onFinish: () => void;
};

const Whatyoushoulddo = () => {
  const passingCalorieDataToAiModel = useDataStore(state => state.passingCalorieDataToAiModel)
  const groq = new Groq({ apiKey:process.env.EXPO_PUBLIC_GROK_API_KEY });
  const [userWeight,setUserWeight] = useState('56')
  const [userAge,setUserAge] = useState('24')
  const [activeTimer, setActiveTimer] = useState<{
    activity: string;
    remaining: number;
  } | null>(null);

  const systemPrompt = `You are a fitness and nutrition assistant. Your role is to suggest personalized activity options to help users burn a specific amount of calories.

  You will receive:
  - The calorie amount to burn.
  - The user's weight in kilograms.
  - The user's age in years.

  Your task:
  - Calculate the estimated time to burn the provided calories for different activities: walking, running, swimming, cycling, yoga, and HIIT.
  - Adjust the burn rate based on the user's weight and age.
  - Show time estimates for each activity in minutes, rounded to the nearest 5 minutes.
  - Group the activities by intensity:
    • Light: Walking, Yoga
    • Moderate: Cycling, Swimming
    • Intense: Running, HIIT

  Output Format (JSON):
  {
    "light": [
      { "activity": "Walking", "time": "XX minutes" },
      { "activity": "Yoga", "time": "XX minutes" }
    ],
    "moderate": [
      { "activity": "Cycling", "time": "XX minutes" },
      { "activity": "Swimming", "time": "XX minutes" }
    ],
    "intense": [
      { "activity": "Running", "time": "XX minutes" },
      { "activity": "HIIT", "time": "XX minutes" }
    ]
  }

  Be concise, return only the JSON object.

  Assume average MET (Metabolic Equivalent of Task) values unless user-specific adjustments are required.`;

  const calorie = 3478;
  console.log('passingCalorieDataToAiModel',passingCalorieDataToAiModel)
  const data: ActivitiesByIntensity = {
  light: [
    { activity: "Walking", time: "735 minutes" },
    { activity: "Yoga", time: "870 minutes" }
  ],
  moderate: [
    { activity: "Cycling", time: "235 minutes" },
    { activity: "Swimming", time: "255 minutes" }
  ],
  intense: [
    { activity: "Running", time: "130 minutes" },
    { activity: "HIIT", time: "110 minutes" }
  ]
};

const startTimer = (activity: string, minutesStr: string) => {
    const minutes = parseInt(minutesStr);
    setActiveTimer({
      activity,
      remaining: minutes * 60 // convert to seconds
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  function CountdownTimer({ initialSeconds, onFinish }: CountdownProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  React.useEffect(() => {
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
    <Text className="text-2xl font-semibold">
      {m}m {s}s
    </Text>
  );
}

  async function GenerateSomeHelpsfullsuggesstion(){
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
            User weight: 60 kg
            User Age: 24
          `,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const response = completion.choices[0]?.message?.content

    console.log('response',response)
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
                <Text className='font-medium text-lg'>User weight: {userWeight} kg</Text>
                <Text className='font-medium text-lg'>User Age: {userAge}</Text>
                <TouchableOpacity className='bg-black-DEFAUlt py-1 mt-2 rounded-xl'>
                  <Text className='text-base text-accent-100 text-center font-rubik-medium px-4 py-2'>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className='py-4'>
            <Text>
              You can follow these steps to loose calorie
            </Text>
          </View>

          <View className="flex-1 p-4 bg-white">
      {(["light", "moderate", "intense"] as const).map((level) => (
        <View key={level} className="mb-6">
          <Text className="text-xl font-bold mb-2 capitalize text-[#333]">
            {level} Intensity
          </Text>
          {data[level].map((item) => (
            <View
              key={item.activity}
              className="flex flex-row justify-between items-center bg-gray-100 p-3 mb-2 rounded-xl shadow"
            >
              <View>
                <Text className="text-lg font-semibold text-[#222]">
                  {item.activity}
                </Text>
                <Text className="text-gray-600">{item.time}</Text>
              </View>
              <TouchableOpacity
                onPress={() => startTimer(item.activity, item.time)}
                className="bg-blue-500 px-3 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">Start Timer</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}

      {/* Timer Modal */}
      <Modal visible={!!activeTimer} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="bg-white p-6 rounded-2xl w-80 items-center">
            {activeTimer && (
              <>
                <Text className="text-xl font-bold mb-2">
                  {activeTimer.activity}
                </Text>
                <CountdownTimer
                  initialSeconds={activeTimer.remaining}
                  onFinish={() => setActiveTimer(null)}
                />
                <TouchableOpacity
                  onPress={() => setActiveTimer(null)}
                  className="mt-4 bg-red-500 px-4 py-2 rounded-lg"
                >
                  <Text className="text-white font-medium">Stop Timer</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );


        </View>
      </ScrollView>
    </SafeAreaView> 
  )
}

export default Whatyoushoulddo