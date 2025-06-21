import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { View } from 'react-native';


type pickitemType = {
    id : number,
    label : string,
    value : string
}

const pickitem = [
    {
        id: 1,
        label : 'Breakfast' ,
        value : 'breakfast'
    },
    {
        id: 2,
        label : 'Morning Snack' ,
        value : 'morning_snack'
    },
    {
        id: 3,
        label : 'Lunch' ,
        value : 'lunch'
    },
    {
        id: 4,
        label : 'Evening Snack' ,
        value : 'evening_snack'
    },
    {
        id: 5,
        label : 'Dinner' ,
        value : 'dinner'
    },
]

type props = {
    selectedMealType : string,
    setSelectedMealType : React.Dispatch<React.SetStateAction<string>>
}

export default function PickerComponent({selectedMealType,setSelectedMealType}:props) {
    
  return (
    <View className=" w-52 rounded-xl bg-[#41b867] text-sm font-rubik-medium text-[#fff] overflow-hidden">
        <Picker
            selectedValue={selectedMealType}
            onValueChange={(itemValue) => setSelectedMealType(itemValue)}
            style={{
                fontWeight: 'bold',
                fontFamily: 'Rubik-Bold',
                color: '#000',
                fontSize: 12, // Smaller text
                padding: 0,    // Remove unnecessary padding
                margin: 0      // Remove unnecessary margin
            }}
            itemStyle={{
                fontWeight: 'bold',
                fontFamily: 'Rubik-Bold',
                fontSize: 12,  // Small text for dropdown items
                color: '#000'
            }}
        >
        {pickitem.map((data: pickitemType) => (
            <Picker.Item
                label={data?.label}
                value={data?.value}
                key={data?.id}
            />
        ))}
        </Picker>
    </View>
  )
}