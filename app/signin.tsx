import { login } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/GlobalContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect } from 'expo-router';
import React from 'react';
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Signin() {
  const { refetch,isloggedIn,loading } = useGlobalContext()

  if(!loading && isloggedIn) return <Redirect href={'/'} />

  const handleLogin = async() => {
    try {

      const result = await login()

      if(result){
        refetch();
      } else {
        Alert.alert('Error','Failed to login')
      }
      
    } catch (error) {
      console.log('Issue Occured while logging in', error)
    }
  }

  return (
    <SafeAreaView className="min-h-screen bg-accent-100">
      <ScrollView contentContainerClassName='max-h-screen bg-accent-100'>
        <View className='relative'>
          <Image source={require('@/assets/onboardingimage/2.jpg')} resizeMode='cover' className='max-h-screen w-full opacity-20'/>
        </View>
        <View className='absolute mt-10 px-7'>
          <View className='flex flex-col items-center min-h-screen'>
            <Text className='text-lg py-4 font-rubik-bold'>Login to get Started .</Text>
            <Image source={require('@/assets/onboardingimage/foodImage2.jpg')} className='size-96 rounded-2xl' />
            <View className='flex flex-col gap-6 items-center justify-center mt-20'>
              <Text className='text-2xl text-black-DEFAUlt font-rubik-bold'>Welcome to trackbite</Text>
              <View className='flex flex-col items-center justify-center mt-8'>
                <Text className='text-lg text-black-DEFAUlt opacity-60 font-rubik-medium'>Every bite matters – track it !</Text>
                <Text>Your pocket-sized nutritionist, always on hand.</Text>
              </View>
            </View>
            <TouchableOpacity className='mt-20 flex flex-col items-center' onPress={handleLogin}>
              <View className='bg-black-DEFAUlt px-16 py-3 flex flex-row justify-center items-center rounded-lg gap-2'>
                <Text className='text-accent-100 text-lg'>Login with google</Text>
                <Ionicons name={"logo-google"} size={17} color={'#fff'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
