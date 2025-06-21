import React from 'react'
import { View } from 'react-native'

export default function Scanner() {
  return (
    <View className="relative w-[300px] h-[300px]">
      <View className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-accent-100 rounded-t-md rounded-r-none" />
      <View className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-accent-100 rounded-t-md rounded-l-none" />
      <View className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-accent-100 rounded-b-md rounded-l-none rounded-t-none" />
      <View className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-accent-100 rounded-b-md rounded-r-none" />
    </View>
  )
}