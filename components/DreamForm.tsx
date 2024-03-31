import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TextInput, Snackbar, Chip, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { DreamData } from '../models/types';

const { width } = Dimensions.get('window');

export default function DreamForm() {
    const [dreamText, setDreamText] = useState('');
    const [isLucidDream, setIsLucidDream] = useState(false);
    const [isNightmare, setIsNightmare] = useState(false);
    const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

    const handleResetDream = async () => {
       try {
            await AsyncStorage.clear();
            console.log('AsyncStorage effacé avec succès.');
        } catch (error) {
            console.error('Erreur lors de l\'effacement de AsyncStorage : ', error);
        }
    };

    const handleDreamSubmission = async () => {

        if (dreamText.trim() === '') {
            setIsSnackbarVisible(true);
            return;
        }
        try {
            const newDreamToPush: DreamData = {
                id: uuidv4(),
                text: dreamText,
                isLucid: isLucidDream,
                isNightmare: isNightmare,
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

    const handleLucidDreamToggle = () => {
        setIsLucidDream(!isLucidDream); // Change l'état de Rêve Lucide
        if (isNightmare) {
            setIsNightmare(false); // Décoche automatiquement Cauchemar si coché
        }
    };

    // Lorsque l'utilisateur sélectionne "Cauchemar"
    const handleNightmareToggle = () => {
        setIsNightmare(!isNightmare); // Change l'état de Cauchemar
        if (isLucidDream) {
            setIsLucidDream(false); // Décoche automatiquement Rêve Lucide si coché
        }
    }

    return (
        <View style={styles.container}>
            <Snackbar
                visible={isSnackbarVisible}
                onDismiss={() => setIsSnackbarVisible(false)}
                duration={3000}
                style={styles.snackbar}
            >
                Le champ du rêve ne peut pas être vide.
            </Snackbar>

            <TextInput
                label="Rêve"
                value={dreamText}
                onChangeText={setDreamText}
                mode="outlined"
                textColor={"black"}
                multiline
                numberOfLines={3}
                style={styles.input}
            />

            <Text style={styles.categoryText}>Catégories:</Text>
            <View style={styles.checkboxContainer}>
                <Chip
                    mode="outlined"
                    selected={isLucidDream}
                    onPress={handleLucidDreamToggle}
                    style={[
                        styles.chip,
                        {
                            backgroundColor: isLucidDream ? "#7e71e1" : "#d1d1d1", // Bleu ciel pour sélectionné, gris sinon
                            borderColor: "#d1d1d1", // Gris pour la bordure
                        }
                    ]}
                    textStyle={[styles.chipText, isLucidDream ? { color: "#FFFFFF" } : { color: "#000000" }]} // Blanc si sélectionné, noir sinon
                >
                    Rêve Lucide
                </Chip>

                <Chip
                    mode="outlined"
                    selected={isNightmare}
                    onPress={handleNightmareToggle}
                    style={[
                        styles.chip,
                        {
                            backgroundColor: isNightmare ? "#872d2d" : "#d1d1d1", // Orange pour sélectionné, gris sinon
                            borderColor: "#d1d1d1", // Gris pour la bordure, uniforme avec l'autre Chip
                        }
                    ]}
                    textStyle={[styles.chipText, isNightmare ? { color: "#FFFFFF" } : { color: "#000000" }]} // Blanc si sélectionné, noir sinon
                >
                    Cauchemar
                </Chip>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={handleDreamSubmission}
                    style={[styles.button, styles.submitButton]}
                    labelStyle={styles.buttonText}
                >
                    Soumettre
                </Button>

                <Button
                    mode="contained"
                    onPress={handleResetDream}
                    style={[styles.button, styles.resetButton]}
                    labelStyle={styles.buttonText}
                >
                    Reset
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    input: {
        marginBottom: 16,
        backgroundColor: 'white',
        width: width * 0.8,
        alignSelf: 'center',
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    categoryText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5d5d5d',
        marginBottom: 8,
        textAlign: 'center',
    },
    chip: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 4,
    },
    chipSelected: {
        marginHorizontal: 4,
        backgroundColor: "#4FC3F7",
        borderColor: "#4FC3F7",
    },
    chipText: {
        color: "#FFFFFF",
    },
    snackbar: {
        maxWidth: 295,
        alignSelf: 'center',
    },
    buttonContainer: {
        justifyContent: 'space-between',
        paddingHorizontal: 50, // Ajustez selon votre layout
        marginTop: 20,
    },
    button: {
        borderRadius: 15,
        marginBottom: 5,
        padding: 10,
        elevation: 2, // Seulement pour Android
        backgroundColor: '#4FC3F7',
    },
    submitButton: {
        backgroundColor: '#549fdc', // Couleur pour le bouton Soumettre
    },
    resetButton: {
        backgroundColor: '#EF5350', // Couleur pour le bouton Reset
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});