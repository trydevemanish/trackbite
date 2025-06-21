import Reminder from '@/assets/icons/reminder.png';
import RightArrow from "@/assets/icons/rightarrow.png";
import Scan from '@/assets/icons/scan.png';
import Refer from "@/components/Refer";
import { logout } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/GlobalContext';
import * as Notifications from 'expo-notifications';
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, Image, ImageSourcePropType, ScrollView, StatusBar, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingItemsProps {
  icon : ImageSourcePropType;
  title : string;
  onPress? : () => void;
  textStyle? : string;
  showArrow? : boolean;
  showSwitch? : boolean;
}

type usefullServiceType = {
  title : string,
  scan : any,
  handleFunction : any
}

export default function Profile() {
  const { isloggedIn,user, refetch } = useGlobalContext();
  const [notitficationId,setNotificartionId] = useState('');
  const [startWaterNotification,setStartWaterNotification] = useState(false)

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

  const usefullService = [
    {
      'title' : 'scan',
      'scan' : Scan,
      'handleFunction' : () => router.push('/scan')
    },
    {
      'title' : 'Reminder to drink water',
      'scan' : Reminder,
      'handleFunction' : () => console.log('remonder')
    }
  ]

  const Settingitems = ({icon,title,onPress,textStyle,showArrow=true,showSwitch=false} : SettingItemsProps) => (
    <TouchableOpacity onPress={onPress} className='flex flex-row items-center justify-between py-3 bg-[#056tg4] '>
      <View className='flex flex-row items-center gap-3'>
        <Image source={icon} className='size-6'/>
        <Text className={`text-lg font-rubik-medium text-black-DEFAUlt ${textStyle}`}>{title}</Text>
      </View>

      {showArrow && <Image source={RightArrow} className='size-5' />}
      {showSwitch && <Switch value={startWaterNotification} onValueChange={() => setStartWaterNotification(prev => !prev)} /> }
    </TouchableOpacity>
  )

  useEffect(() => {
    if(startWaterNotification){
      toHandleWaterReminderNotification()
    } else {
      cancelWaterReminder(notitficationId)
    }
  },[])

  // to start the reminder notificaiton
  async function toHandleWaterReminderNotification(){
    const notificationIdFromExpoNotification = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hydrate!',
        body: 'Time to drink some water!',
        sound: true, // Optional
        sticky :false,
      },
      trigger: {
        second  : 6 * 60 * 60 ,
        repeats: true,
      } as Notifications.NotificationTriggerInput,
    });

    setNotificartionId(notificationIdFromExpoNotification)
  }

  // to cancel the notificaiton 
  async function cancelWaterReminder(notificationId:string) {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  }

  return (
    <SafeAreaView className='h-full'>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerClassName='pb-32 px-7'
      >
        <StatusBar backgroundColor={'#000'}   />
        <View className='flex flex-row justify-between items-center mt-10 '>
          <TouchableOpacity onPress={() => router.back()}>
              <View className="flex flex-row items-center gap-3">
                <Image source={require("@/assets/icons/back.png")} className='size-5'/>
                <Text className='text-lg font-rubik-light'>Back</Text>
              </View>
          </TouchableOpacity>
        </View>

        <View className="mt-8">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-start gap-6">
              <Image source={{ uri:user?.avatar }} className='size-20 rounded-xl' />
              <View className="flex flex-col gap-4 py-2">
                <Text className='text-xl font-rubik-medium'>{  isloggedIn? user?.name :'Adrain | JSM'}</Text>
                <Text className='text-sm'>{  isloggedIn? user?.email :'example@gmail.com'}</Text>
              </View>
            </View>
            <Image source={require('@/assets/icons/edit.png')} className="size-6" />
          </View>
        </View>

        <View className="mt-14">
          <Refer />
        </View>

        <View className="mt-5 bg-[#fff] shadow-lg shadow-[#fff] rounded-xl px-4">
            <Settingitems icon={require('@/assets/icons/logout.png')} title='Logout' textStyle='text-danger' showArrow={false} onPress={handleLogout} />
        </View>

        <View className="mt-6 bg-[#fff] shadow-lg shadow-[#fff] rounded-xl">
            <View className="flex flex-col items-start px-4">
              {usefullService.map((data: usefullServiceType,index:number) => (
                <Settingitems key={index} onPress={data?.handleFunction} icon={data?.scan} showSwitch={true} title={data?.title} showArrow={false} />
              ))}
            </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}