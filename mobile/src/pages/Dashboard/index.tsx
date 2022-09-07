import React, { useState, useContext } from "react";
import { 
    View, 
    Text,
    SafeAreaView,
    TouchableOpacity,
    StyleSheet,
    TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthContext } from "../../contexts/AuthContext";
import { StackParamsList } from "../../routes/app.routes";
import { api } from "../../services/api";

export default function Dashboard(){
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const [number, setNumber] = useState('');
    const { signOut} = useContext(AuthContext);


    async function openOrder() {
        if(number === ''){
            return;
        }

        const response = await api.post('/order', {
            table: Number(number)
        })

        //made request and redirect to next "page"
        navigation.navigate('Order', { number: number, order_id: response.data.id})
        
        setNumber('');
    }

    return(
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.signOutbutton}  onPress={signOut}>
                {/* <Text style={styles.textButton}>Finalizar pedido</Text> */}
                <Feather name='log-out' size={25} color='#FFF' />
            </TouchableOpacity>
            

            <Text style={styles.title}>Novo Pedido</Text>

            <TextInput
                placeholder="Número da mesa"
                placeholderTextColor="#F0F0F0"
                style={styles.input}
                keyboardType="numeric"
                value={number}
                onChangeText={setNumber}
            />

            <TouchableOpacity style={styles.button} onPress={openOrder}>
                <Text style={styles.buttonText}>Abrir mesa</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: '#1d1d2e'
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: '#FFF',
        marginBottom: 24
    },
    input: {
        width: '90%',
        height: 60,
        backgroundColor: '#101026',
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: 'center',
        fontSize: 22,
        color: '#FFF'
    },
    button: {
        width: '90%',
        height: 40,
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText :{
        fontSize: 18,
        color: '#101026',
        fontWeight: 'bold'
    },
    signOutbutton:{
        position: 'absolute',
        top: '5%',
        right: '5%',
        backgroundColor:'#101026',
        padding: 10,
        borderRadius: 4
    }
})