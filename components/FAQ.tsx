import { useState } from "react"
import { Text, View } from 'react-native'


export default function FaqCard({label1,label2,classNamelabel1,classNamelabel2}:{label1:string,label2:string,classNamelabel1?:string,classNamelabel2?:string}) {
    const [showtext,setShowText] = useState(false)

  return (
    <View className="flex flex-col w-full">
        <Text className={`cursor-pointer ${classNamelabel1}`} onPress={() => setShowText(prev => !prev)}>{label1}</Text>
        <View
          className={`transition-all duration-300 overflow-hidden ${
            showtext ? "max-h-56 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <Text className={`${classNamelabel2} `} onPress={() => setShowText(prev => !prev)}>{label2}</Text>
        </View>
    </View>
  )
}
