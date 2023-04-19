import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import StudentScreen from './screens/StudentScreen';
import AdminScreen from './screens/AdminScreen';
import CreateStudents from './screens/CreateStudents';
import ListStudents from './screens/ListStudents';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen name="Estudiante" component={StudentScreen} />
        <Stack.Screen name="Administrador" component={AdminScreen} />
        <Stack.Screen name="Registro" component={CreateStudents} />
        <Stack.Screen name="Lista" component={ListStudents} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
