import React, { useState, useEffect } from 'react';
import { StyleSheet,View, TextInput, TouchableOpacity,Text } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { auth } from '../firebase';
import firebase from 'firebase/app';

const CreateStudents = () => {

    const firestore = firebase.firestore;

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [qrcodes, setQrcodes] = useState([]);
    const [selectedQrcode, setSelectedQrcode] = useState('');

  // Cargar los códigos QR desde Firestore al montar el componente
  useEffect(() => {
    const fetchQrcodes = async () => {
      const querySnapshot = await firestore().collection('qrcodes').where('status', '==', 'disponible').get();
      const qrcodesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setQrcodes(qrcodesData);
    };
    fetchQrcodes();
  }, []);

  const handleCreateUser = async () => {
    try {
      // Crear el usuario en Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const { user } = userCredential;

      // Guardar los datos del usuario en Firestore
      const userData = {
        uid: user.uid,
        username,
        email,
        qrcodeId: selectedQrcode,
      };
      const rol ={
        uid: user.uid,
        rol: 'student'
      };
      await firestore().collection('alumnos').add(userData);
      await firestore().collection('users').add(rol);

      // Cambiar el estado del QR seleccionado a 'no disponible'
      await firestore().collection('qrcodes').doc(selectedQrcode).update({ status: 'no disponible' });

      alert('Usuario creado exitosamente');
      // Reiniciar los campos del formulario después de guardar los datos
      setUsername('');
      setEmail('');
      setPassword('');
      setSelectedQrcode('');
    } catch (error) {
      console.error('Error al crear el usuario: ', error);
      alert('Ocurrió un error al crear el usuario. Por favor, intenta nuevamente.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nombre del alumno"
        value={username}
        style={styles.input}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
      />
      <Picker
        selectedValue={selectedQrcode}
        style={styles.input}
        onValueChange={(itemValue) => setSelectedQrcode(itemValue)}
      >
        <Picker.Item label="Selecciona un código QR" value="" />
        {qrcodes.map((qrcode) => (
          <Picker.Item key={qrcode.id} label={qrcode.data.text} value={qrcode.data.text} />
        ))}
      </Picker>
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateUser}
      >
        <Text style={styles.buttonText}>Crear Usuario</Text>
      </TouchableOpacity>
      {/* <Button 
      title="Crear Usuario" 
      onPress={handleCreateUser} 
      /> */}
    </View>
  );
};

export default CreateStudents

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
    input:{
        width: '90%',
        alignSelf:'center',
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 20
    },
    button:{
        alignSelf: 'center',
        backgroundColor: '#232c3d',
        borderColor: '#5ef785',
        borderWidth: 2 ,
        width: '50%',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        marginLeft: 145,
        
    },
    buttonText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 18,
        textAlign: 'center',
        
    },
})