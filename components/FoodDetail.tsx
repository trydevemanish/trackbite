import { FoodDetailInterface } from '@/types/type';
import React from 'react';
import { Image, Text, View } from 'react-native';

const FoodDetail = ({foodDetail}:{foodDetail? : FoodDetailInterface | null}) => {
  return (
    <View className='flex flex-row item-center justify-between mt-2'>

      <View className='flex flex-row items-start bg-[#fff] min-w-28  w-auto rounded-xl px-4 py-6'>
        <View className='flex flex-col items-start gap-3'>
          <Text className='text-xl font-rubik-medium text-black-DEFAUlt'>{foodDetail?.protein?.value ? `${foodDetail.protein.value} ${foodDetail?.protein?.unit}` : '0g' }</Text>
          <Text className='text-sm opacity-85'>Protein</Text>
        </View>
        <Image source={require('@/assets/icons/protein.png')} className='size-7' />
      </View>

      <View className='flex flex-row items-start bg-[#fff] min-w-[120px] gap-3  w-auto rounded-xl px-4 py-6'>
        <View className='flex flex-col items-start gap-3'>
          <Text className='text-xl font-rubik-medium text-black-DEFAUlt'>{foodDetail?.carbs?.value ? `${foodDetail.carbs.value} ${foodDetail?.carbs?.unit}` : '0g' }</Text>
          <Text className='text-sm opacity-85'>Carbs</Text>
        </View>
        <Image source={require('@/assets/icons/carbohydrate.png')} className='size-7' />
      </View>

      <View className='flex flex-row items-start bg-[#fff] min-w-28  w-auto gap-4 rounded-xl px-4 py-6'>
        <View className='flex flex-col items-start gap-3'>
          <Text className='text-xl font-rubik-medium text-black-DEFAUlt'>{foodDetail?.fat?.value ? `${foodDetail.fat.value} ${foodDetail?.fat?.unit}` : '0g' }</Text>
          <Text className='text-sm opacity-85'>Fats</Text>
        </View>
        <Image source={require('@/assets/icons/fiber.png')} className='size-7' />
      </View>

    </View>
  )
}

export default FoodDetail