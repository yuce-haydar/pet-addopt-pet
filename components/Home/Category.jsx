import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Category = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.container}>Category</Text>
    </View>
  )
}

export default Category

const styles = StyleSheet.create({
    container:{
        marginTop:20
    },
    text:{
        fontSize:20,
        fontWeight:'bold'


    }
})