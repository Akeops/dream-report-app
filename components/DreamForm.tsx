import React, { createContext, useContext, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TextInput, Button, Checkbox, Chip, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DreamData } from '../models/types'; // Ajustez le chemin selon votre structure de fichiers
import { v4 as uuidv4 } from 'uuid';

const { width } = Dimensions.get('window');

export default function DreamForm() {
    const [dreamText, setDreamText] = useState('');
    const [isLucidDream, setIsLucidDream] = useState(false);
    const newDreamId = uuidv4();
    console.log(newDreamId);

    const handleResetDream = async () => {
       try {
            await AsyncStorage.clear();
            console.log('AsyncStorage effacé avec succès.');
        } catch (error) {
            console.error('Erreur lors de l\'effacement de AsyncStorage : ', error);
        }
    };

    const handleDreamSubmission = async () => {
        try {
            const newDreamToPush: DreamData = {
                id: uuidv4(),
                text: dreamText, // Utilisation de dreamText ici
                isLucid: isLucidDream,
                isChecked: false,
                apiInfo: {
                    conceptList: [],
                    entitiesList: []
                }
            };

            const apiUrl = 'https://api.meaningcloud.com/topics-2.0';
            const language = 'fr';
            const apiKey = ""; // Consider storing API keys securely

            const formdata = new FormData();
            formdata.append('key', apiKey);
            formdata.append('txt', dreamText);
            formdata.append('lang', language);

            const requestOptions: RequestInit = {
                method: 'POST',
                body: formdata,
                redirect: 'follow',
            };

            const response = await fetch(apiUrl, requestOptions);
            const responseData = await response.json();

            // newDreamToPush.apiInfo.conceptList = responseData.concept_list || [];
            // newDreamToPush.apiInfo.entitiesList = responseData.entity_list || [];

            const existingData = await AsyncStorage.getItem('dreamFormDataArray');
            const formDataArray = existingData ? JSON.parse(existingData) : [];

            formDataArray.push(newDreamToPush);
            await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(formDataArray));
            await AsyncStorage.setItem('lastUpdate', Date.now().toString());

            console.log('AsyncStorage: ', await AsyncStorage.getItem('dreamFormDataArray'));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des données:', error);
        }
        
        // Réinitialisation du formulaire
        setDreamText('');
        setIsLucidDream(false);
    };

return (
    <View style={styles.container}>
        <TextInput
            label="Rêve"
            editable={true} // Permet d'y mettre du texte.
            value={dreamText}
            onChangeText={(text) => setDreamText(text)}
            mode="outlined"
            multiline
            outlineColor={"#1aaac0"}
            textColor={"black"}
            numberOfLines={3}
            style={[
                styles.input,
                { width: width * 0.8, alignSelf: 'center', backgroundColor: 'white' }
            ]} // Pour que l'input fasse 80% de la largeur de l'écran.
        />

        <View style={{ flexDirection: 'column' }}>
            <Text>Catégories: {"\n"}</Text>
            <View style={styles.checkboxContainer}>
                <Chip
                    mode="outlined"
                    selected={isLucidDream}
                    onPress={() => setIsLucidDream(!isLucidDream)}
                    selectedColor="#1aaac0"
                    style={{ backgroundColor: isLucidDream ? "#1aaac0" : "transparent", borderColor: "#1aaac0" }}
                    textStyle={{ color: isLucidDream ? "#ffffff" : "#1aaac0" }}
                    showSelectedCheck={false}
                >
                    Rêve Lucide
                </Chip>
            </View>
        </View>
            
        <Button mode="contained" onPress={handleDreamSubmission} style={styles.button} buttonColor="#1989a1">
            Soumettre
        </Button>
        <Button mode="contained" onPress={handleResetDream} style={styles.button} buttonColor="#1989a1">
            Reset
        </Button>
    </View>
    );
}

const styles = StyleSheet.create({
        container: {
        padding: 16,
    },
    input: {
        marginBottom: 16,
        color: "black"
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    },
});
