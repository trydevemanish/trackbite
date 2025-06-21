import React, { useRef } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Addingpeice(
  {
    selectedMealQuantity,
    setSelectedMealTypeQuantity
  }:{
    selectedMealQuantity:number  | undefined ,
    setSelectedMealTypeQuantity:React.Dispatch<React.SetStateAction<number | undefined>>
  }) {
    const count = useRef(0);

    const increaeCount = async() => {
        count.current += 1;
        setSelectedMealTypeQuantity(count.current)
    }

    const decreaeCount = async() => {
        count.current -= 1;
        setSelectedMealTypeQuantity(count.current)
    }

  return (
    <View className="flex flex-row items-center justify-center space-x-4 p-2 bg-[#fff] shadow shadow-[#fff] rounded-lg ">
      <TouchableOpacity onPress={decreaeCount} className="px-2">
        <Text className="text-black text-2xl">-</Text>
      </TouchableOpacity>

      <Text className="text-xl font-rubik-bold min-w-[24px] text-center">
        {selectedMealQuantity}
      </Text>

      <TouchableOpacity onPress={increaeCount} className=" px-2">
        <Text className="text-black text-2xl">+</Text>
      </TouchableOpacity>
    </View>
  )
}