import Refer from "@/components/Refer";
import { logout } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/GlobalContext';
import { router } from "expo-router";
import React from 'react';
import { Alert, Image, ImageSourcePropType, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingItemsProps {
  icon : ImageSourcePropType;
  title : string;
  onPress? : () => void;
  textStyle? : string;
}


export default function Profile() {
  const { isloggedIn,user, refetch } = useGlobalContext();

  const handleLogout = async() => {
    const result = await logout()

    if(result){
      Alert.alert('sucess','User Logout successfully..')
      router.push('/signin')
      refetch()
    } else {
      Alert.alert('error','An error occured while logging out ..')
    }
  }

  const Settingitems = ({icon,title,onPress,textStyle} : SettingItemsProps) => (
    <TouchableOpacity onPress={onPress} className='flex flex-row items-center justify-between w-full py-2 bg-[#056tg4] '>
      <View className='flex flex-row items-center gap-3'>
        <Image source={icon} className='size-6'/>
        <Text className={`text-lg font-rubik-medium text-black-DEFAUlt ${textStyle}`}>{title}</Text>
      </View>
    </TouchableOpacity>
  )



  return (
    <SafeAreaView className='h-full'>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerClassName='pb-32 px-7'
      >
        <View className='flex flex-row justify-between items-center mt-10 '>
          <TouchableOpacity onPress={() => router.back()}>
              <View className="flex flex-row items-center gap-3">
                <Image source={require("@/assets/icons/back.png")} className='size-5'/>
                <Text className='text-lg font-rubik-medium'>Back</Text>
              </View>
          </TouchableOpacity>
        </View>

        <View className="mt-10">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-start gap-6">
              <Image source={{ uri:user?.avatar }} className='size-20 rounded-xl' />
              <View className="flex flex-col gap-4 py-2">
                <Text className='text-xl font-rubik-medium'>{  isloggedIn? user?.name :'Adrain | JSM'}</Text>
                <Text className='text-sm'>{  isloggedIn? user?.email :'example@gmail.com'}</Text>
              </View>
            </View>
            {/* <Image source={require('@/assets/icons/edit.png')} className="size-6" /> */}
          </View>
        </View>

        <View className="mt-14">
          <Refer />
        </View>

        <View className="mt-5 bg-[#fff] shadow-lg shadow-[#fff] rounded-xl px-4">
            <Settingitems icon={require('@/assets/icons/logout.png')} title='Logout' textStyle='text-danger' onPress={handleLogout} />
            <Settingitems icon={require('@/assets/icons/scan.png')} title='Scan'  onPress={() => router.push('/signin')} />
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}