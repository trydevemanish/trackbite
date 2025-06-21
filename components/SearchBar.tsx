import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { FlatList, Image, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Item = {
    name: string;
    date: string; // Format: YYYY-MM-DD
};

type SearchBarWithFilterProps = {
    data: Item[];
};

const SearchBarWithFilter: React.FC<SearchBarWithFilterProps> = ({ data }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredData, setFilteredData] = useState<Item[]>(data);
    const [filterDate, setFilterDate] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        filterData(query, filterDate);
    };

    const filterData = (query: string, date: Date | null) => {
        const lowerQuery = query.toLowerCase();
        const result = data.filter(item => {
            const matchesName = item.name.toLowerCase().includes(lowerQuery);
            const matchesDate = date ? item.date === formatDate(date) : true;
            return matchesName && matchesDate;
        });
        setFilteredData(result);
    };

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (Platform.OS === 'android') setShowDatePicker(false);

        if (selectedDate) {
            setFilterDate(selectedDate);
            filterData(searchQuery, selectedDate);
        }
    };

    const clearFilter = () => {
        setFilterDate(null);
        filterData(searchQuery, null);
    };

    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    return (
        <View className="py-6">
            <View className='flex flex-row items-center w-full border border-gray-300 rounded-xl overflow-hidden'>
                <TextInput
                    placeholder="Search by name"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    className="w-[22rem] p-3"
                />

                <TouchableOpacity onPress={() => setShowDatePicker(true)} >
                    <Image source={require('@/assets/icons/filter.png')} className='size-7' />
                </TouchableOpacity>
            </View>

            {filterDate && (
                <View className='flex flex-row items-center justify-between px-1 py-4'>
                    <Text className="mb-2 text-xl font-rubik-light">Filtering by: {formatDate(filterDate)}</Text>
                    <TouchableOpacity onPress={clearFilter}>
                        <Image source={require('@/assets/icons/delete.png')} className='size-5'/>
                    </TouchableOpacity>
                </View>
            )}

            {showDatePicker && (
                <DateTimePicker
                    value={filterDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <FlatList
                data={filteredData}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View className="p-4 border-b border-gray-200">
                        <Text className="text-lg font-semibold">{item.name}</Text>
                        <Text className="text-gray-500">{item.date}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default SearchBarWithFilter;
