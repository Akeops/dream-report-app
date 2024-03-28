import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DreamData } from '@/models/types';
import { Checkbox } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';

const DreamList: React.FC = () => {
  const [lastUpdate, setLastUpdate] = useState('');
  const [dreams, setDreams] = useState<DreamData[]>([]);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);

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

  }, []); // Dépendances vides pour exécuter une fois au montage

  const handleCheckboxChange = (id: string) => {
    setDreams(dreams.map(dream => {
      if (dream.id === id) {
        return { ...dream, isChecked: !dream.isChecked };
      }
      return dream;
    }));
  };

  // Fonction pour vérifier si au moins un rêve est coché
  const isAnyDreamChecked = dreams.some(dream => dream.isChecked);

  const removeCheckedDreams = async () => {
    const uncheckedDreams = dreams.filter(dream => !dream.isChecked);

    // Mettre à jour l'état local
    setDreams(uncheckedDreams);

    // Afficher le message de suppression
    setShowDeleteMessage(true);

    // Masquer le message après 3 secondes
    setTimeout(() => {
      setShowDeleteMessage(false);
    }, 3000);

    // Mettre à jour AsyncStorage
    try {
      await AsyncStorage.setItem('dreamFormDataArray', JSON.stringify(uncheckedDreams));
      console.log("Les rêves cochés ont été supprimés.");
    } catch (error) {
      console.error("Erreur lors de la mise à jour d'AsyncStorage:", error);
    }
  };

  console.log(`Dreams De DREAMLIST :${JSON.stringify(dreams)}`)

  return (
      <View style={styles.listContainer}>
        <Text style={styles.title}>Liste des Rêves :</Text>
        {dreams.map((dream) => (
            <View key={dream.id} style={styles.dreamItem}>
              <Checkbox
                  status={dream.isChecked ? 'checked' : 'unchecked'}
                  onPress={() => handleCheckboxChange(dream.id)}
              />
              <Text style={styles.dreamText}>
                {dream.text} - {dream.isLucid ? 'Lucide' : 'Non Lucide'}

              </Text>
            </View>
        ))}
        {showDeleteMessage && (
            <Text style={styles.deleteMessage}>Rêves supprimés avec succès!</Text>
        )}
        {isAnyDreamChecked && (
            <View style={styles.deleteButtonContainer}>
              <Button title="Supprimer" onPress={removeCheckedDreams} color="#5396c2" />
            </View>

        )}
      </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dreamText: {
    flex: 1,
    fontSize: 16,
    marginRight: 10,
  },
  listContainer: {
    borderWidth: 1,
    borderColor: '#4c99e5',
    borderRadius: 5,
    padding: 10,
  },
  dreamItem: {
    flexDirection: 'row', // Organise le texte et la checkbox en ligne
    alignItems: 'center', // Centre les éléments verticalement
    backgroundColor: '#f0f0f0', // Un fond légèrement gris pour chaque élément
    padding: 10, // Ajoute de l'espace autour du contenu de chaque élément
    borderBottomWidth: 1, // Ajoute une bordure en bas pour séparer les éléments
    borderRadius: 10,
    borderColor: '#94c8eb', // Couleur de la bordure
    marginBottom: 5, // Espacement entre les éléments
  },
  deleteButtonContainer: {
    borderRadius: 20,
    overflow: 'hidden', // Assure que le bord arrondi est appliqué
    margin: 10
  },
  deleteMessage: {
    color: 'green', // ou toute autre couleur selon votre design
    textAlign: 'center',
    padding: 10,
  }
});

export default DreamList;