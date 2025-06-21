// this page will use ai feature and look up your daily report and tell what you should do to overcome it ..

// we will reach to this page from the (load more) button of the today report page.

import useDataStore from '@/utils/usestore';
import Groq from "groq-sdk";
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Whatyoushoulddo = () => {
  const passingCalorieDataToAiModel = useDataStore(state => state.passingCalorieDataToAiModel)
  const groq = new Groq({ apiKey:process.env.EXPO_PUBLIC_GROK_API_KEY });

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


  async function GenerateSomeHelpsfullsuggesstion(){
    return groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `You have Gained this much calorie till now ${passingCalorieDataToAiModel}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_completion_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: true,
    });
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View className='px-6 py-10'>
          <Text>This is a page for the suggestiion with the Ai</Text>
        </View>
      </ScrollView>
    </SafeAreaView> 
  )
}

export default Whatyoushoulddo