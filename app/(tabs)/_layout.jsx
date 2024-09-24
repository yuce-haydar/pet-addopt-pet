import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs>
        <Tabs.Screen name="home" />
        <Tabs.Screen name="favorite" />
        <Tabs.Screen name="inbox" />
        <Tabs.Screen name="profile" />
    </Tabs>
  )
}

const styles = StyleSheet.create({})