import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useEffect } from 'react';

export default function AddNewPet() {
    const navigation = useNavigation();
    useEffect(() => {
      navigation.setOptions({
        headerTitle: "Add New Pet",
      });
    }, [])
  return (
    <View>
      <Text>AddNewPet</Text>
    </View>
  )
}

const styles = StyleSheet.create({})