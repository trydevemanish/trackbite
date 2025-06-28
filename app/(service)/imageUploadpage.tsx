import Addingpeice from '@/components/Addingpeice';
import NutritionValue from '@/components/NutritionValue';
import PickerComponent from '@/components/Picker';
import { config, storage } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/GlobalContext';
import { FoodDetailInterface } from '@/types/type';
import useDataStore, { datatype } from '@/utils/usestore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ID } from 'react-native-appwrite';

type SettingItemsProps = {
    title : string,
    onPress? : () => void,
    textStyle? : string
}

const Settingitems = ({title,onPress,textStyle} : SettingItemsProps) => (
  <View className='bg-[#fff] shadow-lg shadow-[#fff] rounded-3xl px-8 py-2'>
    <TouchableOpacity onPress={onPress} className='shadow-lg shadow-[#fff]'>
        <Text className={`text-lg font-rubik-medium text-[#41b867] ${textStyle}`}>{title}</Text>
    </TouchableOpacity>
  </View>
)

export default function ImageUploadpage() {
    const { user } = useGlobalContext()
    // this state is for fetching food detail like calorie,fat,carbs,protein etc.
    const [fetchedFoodDetail,setFetchedFoodDetail] = useState<FoodDetailInterface | null>(null)
    const [foodName,setFoodName] = useState<string>('')
    // this state will tell if it is breakfast ,lunch ,dinner.
    const [selectedMealType, setSelectedMealType] = useState('breakfast');  
    const [selectedMealQuantity, setSelectedMealTypeQuantity] = useState<number>();  

    // this data is used to show user similiar options of meal to search calrioe of that meal.
    const data = useDataStore(state => state.data)
    const localPhotoCatured = useDataStore(state => state.photouriofcaturedImage) 

    console.log('Local path of the image captured',localPhotoCatured)


    async function fetchDatafromApi(foodName : string){
        try {

            const response = await fetch(`${process.env.EXPO_PUBLIC_CALL_BACKEND_API}/meal/fooddetail`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({ foodName:foodName })
            })
    
            if(!response.ok){
                throw new Error(await response.text())
            }
    
            const data = await response.json()
    
            console.log('Data from the spoonacular api...',data?.data)

            setFetchedFoodDetail(data?.data)

        } catch (error) {
            console.error('Error Cocured while fetchDataFromApi', error)
        }
    }

    async function storeImageToAppWriteStorage(photouri:string) {
        try {

            const fileName = photouri.split('/').pop() || 'trackbite-meal-image.jpg';
            const fileType = 'image/jpeg';

            const file = {
                name : fileName,
                type : fileType,
                size : 1234567,
                uri : photouri,
            };

            console.log('checknig file till here',file) 
            console.log('process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID',process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID) 

            const result = await storage.createFile(`${process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID}`, ID.unique(), file);

            const fileId = result.$id;

            return fileId;

        } catch (error) {
         console.error(`Issue Occured while Adding Image to Appwrite storge`,error)   
        }
    }

    async function addtoDatabase(selectedMealQuantity:number | undefined, foodNamePassed:string,fetchedFoodDetail:FoodDetailInterface){
        try {

            if(!fetchedFoodDetail){
                throw new Error('FetchFoodDetail is not applicable.')
            }

            // get the localpath of the image
            const fileId = await storeImageToAppWriteStorage(localPhotoCatured)

            if(!fileId){
                throw new Error('Image file id not received')
            }

            const filePath = `${config.endpoint}/storage/buckets/${config.storageid}/files/${fileId}/view?project=${config.projectId}`

            // https://fra.cloud.appwrite.io/v1/storage/buckets/685e515600342233b78c/files/685e67410019172eece0/view?project=683a9c600004ee373c29

            const foodData = {
                userid : user?.$id,
                foodname : foodNamePassed,
                foodImageUrl : filePath,
                calories : fetchedFoodDetail?.calories?.value,
                protein : fetchedFoodDetail?.protein?.value,
                carbs : fetchedFoodDetail?.carbs?.value,
                fat : fetchedFoodDetail?.fat?.value,
                mealType : selectedMealType,
                quantity : selectedMealQuantity,
            }

            const response = await fetch(`${process.env.EXPO_PUBLIC_CALL_BACKEND_API}/meal/add`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({ data:foodData })
            })
    
            if(!response.ok){
                throw new Error(await response.text())
            }
    
            const data = await response.json()
    
            console.log(data?.message)

            router.push('/')

        } catch (error) {
            console.error('Error Cocured while Adding it to db', error)
        }
    }

  return (
    <ScrollView>
        <View className='bg-accent-100 min-h-screen object-cover relative '>
            <Image
                source={{ uri: localPhotoCatured }}
                className="w-full h-[32rem] absolute"
            />
            <TouchableOpacity className='absolute top-10 right-10 p-2 bg-[#fff] rounded-full' onPress={() => router.replace('/scan')}>
                <Image source={require('@/assets/icons/delete.png')} className='size-6' />
            </TouchableOpacity>
            {/* This is where the whole peice work. */}
            <View className='absolute top-40 bg-accent-100 min-h-screen w-full'>
                <ScrollView>
                    <View className='flex flex-row justify-center'>
                        <Image source={require('@/assets/icons/horizontal.png')} className='size-8'  />
                    </View>
                    
                    <View className='px-6 py-6'>
                    {/* this is a picker component  */}
                        <PickerComponent selectedMealType={selectedMealType} setSelectedMealType={setSelectedMealType} />

                        <View className='mt-8'>
                            <Text className='font-rubik-medium text-lg'>Select matching item ...</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className='py-5 mt-5'>
                                <View className='flex flex-row gap-4 items-center'>
                                    {data?.map((data:datatype) => (
                                        <Settingitems 
                                            title={data?.title} 
                                            key={data?.id} 
                                            onPress={() =>{
                                                setFoodName(data?.title)
                                                fetchDatafromApi(data?.title)
                                            }} 
                                        />
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        <View className='flex flex-row items-center py-6 justify-between'>
                            <Text className='font-rubik-medium text-xl '>{foodName ? foodName : 'Selected Item Name'}</Text> 
                            {/* for meal quantity  */}
                            <Addingpeice selectedMealQuantity={selectedMealQuantity} setSelectedMealTypeQuantity={setSelectedMealTypeQuantity} />
                        </View>

                        {/* for nutrition logs  */}
                        <NutritionValue foodDetail={fetchedFoodDetail} />
                    </View>
                        
                    <View className='bg-accent-100 shadow-lg shadow-[#fff] w-full rounded-md'>
                        <View className='py-6 flex flex-row items-center justify-between px-6'>
                            <TouchableOpacity className='bg-[#fff] rounded-xl  shadow-2xl shadow-[#fff]  px-16 py-4' onPress={() => router.back()}>
                                <Text className='font-rubik-medium text-center'>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className='bg-[#41b867] shadow-2xl shadow-[#fff] rounded-xl px-16 py-4' onPress={() => addtoDatabase(selectedMealQuantity,foodName,fetchedFoodDetail!)}>
                                <Text className='text-accent-100 font-rubik-medium text-center'>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                </ScrollView>
            </View>
        </View>
    </ScrollView>
  )
}