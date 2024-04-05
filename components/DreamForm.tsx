import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { TextInput, Snackbar, Chip, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { DreamData } from '@/models/types';

const { width } = Dimensions.get('window');

export default function DreamForm() {
    const [titleText, setTitleText] = useState('');
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
                title: titleText,
                text: dreamText,
                isLucid: isLucidDream,
                isNightmare: isNightmare,
                isChecked: false,
                apiInfo: {
                    conceptList: [],
                    entitiesList: []
                },
                date: new Date().toISOString()
            };

            const existingData = await AsyncStorage.getItem('dreamFormDataArray');
            const formDataArray = existingData ? JSON.parse(existingData) : [];

            formDataArray.push(newDreamToPush);
            await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(formDataArray));
            await AsyncStorage.setItem('lastUpdate', Date.now().toString());

            console.log('AsyncStorage: ', await AsyncStorage.getItem('dreamFormDataArray'));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des données:', error);
        }
        await AsyncStorage.setItem('lastUpdate', Date.now().toString()); // Enregistrement de la date actuelle comme dernier update

        // Réinitialisation du formulaire
        setTitleText('');
        setDreamText('');
        setIsLucidDream(false);
        setIsNightmare(false);
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
                label="Titre"
                value={titleText}
                onChangeText={setTitleText}
                mode="outlined"
                textColor={"black"}
                multiline
                numberOfLines={1}
                style={styles.input}
            />
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
                            backgroundColor: isNightmare ? "#872d2d" : "#d1d1d1",
                            borderColor: "#d1d1d1",
                        }
                    ]}
                    textStyle={[styles.chipText, isNightmare ? { color: "#FFFFFF" } : { color: "#000000" }]}
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
        paddingHorizontal: 50,
        marginTop: 20,
    },
    button: {
        borderRadius: 15,
        marginBottom: 5,
        padding: 10,
        elevation: 2,
        backgroundColor: '#4FC3F7',
    },
    submitButton: {
        backgroundColor: '#549fdc',
    },
    resetButton: {
        backgroundColor: '#EF5350',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});