import { create } from 'zustand';

export type datatype = {
    id : number,
    title :string,
    imageType : string
}

interface MyState {
    data : datatype[] | null ;
    setData: (data: datatype[][]) => void;
    photouriofcaturedImage : string;
    setPhotoUriofcaturedImage : (photouriofcaturedImage:string) => void;
    passingCalorieDataToAiModel : string;
    setPassingCalorieDataToAiModel : (passingCalorieDataToAiModel:string) => void;
    clearData : () => void
}

const useDataStore = create<MyState>((set) => ({
    data: [],
    photouriofcaturedImage: '',
    passingCalorieDataToAiModel: '',
    setData: (data) => set({ data: data.flat() }),
    setPhotoUriofcaturedImage: (photouriofcaturedImage :string) => set({ photouriofcaturedImage:photouriofcaturedImage }), 
    setPassingCalorieDataToAiModel:(passingCalorieDataToAiModel:string) => set({ passingCalorieDataToAiModel:passingCalorieDataToAiModel }),
    clearData: () => set({ data: [] }),
}));

export default useDataStore;