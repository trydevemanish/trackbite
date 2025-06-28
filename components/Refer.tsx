import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

export default function Refer() {
  return (
    <View className='flex flex-col items-start gap-4 bg-[#fff] shadow-lg shadow-[#fff] rounded-xl overflow-hidden px-2 py-4'>
      <View className='flex flex-row item-center gap-3 pl-2'>
        <Image source={require('@/assets/icons/invite.png')} className='size-6' />
        <Text className='font-rubik-medium text-base'>Invite your friends</Text>
      </View>

      <View className='px-2'>
        <Image source={require('@/assets/images/chicken.jpg')} className='w-[22rem] rounded-xl object-cover h-44 relative' blurRadius={30}/>
        <View className='absolute top-3 px-4 flex flex-col item-start gap-3 left-4'>
            <View className='flex flex-col items-start justify-center gap-1 py-1'>
                <Text className='font-rubik-bold text-lg text-[#fff] shadow-black-DEFAUlt shadow-lg'>Live Peacefully With Your Loved One.</Text>
                <Text className='font-rubik-medium text-base text-[#fff]'>Be a yarr, help other with trackbite</Text>
            </View>
            <TouchableOpacity className='bg-[#35c863] rounded-xl self-start px-4 py-2'>
              <Text>Get started</Text>
            </TouchableOpacity>
        </View>
      </View>

      <View className='pl-2'>
        <Text className='font-rubik-medium text-base'>Track Every Bite....</Text>
      </View>

    </View>
  )
}