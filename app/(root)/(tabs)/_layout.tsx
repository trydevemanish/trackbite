import { Tabs } from 'expo-router'
import React from 'react'
import { Image, Text, View } from 'react-native'

const TabIcon = ({focused,icon,title,className} : {focused : boolean, icon: any, title?: string,className ?: string}) => (
    <View className='flex-1 mt-3 flex flex-col items-center'>
        <Image source={icon} tintColor={"#000000"} resizeMode='contain' className={`size-6 ${className}`} />
        <Text className={`${focused ? 
            'text-primary-300 font-rubik-medium' : 'text-black-DEFAUlt font-rubik'
        } text-[12px] w-full text-center mt-1 `}>{title}</Text>
    </View>
)

const TabsLayout = () => {
  return (
    <Tabs
        screenOptions={{
            tabBarShowLabel : false,
            tabBarStyle : {
                backgroundColor : 'white',
                position : 'absolute',
                minHeight : 70,
            }
        }}
    >
        <Tabs.Screen 
            name='index'
            options={{
                title : 'Home',
                headerShown :false,
                tabBarIcon : ({focused}) => (
                    <TabIcon icon={require("@/assets/icons/home.png")} className='size-8' focused={focused} title="Home" />
                )
            }}
        />

        <Tabs.Screen
            name='scan'
            options={{
                title : 'Scan',
                headerShown :false,
                tabBarIcon : ({focused}) => (
                    <TabIcon icon={require("@/assets/icons/scan.png")} title='Scan' className='size-8' focused={focused} />
                )
            }}
        />
        
    </Tabs>
  )
}

export default TabsLayout