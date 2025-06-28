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
                // borderTopColor : '#0061FF1A',
                // borderTopWidth : 1,
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

        {/* <Tabs.Screen 
            name='yourgoal'
            options={{
                title : 'Your goal',
                headerShown :false,
                tabBarIcon : ({focused}) => (
                    <TabIcon icon={require("@/assets/icons/goal.png")} focused={focused} title="goal" />
                )
            }}
        /> */}

        {/* <Tabs.Screen 
            name='setting'
            options={{
                title : 'Setting',
                headerShown :false,
                tabBarIcon : ({focused}) => (
                    <TabIcon icon={require("@/assets/icons/setting.png")} focused={focused} title="setting" />
                )
            }}
        /> */}

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
        
        {/* <Tabs.Screen
            name='scan'
            options={{
                title : 'Scan',
                headerShown :false,
                tabBarIcon : ({focused}) => (
                    <TabIcon icon={require("@/assets/icons/scan.png")} className='size-[56px]' focused={focused} />
                ),
                tabBarIconStyle : {
                    position : 'absolute',
                    top : -37,
                    left : 30
                }
            }}
        /> */}
    
    </Tabs>
  )
}

export default TabsLayout