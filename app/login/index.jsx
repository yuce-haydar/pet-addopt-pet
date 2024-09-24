import React, { useCallback } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import  Colors  from '../../constants/Colors'
import { useOAuth } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()
export default function LoginScreenf() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })
  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/home', { scheme: 'myapp' }),
      })

      if (createdSessionId) {

      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, [])


  return (
    <View style={styles.container}>
      <Image source={require('./../../assets/images/login.png')} style={styles.image} />
   <View style={styles.container2}>
   <Text style={styles.text}>Ready to make new friend ?</Text>
    <Text style={styles.text2} >Lets adopt the pet which you like and make there life happy again</Text>
    <TouchableOpacity onPress={onPress} style={styles.btn}>
      <Text style={styles.txtBtn}>Get Started</Text>
    </TouchableOpacity>
   </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,

    width: '100%',
   
  },
  image: {
    width: '100%',
    height: 500,
   
  },
  container2: {

    padding: 20,
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    fontFamily: 'outfit-bold',
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  text2: {
    fontSize: 18,
    fontFamily: 'outfit',   
    textAlign: 'center',
    paddingTop: 20,
    color:Colors.GRAY,
  },
  btn: {
    backgroundColor: Colors.YELLOW,
    width: '100%',
    padding: 10,
    borderRadius: 20,

    alignItems: 'center',
    marginTop: 60,
  },
  txtBtn: {
    color: Colors.BLACK,
    fontSize: 20,
    fontWeight: 'bold',
  },
})