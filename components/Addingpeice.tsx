import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Addingpeice(
  {
    selectedMealQuantity,
    setSelectedMealTypeQuantity
  }:{
    selectedMealQuantity:number  | undefined ,
    setSelectedMealTypeQuantity:React.Dispatch<React.SetStateAction<number | undefined>>
  }) {

    const increaeCount = async() => {
        setSelectedMealTypeQuantity(prev => (prev ?? 0) + 1)
    }

    const decreaeCount = async() => {
        setSelectedMealTypeQuantity(prev => (prev ?? 0) - 1)
    }

  return (
    <View className="flex flex-row items-center justify-center space-x-4 p-2 bg-[#fff] shadow shadow-[#fff] rounded-lg ">
      <TouchableOpacity onPress={decreaeCount} className="px-2">
        <Text className="text-black text-2xl">-</Text>
      </TouchableOpacity>

      <Text className="text-xl font-rubik-bold min-w-[24px] text-center">
        {selectedMealQuantity ?? 0}
      </Text>

      <TouchableOpacity onPress={increaeCount} className=" px-2">
        <Text className="text-black text-2xl">+</Text>
      </TouchableOpacity>
    </View>
  )
}