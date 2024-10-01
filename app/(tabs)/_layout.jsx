import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../../constants/Colors'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor:Colors.PRIMARY 
     }}>
        <Tabs.Screen name="home" options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon:({color})=><Ionicons name="home" size={24} color={color} />
        }} />
        <Tabs.Screen name="favorite"  options={{
          title: 'Favorite',
          headerShown: false,
          tabBarIcon:({color})=><Ionicons name="heart" size={24} color={color} />
        }} />
        
        <Tabs.Screen name="inbox" options={{
          title: 'Inbox',
          headerShown: false,
          tabBarIcon:({color})=><Ionicons name="chatbubble-ellipses" size={24} color={color}   />
          
        }} />
        <Tabs.Screen name="profile" options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon:({color})=><Ionicons name="person-circle" size={24} color={color} />
        }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({})