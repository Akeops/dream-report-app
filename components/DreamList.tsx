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
    const checkedColor = "#6200EE"; // Exemple: violet
    // La couleur de la checkbox quand elle n'est pas cochée
    const uncheckedColor = "#000"; // Exemple: noir

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
        {dreams.map((dream) => (
            <View
                key={dream.id}
                style={[
                  styles.dreamItem,
                  {
                    // Appliquer la couleur de bordure basée sur la catégorie
                    borderColor: dream.isLucid ? '#3d3d3d' : dream.isNightmare ? '#3d3d3d' : '#3d3d3d',
                    // Appliquer un fond subtil
                    backgroundColor: dream.isLucid ? '#15a426' : dream.isNightmare ? '#aa0a0a' : '#158a8c',
                  }
                ]}
            >
              <Checkbox
                  status={dream.isChecked ? 'checked' : 'unchecked'}
                  onPress={() => handleCheckboxChange(dream.id)}
                  color={dream.isChecked ? "#3d3d3d" : "#3d3d3d"} // Appliquer la couleur basée sur l'état isChecked
                  uncheckedColor={"#3d3d3d"} // Couleur quand la checkbox n'est pas cochée (seulement pour certaines versions)
              />
              <Text
                  style={[
                    styles.dreamText,
                    {
                      // Changer la couleur du texte basée sur la catégorie si désiré
                      color: dream.isLucid ? '#000000' : dream.isNightmare ? '#000000' : '#000000',
                    }
                  ]}
              >
                {dream.text} {dream.isLucid ? '- Lucide' : dream.isNightmare ? '- Cauchemar' : ''}
              </Text>
            </View>
        ))}
        {showDeleteMessage && (
            <Text style={styles.deleteMessage}>Rêves supprimés avec succès!</Text>
        )}
        {isAnyDreamChecked && (
            <View style={styles.deleteButtonContainer}>
              <Button title="Supprimer" onPress={removeCheckedDreams} color="#292929" />
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
    marginLeft: 10,
  },
  listContainer: {
    padding: 10,
  },
  dreamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 4,
    borderWidth: 2, // Met en évidence la couleur de la bordure
    borderRadius: 15, // Adoucit les bords
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
  },
  lucidDream: {
    backgroundColor: '#ADD8E6', // Exemple de couleur pour les rêves lucides
  },
  nightmareDream: {
    backgroundColor: '#952424', // Exemple de couleur pour les cauchemars
  },
});

export default DreamList;