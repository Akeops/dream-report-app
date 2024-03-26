import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DreamData } from '../models/types'; // Ajustez le chemin selon votre structure de fichiers
import { useIsFocused } from '@react-navigation/native';

const DreamList: React.FC = () => {
  const [lastUpdate, setLastUpdate] = useState('');
  const [dreams, setDreams] = useState<DreamData[]>([]);

  useEffect(() => {
    const fetchAndUpdateDreams = async () => {
      try {
        const storedDreams = await AsyncStorage.getItem('dreamFormDataArray');
        if (storedDreams) {
          const dreams = JSON.parse(storedDreams);
          setDreams(dreams);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des rêves:', error);
      }
    };

    // Appel initial pour charger les données
    fetchAndUpdateDreams();

    // Optionnel: Si vous utilisez un indicateur de mise à jour dans AsyncStorage,
    // vous pouvez mettre en place un intervalle pour vérifier périodiquement les mises à jour.
    // Assurez-vous de nettoyer l'intervalle dans le retour de nettoyage de useEffect.
  }, []); // Dépendances vides pour exécuter une fois au montage

  console.log(`Dreams De DREAMLIST :${JSON.stringify(dreams)}`)
  
  return (
    <View style={styles.listContainer}>
      <Text style={styles.title}>Liste des Rêves :</Text>
      {dreams.map((dream, index) => (
        <Text key={index} style={styles.dreamText}>
          - {dream.text} - {dream.isLucid ? 'Lucide' : 'Non Lucide'}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dreamText: {
    fontSize: 16,
    marginBottom: 4,
  },
  listContainer: {
    borderWidth: 1,
    borderColor: '#4c99e5',
    // Optionnellement, pour des coins arrondis :
    borderRadius: 5,
    // Et si vous avez besoin de padding à l'intérieur de la bordure :
    padding: 10,
  },
});

export default DreamList;