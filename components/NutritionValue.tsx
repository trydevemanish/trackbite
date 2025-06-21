import { FoodDetailInterface } from '@/types/type';
import React from 'react';
import { Image, Text, View } from 'react-native';
import FoodDetail from './FoodDetail';


// because i know what i am going to pass here,
export default function NutritionValue({foodDetail}:{foodDetail? : FoodDetailInterface | null}) {
  return (
    <View className='flex flex-col'>
        <View className="flex flex-row items-center justify-between bg-[rgb(255,255,255)] px-9 shadow-[#ffffff] shadow-2xl py-6 rounded-2xl w-full">
            <View className="flex flex-col items-start gap-2">
                <Text className="text-center text-4xl font-rubik-light text-black-DEFAUlt">{foodDetail?.calories?.value ? `${foodDetail.calories.value} ${foodDetail?.calories?.unit}` : '0g' }</Text>
                <Text className="text-lg">Calorie burn</Text>
            </View>
            <View className="border-black-DEFAUlt border rounded-full p-6">
                <Image source={require('@/assets/icons/calorie.png')} className="size-6" />
            </View>
        </View>
        <FoodDetail foodDetail={foodDetail} />
    </View>
  )
}