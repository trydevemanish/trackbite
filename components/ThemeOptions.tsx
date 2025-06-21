import Dark from "@/assets/icons/dark.png";
import Homeicon from "@/assets/icons/home.png";
import Light from "@/assets/icons/light.png";
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';

interface ThemeOptionsInterfacce {
    id: number,
    title : string,
    icon : any
}

const themeoptiondata = [
  {
    id:1,
    title : 'Automatic',
    icon : Homeicon
  },
  {
    id:2,
    title : 'Dark',
    icon : Dark
  },
  {
    id:3,
    title : 'Light',
    icon : Light
  }
]

const ThemeOptions = () => {
  const [value,setValue] = useState("Default")

  console.log(value)
  return (
    <View>
        {
          themeoptiondata.map((data : ThemeOptionsInterfacce) => (
            <View className='flex flex-row items-center justify-between w-full rounded-xl px-6 py-2' key={data?.id}>
              <Image source={data?.icon} className='size-6' />
              <Text className='text-lg font-rubik-medium'>{data.title}</Text>
              <RadioButton
                value={value}
                onPress={() => setValue(data?.title)}
                color="purple"
                key={data?.id}
                status={value === data?.title ? 'checked' : 'unchecked'}
              />
            </View>
          ))
        }
    </View>
  )
}

export default ThemeOptions