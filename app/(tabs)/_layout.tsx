import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageBackground, View } from "react-native";

const TabIcon = ({ focused, icon, title }: any) => {
    if (focused) {
         return (
            <ImageBackground
                source={images.tabsbarbutton}
                className="flex min-w-[80px] min-h-14 mt-4 justify-center items-center rounded-full"
            >
                <Image source={icon} tintColor="#151312" className="size-7" />
            </ImageBackground>
        );
    }
    return (
        <View>
            <Image source={icon} tintColor="#6398ef" className="size-5" />
        </View>
    );
};

const _Layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    flex: 1, 
                    justifyContent: "center", 
                    alignItems: "center", 
                },
                // Tabs bar layout, styles
                tabBarStyle: {
                    backgroundColor: "#0e0454", 
                    borderRadius: 50,
                    marginHorizontal: 10,
                    marginBottom: 40,
                    height: 52,
                    position: "absolute",
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#0f0D23",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "HOME",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.home}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "SEARCH",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.search}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: "SAVED",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.save}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "PROFILE",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.person}/>
                    ),
                }}
            />
        </Tabs>
    );
};

export default _Layout;