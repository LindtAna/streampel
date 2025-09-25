import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";

const TabIcon = ({ focused, icon, title }: any) => {
    if (focused) {
        return (
            <ImageBackground
                source={images.highlight}
                className="flex flex-row w-full flex-1
                        min-w-[112px] min-h-16 mt-4 justify-start items-center
                        rounded-full overflow-hidden pl-6"
            >
                <Image source={icon} tintColor="#151312" className="size-5" />
                <Text className="text-secondary text-sm font-semibold ml-1 ">
                    {title}
                </Text>
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
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarStyle: {
                    backgroundColor: "#0f0D23", 
                    borderRadius: 50,
                    marginHorizontal: 20,
                    marginBottom: 36,
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
                        <TabIcon focused={focused} icon={icons.home} title="HOME" />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "SEARCH",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.search} title="SEARCH" />
                    ),
                }}
            />
            <Tabs.Screen
                name="saved"
                options={{
                    title: "SAVED",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.save} title="SAVED" />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "PROFILE",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.person} title="PROFILE" />
                    ),
                }}
            />
        </Tabs>
    );
};

export default _Layout;