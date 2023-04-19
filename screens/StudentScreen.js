import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView,StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import {auth} from '../firebase'
import firebase from 'firebase/app';
import { useNavigation } from '@react-navigation/native'
import { BarCodeScanner } from 'expo-barcode-scanner';


const StudentScreen = () => {
    const navigation = useNavigation()
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [qrcodeId, setQRCodeId] = useState(null);

    const handleSignOut = () =>{
        auth
        .signOut()
        .then(()=>{
            navigation.replace('Login');
        })
        .catch(error => alert(error.message))
    }
    
    useEffect(() => {
        (async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);
    
      
      const handleBarCodeScanned = async ({ type, data }) => {
        const firestore = firebase.firestore
        setScanned(true);
    
        const snapshot = await firestore().collection('qrcodes').where('text', '==', data).get();
        // const snapshot = await qrcodesRef.where('text', '==', data).get();
    
        if (!snapshot.empty) {
          const qrcodeDoc = snapshot.docs[0];
          const qrcodeData = qrcodeDoc.data();
    
          const alumnosRef = firestore().collection('alumnos').doc(qrcodeData.qrcodeId).get();
        //   const alumnoDoc = await alumnosRef.get();
    
          if (alumnosRef.exists) {
            setQRCodeId(qrcodeDoc.id);
            alert('¿Deseas abrir el locker?');
          }
        }
      };
      

      if (hasPermission === null) {
        return <Text>Obteniendo permisos de cámara...</Text>;
      }
      if (hasPermission === false) {
        return <
        Text>No se tienen permisos para acceder a la cámara.</Text>;
      }

  return (
    <KeyboardAvoidingView style={styles.container}>
        <View style={styles.box}>
            <Text style={styles.userLoginText}>Email: {auth.currentUser?.email}</Text>
            <TouchableOpacity
                onPress={handleSignOut}
            style={styles.logOutButton}
            >
            <Text style={styles.logOutButtonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.scanContainer}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && (
            <TouchableOpacity style={styles.scanButton} onPress={() => setScanned(false)}>
                <Text style={styles.scanButtonText}>Abrir casillero</Text>
            </TouchableOpacity>
            )}
        </View>
    </KeyboardAvoidingView>
  )
}

export default StudentScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#232c3d',
        flexDirection: 'column',
        // flexWrap:'wrap',
        // alignContent: 'space-between',
    },
    box:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        // flex:1,
    },
    userLoginText:{
        flex:3,
        alignSelf: 'flex-start',
        justifyContent:'center',
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
        marginHorizontal: 15,
        marginVertical: 10,
        
    },
    logOutButton:{
        flex:1,
        alignSelf: 'flex-end',
        backgroundColor: '#4ac369',
        width: '15%',
        padding: 12,
        borderRadius: 10,
        marginHorizontal: 8,
        marginVertical: 5,
        
    },
    logOutButtonText:{
        textAlign:'center',
        color: 'white',
        fontWeight: '700',
        fontSize: 14
    },
    scanContainer:{
        flex: 5,
        // flexDirection:'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical:10,
        marginVertical:20,
    },
    scanButton: {
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        backgroundColor: '#4ac369',
        paddingHorizontal: 50,
        paddingVertical: 30,
        borderRadius: 5,
        marginVertical: 20,
    },
    scanButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    closeButton: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginVertical: 20,
    },
    closeButtonText: {
        color: '#007AFF',
        fontSize: 18,
    },

})