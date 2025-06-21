import { useGlobalContext } from '@/lib/GlobalContext';
import useDataStore from '@/utils/usestore';
import { CameraType, CameraView, useCameraPermissions, } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const scan = () => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [enableTorch,setEnableTorch] = useState(false)
  const cameraRef = useRef<CameraView>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [barcodeScanned, setBarcodeScanned] = useState(false);
  const { user } = useGlobalContext()
  const [loading,setLoading]= useState(false)

  if (!permission) {
  return (
    <View>
      <Text>Camera permission not allowed.</Text>
    </View>
    )
  }

  if (!permission.granted) {
    return (
      <SafeAreaView>
        <View className='flex flex-col min-h-screen bg-accent-100 justify-center items-center px-6'>
          <View className='bg-[#ffffff] shadow-2xl shadow-[#ffffff] rounded-2xl px-6 py-12'>
            <View className='flex flex-col items-center gap-5 justify-center'>
              <Text className='text-lg font-rubik-medium text-center px-12'>We need your permission to show the camera</Text>
              <TouchableOpacity onPress={requestPermission} className='pt-3 cursor-pointer rounded-xl bg-black-DEFAUlt px-8 inline-flex py-2'>
                <Text className='text-base font-rubik-semibold text-accent-100'>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleEnabletorch() {
    setEnableTorch(prev => !prev);
  }

  async function takephoto(){
    if(cameraRef.current){
      const photo = await cameraRef.current.takePictureAsync()
      setPhotoUri(photo.uri);
      await uploadPhotoToBackend(photo.uri)
    }
  }

  const handleBarcodeScanned = ({ data, type }: { data: string; type: string }) => {
    if (!barcodeScanned) {
      setBarcodeScanned(true);
      Alert.alert('Barcode scanned')
      setTimeout(() => setBarcodeScanned(false), 6000);
    }
  };

  async function uploadPhotoToBackend(photouri:string){
    try {

      setLoading(true)
      
      const manipulated = await ImageManipulator.manipulateAsync(photouri, [
        { resize: { width: 800 } }, 
      ], { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG });

      const base64 = await FileSystem.readAsStringAsync(manipulated.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response  = await fetch(`${process.env.EXPO_PUBLIC_CALL_BACKEND_API}/meal/upload`,{
        method : 'POST',
        headers : {
          'Content-Type': 'application/json'   
        },
        body : JSON.stringify({ foodImage:base64 })
      })

      if(!response){
        console.error('Response not received')
        return ;
      }
  
      const data = await response.json()
      
      // console.log("data",data?.message)
      console.log("data",data)

      useDataStore.getState().setData(data?.data)

      useDataStore.getState().setPhotoUriofcaturedImage(photouri)

      setLoading(false)

      router.push('/imageUploadpage')
  
    } catch (error) {
      console.error('Issue Ocuured while uploading..',error)
    } finally {
      setLoading(false)
    }
  }

  return (
     <SafeAreaView>
      <CameraView 
        ref={cameraRef}
        facing={facing}
        enableTorch={enableTorch}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'code128', 'ean13', 'ean8'],
        }}
        onBarcodeScanned={handleBarcodeScanned}
      >
        {
          loading && (
            <View className='flex flex-col min-h-screen justify-center items-center px-6'>
              <View className='bg-[#ffffff] shadow-2xl shadow-[#ffffff] rounded-2xl px-4 py-8'>
                <View className='flex flex-col items-center gap-5 justify-center'>
                  <Text className='text-lg font-rubik-medium text-center px-12'>Wait while we are Analysing the Image</Text>
                  <Image source={require('@/assets/icons/refresh.png')} className='size-8 animate-spin duration-300 ' />
                </View>
              </View>
            </View>
          )
        }

        <View className={`flex flex-col items-center justify-center gap-y-10 min-h-screen`}>
          {/* this will show the scanner border  */}
          {/* <Scanner  /> */}

          <View className='flex flex-row items-center gap-8 justify-center mt-80'>
            {/* this one for switch camera  */}
            <View className='bg-accent-100 px-3 py-2 rounded-xl'>
              <TouchableOpacity onPress={toggleCameraFacing}>
                <Image source={require('@/assets/icons/camera.png')} className='size-6' />
              </TouchableOpacity>
            </View>

            {/* this one enabling torch  */}
            <View className='bg-accent-100 px-3 py-2 rounded-xl'>
              <TouchableOpacity onPress={toggleEnabletorch}>
                <Image source={require('@/assets/icons/torch.png')} className='size-6' />
              </TouchableOpacity>
            </View>

            {/* this one for scan barcode  */}
            <View className='bg-accent-100 px-3 py-2 rounded-xl'>
              <TouchableOpacity onPress={() => setBarcodeScanned(true)}>
                <Image source={require('@/assets/icons/barcode.png')} className='size-6' />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <TouchableOpacity className='bg-[#fff] rounded-full p-6' onPress={takephoto}>
              <Image source={require('@/assets/icons/search.png')} className='size-8' />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  )
}

export default scan