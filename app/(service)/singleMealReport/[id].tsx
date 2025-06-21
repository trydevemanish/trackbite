import FaqCard from '@/components/FAQ';
import { mealDataType } from '@/types/type';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const singleMealReport = () => {
  
    const { id } = useLocalSearchParams<{ id?: string }>()
    const windowHeight = Dimensions.get("window").height;
    const [singleMealData,setSingleMealData] = useState<mealDataType | null>(null)

    const mealOverviewDate= [
        {
          label1:'Food Name',
          label2: singleMealData?.foodname ? singleMealData?.foodname : 'foodName'
        },
        {
          label1:'Portion Size',
          label2: singleMealData?.quantity ? singleMealData?.quantity.toString() : '0'
        },
        {
          label1:'Calorie',
          label2: singleMealData?.calories ? singleMealData?.calories.toString() : '0 cal'
        },
        {
          label1:'Date and Time',
          label2: singleMealData?.$createdAt ? singleMealData?.$createdAt.toString() : 'date'
        }
    ]

    const dataforpiechart = [
      {
        name: 'Calories',
        nutritionvalue: singleMealData?.calories ?? 0,
        color: "rgba(131, 167, 234, 1)",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: 'protein',
        nutritionvalue: singleMealData?.protein ?? 0,
        color: "#F00",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: 'fat',
        nutritionvalue: singleMealData?.fat ?? 0,
        color: "red",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: 'carbs',
        nutritionvalue: singleMealData?.carbs ?? 0,
        color: "#ffffff",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      },
      {
        name: 'fiber',
        nutritionvalue: singleMealData?.fiber ?? 0.9,
        color: "rgb(0, 0, 255)",
        legendFontColor: "#7F7F7F",
        legendFontSize: 15
      }
    ];

    useEffect(() => {
      const fetchSingleMealDetail = async() => {
        try {

          const res = await fetch(`${process.env.EXPO_PUBLIC_CALL_BACKEND_API}/meal/${id}`,{
            method : 'GET',
          })
  
          if(!res){
            console.error('Issue Occured while fetching meal detail..')
          }
  
          const data = await res.json()

          setSingleMealData(data?.data)
  
        } catch (error) {
          console.error('Issue Occured while Fetching Single Meal detail...',error)
        }
      }

      fetchSingleMealDetail()
    },[])

  return (
    <ScrollView contentContainerClassName='pb-10'>
        <View className='relative w-full'>
          <View style={{ height: windowHeight / 3 }}>
            <Image
              source={require("@/assets/onboardingimage/2.jpg")}
              className='size-full max-h-80'
              resizeMode='cover'
            />
            <View
              className="z-50 absolute inset-x-7"
              style={{
                top: Platform.OS === "ios" ? 70 : 20,
              }}
            >
                <View className='flex flex-row items-center w-full justify-between absolute top-0 pt-4'>
                    <TouchableOpacity
                        onPress={() => router.back()} 
                        className="flex flex-row bg-primary-200 rounded-full size-11 gap-1 items-center justify-center"
                    >
                        <Image source={require('@/assets/icons/back.png')} className="size-5" />
                        <Text className='text-base font-rubik-medium'>back</Text>
                    </TouchableOpacity>
                </View>
            </View>
          </View>

            <View className='flex flex-col px-6 mt-6'>
                <View className='flex flex-row items-center justify-start gap-2'>
                    <Image source={require("@/assets/icons/meal.png")} className='size-6' />
                    <Text className='font-rubik-medium text-lg'>Meal Overiew.</Text>
                </View>

                <View className="flex flex-col gap-1 mt-8 items-center place-content-center text-xs">
                    {mealOverviewDate.map((data,idx:number) => (
                        <FaqCard label1={data?.label1} label2={data?.label2} key={idx} classNamelabel1='bg-[#dcc200] font-manrope px-3 py-2 text-lg font-rubik-medium rounded' classNamelabel2='px-3' />
                    ))}
                </View>

                <View className='flex flex-col items-start gap-2 mt-8'>
                    <Text className='text-xl'>Other Macro Info about meal: </Text>
                    <View className='flex flex-col item-start gap-5 mt-6 px-7'>
                         <View className='flex flex-row w-full'>
                            <Text className='flex-1 text-lg font-rubik-medium'> - Protein</Text>
                            <Text className='flex-1 text-sm text-right'>{singleMealData?.protein ? `${singleMealData.protein}g` : '0g'}</Text>
                        </View>
                        <View className='flex flex-row w-full'>
                            <Text className='flex-1 text-lg font-rubik-medium'> - Carbohydrate</Text>
                            <Text className='flex-1 text-sm text-right'>{singleMealData?.carbs ? `${singleMealData.carbs}g` : '0g'}</Text>
                        </View>
                         <View className='flex flex-row w-full'>
                            <Text className='flex-1 text-lg font-rubik-medium'> - Fat</Text>
                            <Text className='flex-1 text-sm text-right'>{singleMealData?.fat ? `${singleMealData.fat}g` : '0g'}</Text>
                        </View>
                        <View className='flex flex-row w-full'>
                            <Text className='flex-1 text-lg font-rubik-medium'> - Fiber</Text>
                            <Text className='flex-1 text-sm text-right'>0.0g</Text>
                        </View>
                    </View>
                </View>

                <View className='flex flex-col items-start gap-2 mt-8'>
                    <Text className='text-xl'>Dieatry Label</Text>
                    <Text className='font-rubik-medium pl-10 text-lg'> - Non Vegan</Text>
                </View>

                <View className='flex flex-col items-start gap-2 mt-8'>
                    <Text className='text-xl'>A PieChart That show your meal logs: </Text>

                    <PieChart
                      data={dataforpiechart}
                      width={Dimensions.get("window").width}
                      height={280}
                      chartConfig={{
                          backgroundColor: "#e26a00",
                          backgroundGradientFrom: "#fb8c00",
                          backgroundGradientTo: "#ffa726",
                          decimalPlaces: 2, // optional, defaults to 2dp
                          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                          style: {
                            borderRadius: 16
                          },
                          propsForDots: {
                            r: "6",
                            strokeWidth: "2",
                            stroke: "#ffa726"
                        }
                      }}
                      accessor={"nutritionvalue"}
                      backgroundColor={"transparent"}
                      paddingLeft={"1"}
                      center={[10, 20]}
                      absolute
                    />
                </View>
            </View>
            
            <View className='px-6 py-6'>
              <Text className='font-rubik-semibold text-xl text-[#4147b4]'>Generate more Detail with Ai + </Text>
            </View>

        </View>
    </ScrollView>
  )
} 

export default singleMealReport