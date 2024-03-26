import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { StyleSheet } from 'react-native';

interface Entry {
    relevance: number;
    form: string;
    sementity: {
        type: string;
    };
}

interface ApiResponse {
    concept_list: ConceptEntry[];
    entity_list: EntityEntry[];
}

interface ConceptEntry extends Entry {}

interface EntityEntry extends Entry {}

export default function DreamAnalysis() {
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

    const handleApiRequest = async () => {
        try {
            const apiUrl = 'https://api.meaningcloud.com/topics-2.0';
            const language = 'fr';
            const tmpDream = "Cette nuit j'ai rêvé de la terre et de l'espace";
            const apiKey = "";

            const formdata = new FormData();
            formdata.append('key', apiKey);
            formdata.append('txt', tmpDream);
            formdata.append('lang', language);

            const requestOptions: RequestInit = {
                method: 'POST',
                body: formdata,
                redirect: 'follow' as RequestRedirect,
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
        if (!apiResponse) {
            return null;
        }
        const conceptsList = apiResponse.concept_list ? apiResponse.concept_list : [];
        const entitiesList = apiResponse.entity_list ? apiResponse.entity_list : [];
        const entryList = [...conceptsList, ...entitiesList];
        return (
            <View>
                <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Tableau des données :</Text>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <Text style={styles.tableHeader}>Type d'Entrée</Text>
                    <Text style={styles.tableHeader}>Pertinence</Text>
                    <Text style={styles.tableHeader}>Terme</Text>
                    <Text style={styles.tableHeader}>Type Sémantique</Text>
                </View>
                {conceptsList.map((entry: Entry, index: number) => (
                    <View key={index} style={{ flexDirection: 'row', marginBottom: 5 }}>
                        <Text style={styles.tableCell}>Concept</Text>
                        <Text style={styles.tableCell}>{entry.relevance}</Text>
                        <Text style={styles.tableCell}>{entry.form}</Text>
                        <Text style={styles.tableCell}>{entry.sementity.type}</Text>
                    </View>
                ))}
                {entitiesList.map((entry: Entry, index: number) => (
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
