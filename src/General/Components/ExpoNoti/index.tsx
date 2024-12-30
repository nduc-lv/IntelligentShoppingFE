import React, { useEffect, useState } from "react";
import { Input, FlatList, Pressable, Text, Icon } from "native-base";
import { View, Keyboard, TouchableWithoutFeedback } from "react-native";
import AppData from "@/General/Constants/AppData";
import { Check, ChevronDown, CircleX } from "lucide-react-native";
import * as Notifications from 'expo-notifications'
import { useNavigation } from '@react-navigation/native';
const ExpoNoti: React.FC<any> = () => {
    const navigation = useNavigation();
	useEffect(() => {
        // Handle notification tap
        const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const { screen, ...params } = response.notification.request.content.data;
            console.log("this is my response", response)
            if (screen) {
                // Navigate to the specified screen with parameter
                if(typeof screen ==='string'&&screen){
                    console.log(screen)
                    console.log(params)
                    // @ts-ignore
                    navigation.navigate(screen, ...params);
                }
                
            }
        });

        return () => subscription.remove();
    }, []);
    return null
};

export default ExpoNoti;