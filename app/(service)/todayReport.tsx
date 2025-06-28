import Recentmeal from '@/components/Recentmeal'
import Skeleton from '@/components/Skeleton'
import { useGlobalContext } from '@/lib/GlobalContext'
import { mealDataType } from '@/types/type'
import useDataStore from '@/utils/usestore'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const todayReport = () => {
  const { user } = useGlobalContext()
  const [allMeal,setAllMealData] = useState<mealDataType[] | null>(null)
  // it will count the total calorie from today 12am to 12pm like for whole day 
  const [totalCalorieCountForToday,setTotalCalorieCountForToday] = useState<number>()
  const [loading,setLoading] = useState<boolean>(false)
  const [searchbyFoodName,setSearchByFoodName] = useState('')
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [seachByDate,setSearchByDate] = useState<Date | null>(null);
  const [refresh,setRefresh] = useState(false)

  const router = useRouter()

  const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
  };

  function generateNewDate (){
    const date = new Date()
    return date.toDateString()
  }

  const handleCardPress = (id:string) => {
    router.push({
      pathname: "/singleMealReport/[id]",
      params: { id },
    });
  }

  async function calculateTotalCalorieOfToday(data:mealDataType[]){
    let totalCalorie = 0;
    data.forEach((datafeild:mealDataType) => {
      totalCalorie = totalCalorie + datafeild?.calories
    })

    useDataStore.getState().setPassingCalorieDataToAiModel(totalCalorie.toString())

    return totalCalorie;
  }

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') setShowDatePicker(false);

      if (selectedDate) {
          setSearchByDate(selectedDate);
          const date = formatDate(selectedDate)
          fetchAllMealDataByDate(date)
      }
  };

  const fetchAllMealDataByDate = async(selectedDate : string) => {
      try {

        setLoading(true); 

        console.log(selectedDate)

        const res = await fetch(`${process.env.EXPO_PUBLIC_CALL_BACKEND_API}/meal/date`,{
          method : 'POST',
          headers : {
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({ date:selectedDate ,limit:10, userid: user?.$id })
        })

        if(!res){
          throw new Error('Response invalid')
        }
        
        const data = await res.json()

        console.log('data of a date',data)

        setTotalCalorieCountForToday(await calculateTotalCalorieOfToday(data?.data))

        setAllMealData(data?.data)

      } catch (error) {
        console.error('Issue Occured fetching data',error)
      } finally {
        setLoading(false); 
      }
    }

  const handelRefresh = async() => {
    setSearchByDate(null)
    setRefresh(prev => !prev)
  }

  useEffect(() => {

    const fetchAllMealData = async() => {
      try {

        setLoading(true);

        const res = await fetch(`${process.env.EXPO_PUBLIC_CALL_BACKEND_API}/meal/`,{
          method : 'POST',
          headers : {
            'Content-Type': 'application/json'
          },
          body : JSON.stringify({ limit:10, userid: user?.$id })
        })

        if(!res){
          throw new Error('Response invalid')
        }
        
        const data = await res.json()

        setTotalCalorieCountForToday(await calculateTotalCalorieOfToday(data?.data))

        setAllMealData(data?.data)
        
      } catch (error) {
        console.error('Issue Occured fetching data',error)
      } finally {
        setLoading(false); 
      }
    }

    fetchAllMealData() 
  },[])
  

  return (
    <SafeAreaView>
      <FlatList 
        data={undefined} 
        renderItem={undefined}
        keyExtractor={undefined}
        ListHeaderComponent={
          <View className='px-6 py-12 flex flex-col min-h-screen w-full bg-accent-100'>
            <View className='flex flex-col gap-2'>
              <Text className='font-rubik-medium text-lg text-center'>This is Your Whole Day Report.</Text>
              <Text className='text-sm overflow-hidden text-center pl-36'>{`-- ${generateNewDate()}`}</Text>
            </View>
            <View className='mt-10 flex flex-col items-center gap-4'>
              <Text className='text-base font-rubik-light'>Total Calorie Burn Today So Far.</Text>
              <View className='flex flex-col mt-7'>
                <View className="flex flex-row items-center justify-between bg-[rgb(255,255,255)] px-9 shadow-[#ffffff] shadow-2xl py-6 rounded-2xl w-full">
                    <View className="flex flex-col items-start gap-3">
                      <Text className="text-center text-4xl font-rubik-light text-black-DEFAUlt">{totalCalorieCountForToday ? `${totalCalorieCountForToday} g` : '0g'}</Text>
                      <Text className="text-lg">Calorie burn</Text>
                    </View>
                    <View className="border-black-DEFAUlt border rounded-full p-6">
                      <Image source={require('@/assets/icons/calorie.png')} className="size-6" />
                    </View>
                </View>

                {
                  seachByDate === null && (
                    <View className="py-6 flex flex-row item-center gap-2">
                      <Image source={require('@/assets/icons/light.png')} className="size-7" />
                      <TouchableOpacity onPress={() => router.push('/whatyoushoulddo')}>
                        <Text className="font-rubik-medium text-lg text-[#35c863]">+ How you can lose this calorie ?</Text>
                      </TouchableOpacity>
                    </View>
                  )
                }
                
              </View>
            </View>

            {/* Whole Day Meal Submitted Result */}

            <View className='flex flex-col mt-8'>
              <Text className='font-rubik-medium text-xl'>Your Whole Day Meal Submitted Report.</Text>

              <View className='mt-4'>
                {/* <SearchBarWithFilter data={[]} /> */}
                <View className='flex flex-row items-center w-full border border-gray-300 rounded-xl overflow-hidden'>
                    <TextInput
                        placeholder="Search by name"
                        value={searchbyFoodName}
                        onChangeText={(text) => setSearchByFoodName(text.toLowerCase())}
                        className="w-[22rem] p-3"
                    />
    
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Image source={require('@/assets/icons/filter.png')} className='size-7' />
                    </TouchableOpacity>

                    {showDatePicker && (
                        <DateTimePicker
                            value={seachByDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}

                </View>
              </View>

              <View className='flex flex-col items-center min-w-full gap-2 mt-6'>
                {
                  loading ? 
                    [...Array(2)].map((_, index) => (
                      <Skeleton key={index} />
                    )) 
                  : 
                    (
                      Array.isArray(allMeal) && allMeal.length > 0 ?
                        (
                          allMeal.map((data:mealDataType,index:number) => (
                            <View  key={index}>
                              {
                                searchbyFoodName ? 
                                (
                                  data.foodname.includes(searchbyFoodName) && <Recentmeal onPress={() => handleCardPress(data?.$id)} foodname={data?.foodname} foodImageUrl={data?.foodImageUrl} calorie={data?.calories} uploadedon={data?.timestamp} />
                                ) : 
                                (
                                  <Recentmeal onPress={() => handleCardPress(data?.$id)} foodname={data?.foodname} calorie={data?.calories} uploadedon={data?.timestamp} foodImageUrl={data?.foodImageUrl} />
                                )
                              }
                            </View>
                          ))
                        ) :
                        (
                          <View className="flex flex-col items-center gap-2 mt-8">
                            <Text>No recent data share today.</Text>
                            <Text>Start tacking your meal, by scanning easily.</Text>
                          </View>
                        )
                    )
                }
              </View>
            </View>

          </View>
        }
      />
    </SafeAreaView>
  )
}

export default todayReport