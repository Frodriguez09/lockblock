import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native'
import React, {useState} from 'react'
import {auth} from '../firebase'
import firebase from 'firebase';
import 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';


const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


// const handleSignUp = () => {
//     auth
//     .createUserWithEmailAndPassword(email, password)
//     .then(userCredentials =>{
//         const user = userCredentials.user;
//         console.log(user.email);
//     })
//     .catch(error => alert(error.message))
// }

const handleLogin = () => {
    // firebase
    // .auth()
    auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
        // Obtener información de usuario y redirigir según el rol
        const user = firebase.auth().currentUser;
        // const user = auth.currentUser;
        if (user) {
          const { displayName, email } = user;
  
          // Leer el campo "rol" del perfil de usuario en Firestore
          firebase
        //   auth
            .firestore()
            .collection('users')
            .doc(user.uid)
            .get()
            .then(snapshot => {
              const userData = snapshot.data();
              if (userData) {
                const { rol } = userData;
                // Aquí puedes implementar la lógica de roles en base al valor de "rol"
                // Por ejemplo, redirigir a la pantalla de administrador si el rol es "admin"
                if (rol === 'admin') {
                  navigation.replace('Administrador');
                } else {
                  navigation.replace('Estudiante');
                }
              }
            })
            .catch(error => {
              // Manejar errores de Firestore
              console.log(error);
            });
        }
      })
    .catch(error => alert(error.message))
}

  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
    >
        <Image style={styles.logo}
        source={require('../img/logo_lockBlock.png')}/>
      <View style={styles.inputContainer}>
        <TextInput
            placeholder='Correo'
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
        />
        <TextInput
            placeholder='Password'
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
            onPress={handleLogin}
            // onPress={handleSignUp}
            style={styles.button}
        >
            <Text style={styles.buttonText}>Iniciar Sesion</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#232c3d'
    },
    inputContainer:{
        width: '80%'
    },
    input:{
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer:{
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    button:{
        backgroundColor: '#5ef785',
        width: '100%',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 18
    },
    logo:{
        width: 250,
        height: 250
    }
})