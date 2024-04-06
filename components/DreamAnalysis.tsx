import React, { useState } from 'react';
import {View, Text, Button, StyleSheet, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiResponse {
    concept_list?: Array<{ relevance: string; form: string; sementity: { type: string; } }>;
    entity_list?: Array<{ relevance: string; form: string; sementity: { type: string; } }>;
}

export default function DreamAnalysis() {
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

    const handleApiRequest = async () => {
        try {
			const storedData = await AsyncStorage.getItem("dreamFormDataArray");
			const tableau = storedData ? (JSON.parse(storedData) as string[]) : [];
			let dernierElement = tableau[tableau.length - 1];
			const tmpDream = dernierElement.text; // Accès direct à la propriété 'text'


			const apiUrl = "https://api.meaningcloud.com/topics-2.0";
			const language = "fr";
            //console.log(dernierElement.text);
            console.log(tmpDream);
			const apiKey = "VOTRE CLE API"; // Se référer au fichier README.md pour toutes informations sur l'accès à une clé API
			const formdata = new FormData();
			formdata.append("key", apiKey);
			formdata.append("txt", tmpDream);
			formdata.append("lang", language);

			const requestOptions = {
				method: "POST",
				body: formdata,
			};

			const response = await fetch(apiUrl, requestOptions);
			const responseData = await response.json();
			setApiResponse(responseData);
			console.log("Réponse de l'API MeaningCloud :", responseData);
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
                <ScrollView>
                    {renderTable()}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
	tableHeader: {
		fontWeight: "bold",
		flex: 1, // Utilisez flex pour que les en-têtes et les cellules s'ajustent automatiquement
		textAlign: "center", // Centrer le texte dans l'en-tête
		fontSize: 14, // Ajustez la taille de la police au besoin
		padding: 5, // Ajustez le padding pour réduire l'espace si nécessaire
	},
	tableCell: {
		flex: 1, // Utilisez flex pour que les en-têtes et les cellules s'ajustent automatiquement
		textAlign: "center", // Centrer le texte dans la cellule
		fontSize: 12, // Ajustez la taille de la police pour les cellules
		padding: 5, // Ajustez le padding pour réduire l'espace si nécessaire
	},
});