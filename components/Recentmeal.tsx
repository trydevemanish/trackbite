import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

type props = {
  foodname? : string,
  calorie? : number,
  foodImageUrl? : any,
  uploadedon? : string,
  onPress: () => void,
  deleteMeal?: () => void
}


const Recentmeal = ({onPress,deleteMeal,foodname,foodImageUrl,calorie,uploadedon}:props) => {

  function trimText(length:number,text:string){
    if(text.length < length){
      return text;
    }

    return text.substring(0,length)+'...';
  }

  return (
    <View className='flex flex-row items-start justify-between w-full bg-[#ffffff] shadow-xl shadow-[#ffffff] rounded-2xl p-3'>
        <TouchableOpacity onPress={() => onPress()}>
          <View className='flex flex-row items-start gap-4'>
              <Image source={foodImageUrl ? {uri:foodImageUrl} : require('@/assets/onboardingimage/2.jpg')} className='size-24 rounded-lg'/>
              <View className='flex flex-col items-start gap-5'>
                  <Text className='text-lg font-rubik-medium'>{foodname? trimText(20,foodname) : 'Item Name'}</Text>
                  <View className='flex flex-col items-start'>
                    <Text className='text-base opacity-80 font-rubik-light text-black-DEFAUlt'>Calorie - {calorie? `${calorie} g`: '0g' }</Text>
                    <Text className='text-base opacity-80 font-rubik-light text-black-DEFAUlt'>{uploadedon ? uploadedon : 'monday, 10 june'}</Text>
                  </View>
              </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteMeal}>
          <Image source={require('@/assets/icons/delete.png')} className='size-5' />
        </TouchableOpacity>
    </View>
  )
}

export default Recentmeal