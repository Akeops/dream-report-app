import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiResponse {
    concept_list?: Array<{ relevance: string; form: string; sementity: { type: string; } }>;
    entity_list?: Array<{ relevance: string; form: string; sementity: { type: string; } }>;
}

export default function DreamAnalysis() {
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

    const handleApiRequest = async () => {
        try {
            const storedData = await AsyncStorage.getItem('monTableau');
            const tableau = storedData ? JSON.parse(storedData) as string[] : [];
            const dernierElement = tableau[tableau.length - 1] || "Mon texte par défaut";

            const apiUrl = 'https://api.meaningcloud.com/topics-2.0';
            const language = 'fr';
            const tmpDream = dernierElement;
            const apiKey = "def79177b09e93e1a62350af066fe041";
            const formdata = new FormData();
            formdata.append('key', apiKey);
            formdata.append('txt', tmpDream);
            formdata.append('lang', language);

            const requestOptions = {
                method: 'POST',
                body: formdata,
            };

            const response = await fetch(apiUrl, requestOptions);
            const responseData = await response.json();
            setApiResponse(responseData);
            console.log('Réponse de l\'API MeaningCloud :', responseData);
        } catch (error) {
            console.error('Erreur lors de la requête à l\'API MeaningCloud :', error);
        }
    };

    const renderTable = () => {
        if (!apiResponse || (!apiResponse.concept_list && !apiResponse.entity_list)) {
            return null;
        }
        const conceptsList = apiResponse.concept_list || [];
        const entitiesList = apiResponse.entity_list || [];

        return (
            <View>
                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Tableau des données :</Text>
                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Cela analysera le dernier rêve enregistré.</Text>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <Text style={styles.tableHeader}>Type d'Entrée</Text>
                    <Text style={styles.tableHeader}>Pertinence</Text>
                    <Text style={styles.tableHeader}>Terme</Text>
                    <Text style={styles.tableHeader}>Type Sémantique</Text>
                </View>
                {conceptsList.map((entry, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={styles.tableCell}>Concept</Text>
                        <Text style={styles.tableCell}>{entry.relevance}</Text>
                        <Text style={styles.tableCell}>{entry.form}</Text>
                        <Text style={styles.tableCell}>{entry.sementity.type}</Text>
                    </View>
                ))}
                {entitiesList.map((entry, index) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={styles.tableCell}>Entity</Text>
                        <Text style={styles.tableCell}>{entry.relevance}</Text>
                        <Text style={styles.tableCell}>{entry.form}</Text>
                        <Text style={styles.tableCell}>{entry.sementity.type}</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View>
            <Button title="Effectuer la requête à MeaningCloud" onPress={handleApiRequest} />
            {apiResponse && (
                <View>
                    <Text>Réponse de l'API :</Text>
                    {renderTable()}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    tableHeader: {
        flex: 1,
        fontWeight: 'bold',
        marginRight: 5,
    },
    tableCell: {
        flex: 1,
        marginRight: 5,
    },
});