import React, { useState, useEffect } from 'react';
import { StyleSheet ,View, Text, FlatList, Button, Alert, Modal, TextInput, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { auth } from '../firebase';
import firebase from 'firebase/app';
// import firestore from '@react-native-firebase/firestore';

const ListStudents = () => {

    const [users, setUsers] = useState([]);
    const [qrCodes, setQrCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editedUserId, setEditedUserId] = useState('');
    const [editedUsername, setEditedUsername] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = async () => {
        const firestore = firebase.firestore
      try {
        const usersSnapshot = await firestore().collection('alumnos').get();
        const qrCodesSnapshot = await firestore().collection('qrcodes').get();
  
        const users = [];
        usersSnapshot.forEach((doc) => {
          const user = doc.data();
          users.push({
            id: doc.id,
            username: user.username,
            email: user.email,
            qrCodeId: user.qrcodeId
          });
        });
  
        const qrCodes = [];
        qrCodesSnapshot.forEach((doc) => {
          const qrCode = doc.data();
          qrCodes.push({
            id: doc.id,
            text: qrCode.text,
            status: qrCode.status
          });
        });
  
        setUsers(users);
        setQrCodes(qrCodes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    const handleEditUser = (userId, username, email) => {
      setEditedUserId(userId);
      setEditedUsername(username);
      setEditedEmail(email);
      setEditModalVisible(true);
    };
  
    const handleUpdateUser = async () => {
      try {
        await firestore().collection('alumnos').doc(editedUserId).update({
          username: editedUsername,
          email: editedEmail
        });
        setEditModalVisible(false);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    };
  
    const handleDeleteUser = async (userId, qrCodeId) => {
      try {
        // Actualizar el estado del QR a "disponible"
        await firestore().collection('qrcodes').doc(qrCodeId).update({
            status: 'disponible'
        });
  
        // Eliminar el usuario de la colección "alumnos"
        await firestore().collection('alumnos').doc(userId).delete();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };
  
    const renderItem = ({ item }) => {
      const qrCode = qrCodes.find((qr) => qr.id === item.qrCodeId);
      return (
        <View style={styles.listItemContainer}>
          <View style={styles.infoStudent}>
            <Text style={styles.listItemText}>{item.username}</Text>
            <Text style={styles.listItemsubText}>{item.email}</Text>
            <Text style={styles.listItemsubText}>Code: {qrCode.text}</Text>
          </View>
          <View style={styles.infoQr}>
            {qrCode && qrCode.status ? (
                <QRCode 
                    value={qrCode.text} 
                    size={80}
                />
                ) : (
                <Text style={styles.listItemsubText}>No disponible</Text>
                )}
            </View>
          <View style={styles.editRemoveContainer}>
                <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditUser(item.id, item.username, item.email)}
                >
                <Text style={styles.textScreen}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                Alert.alert(
                'Eliminar Usuario',
                '¿Estás seguro de eliminar a este usuario?',
                [
                { text: 'Cancelar', style: 'cancel' },
                {
                text: 'Eliminar',
                style: 'destructive',
                onPress: () => handleDeleteUser(item.id, item.qrCodeId)
                }
                ]
                );
                }}
                >
                <Text style={styles.textScreen}>Eliminar</Text>
                </TouchableOpacity>
            </View>
        </View>
            );
        };
                // Funcion para crear lista ---- FIN

                return (
                <View style={styles.container}>
                {loading ? (
                <Text style={styles.textScreen}>Cargando...</Text>
                ) : (
                <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<Text style={styles.textScreen}>No hay usuarios registrados</Text>}
                />
                )}
                <Modal visible={editModalVisible} animationType="slide">
                <View style={styles.container}>
                  <Text style={styles.listItemText}>Editar Usuario</Text>
                  <Text style={styles.label}>Nombre del estudiante: </Text>
                  <TextInput
                    placeholder="Nombre de usuario"
                    value={editedUsername}
                    onChangeText={(text) => setEditedUsername(text)}
                    style={styles.input}
                  />
                  <Text style={styles.label}>Correo: </Text>
                  <TextInput
                    placeholder="Correo electrónico"
                    value={editedEmail}
                    onChangeText={(text) => setEditedEmail(text)}
                    style={styles.input}
                  />
                  {/* <Button title="Actualizar" onPress={handleUpdateUser} /> */}
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={handleUpdateUser}
                  >
                    <Text style={styles.textScreen}>Actualizar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text style={styles.textScreen}>Cancelar</Text>
                  </TouchableOpacity>
                  {/* <Button title="Cancelar" onPress={() => setEditModalVisible(false)} color="gray" /> */}
                </View>
              </Modal>
            </View>
            );
          };
          
          export default ListStudents;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#232c3d',
        padding: 10,
    },
    textScreen:{
        color: '#fafafa',
        fontWeight:'700',
        textAlign:'center',
    },
    listItemContainer:{
       flexDirection: 'row', 
       justifyContent: 'space-between', 
       paddingHorizontal: 10,
       backgroundColor:'#2f3a4e',
       borderRadius:5,
       paddingVertical: 15,
    },
    infoStudent:{
        flex:2,
    }
    ,
    listItemText:{
        fontWeight: 'bold', 
        fontSize: 16,
        color: 'white',
        marginBottom:5,
    },
    listItemsubText:{ 
        fontSize: 14,
        color: 'white',
        margin:3,
    },
    infoQr:{
        flex:2,
        justifyContent: 'center',
        alignItems:'flex-start',
        // backgroundColor:'#fafafa'
    },
    editRemoveContainer:{
        flex:1,
        flexDirection: 'column',
    },
    editButton:{
        alignSelf: 'center',
        backgroundColor: '#4ac369',
        width: '100%',
        borderRadius: 8, 
        padding: 5,
        margin: 2,
        alignItems: 'stretch',

    },
    removeButton:{
        alignSelf: 'center',
        backgroundColor: '#fa6566',
        width: '100%',
        borderRadius: 8, 
        padding: 8,
        margin: 2,
    },
    updateButton:{
        alignSelf: 'center',
        backgroundColor: '#4ac369',
        width: '95%',
        borderRadius: 8, 
        padding: 15,
        marginTop: 20,
        // alignItems: 'stretch',

    },
    cancelButton:{
        alignSelf: 'center',
        backgroundColor: '#fa6566',
        width: '95%',
        borderRadius: 8, 
        padding: 15,
        margin: 8,
        // alignItems: 'stretch',

    },
    input:{
        width: '95%',
        alignSelf:'center',
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5
    },
    label:{
        fontSize: 14,
        color: 'white',
        marginTop:15,
        marginHorizontal:8,
    },
    
})