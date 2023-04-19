import React, {useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, TouchableOpacity, View, TextInput, } from 'react-native'
import { auth } from '../firebase'
import firebase from 'firebase/app';
// import 'firebase/firestore';
// import firestore from '@react-native-firebase/firestore';

const AdminScreen = () => {
    const navigation = useNavigation()

    // Generador Qr Inicio
    const firestore = firebase.firestore;

    const [numQrcodes, setNumQrcodes] = useState(1);
    const [qrText, setQrText] = useState('');
    const [qrCodes, setQrCodes] = useState([]);

    // Generar el texto de 5 letras aleatorias para cada QR
    const generateRandomText = () => {
        const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let randomText = '';
        for (let i = 0; i < 5; i++) {
            randomText += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }
        return randomText;
    }

      const createQrcodes = async () => {
        const newQrCodes = [];
        for (let i = 0; i < parseInt(numQrcodes); i++) {
          const randomText = generateRandomText();
          const status = "disponible";
          const qrData = {
            text: randomText,
            status: status,
          };
          await firestore().collection('qrcodes').add(qrData);
          newQrCodes.push(randomText);
        }
        setQrCodes(newQrCodes);
        setNumQrcodes('');
        setQrText('');
        alert("Codigos Qr creados en base de datos")
      };
    //   createQrcodes();
  
    // Generador Qr Fin

    const handleSignOut = () =>{
        auth
        .signOut()
        .then(()=>{
            navigation.replace('Login');
        })
        .catch(error => alert(error.message))
    }

    const handleStudents = () =>{
        navigation.navigate('Registro');
    }
    const handleStudentsList = () =>{
        navigation.navigate('Lista');
    }

  return (
    <View style={styles.container}>
        <View style={styles.headerContainer}>
            <Text style={styles.text}>Email: {auth.currentUser?.email}</Text>
        
            <TouchableOpacity
                onPress={handleSignOut}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.bodyContainer}>
            <TouchableOpacity
                onPress={handleStudents}
                style={styles.buttonStudents}
            >
            <Text style={styles.buttonText}>Crear Estudiante</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleStudentsList}
                style={styles.buttonStudents}
            >
            <Text style={styles.buttonText}>Lista de Estudiantes</Text>
            </TouchableOpacity>
            {/* Form Qr Inicio */}
            <TextInput
                placeholder="Número de códigos QR a generar"
                // keyboardType="numeric"
                value={numQrcodes}
                style={styles.input}
                onChangeText={(text) => setNumQrcodes(text)}
            />
            <TextInput
                placeholder="Seccion"
                value={qrText}
                style={styles.input}
                onChangeText={(text) => setQrText(text)}
            />
            <TouchableOpacity  
                style={styles.button2}
                onPress={createQrcodes}>
                    <Text style={styles.buttonText}>Generar Qrs</Text>
                </TouchableOpacity>
            {/*  Form Qr fin */}            
        </View>
    </View>
  )
}


export default AdminScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#232c3d',
        // alignItems: 'center',
        // justifyContent: 'center',
        // flexDirection: 'column',
        // flexWrap:'wrap',
        // alignContent: 'space-between',
    },
    headerContainer:{
        flex: 1,
        flexDirection: 'row',
        flexWrap:'wrap',
        alignItems: 'center',
        marginTop: 8,
        // alignContent: 'space-between',
    },
    bodyContainer:{
        flex: 4,
        backgroundColor: '#2f3a4e',
        borderRadius: 10,
        paddingTop: 15,
        marginHorizontal: 12,
        marginVertical: 10,
        // alignContent: 'space-between',
    },
    text:{
        alignSelf: 'flex-start',
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
        marginRight: 110,
        marginTop: 10,
        marginLeft: 8
    },
    button:{
        alignSelf: 'flex-end',
        backgroundColor: '#4ac369',
        width: '20%',
        padding: 12,
        borderRadius: 10,
        marginTop: 5,
        
    },
    button2:{
        alignSelf: 'center',
        backgroundColor: '#232c3d',
        borderColor: '#5ef785',
        borderWidth: 2 ,
        width: '50%',
        padding: 15,
        borderRadius: 10,
        marginTop: 15,
        marginLeft: 145,
        
    },
    buttonText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
        textAlign: 'center',
        
    },
    buttonStudents:{
        alignSelf: 'center',
        justifyContent:'flex-start',
        backgroundColor: '#232c3d',
        borderColor: '#5ef785',
        borderWidth: 2 ,
        width: '90%',
        padding: 20,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 10,
        
    },
    input:{
        width: '90%',
        alignSelf:'center',
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10
    },
})
