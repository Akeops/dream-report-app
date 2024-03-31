import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DreamData } from '@/models/types';
import { Checkbox } from 'react-native-paper';

type ColorSchemeType = 'standard' | 'daltonien';
const colorSchemes = {
  standard: {
    lucide: '#c0bff3',
    cauchemar: '#c24040', // Rouge framboise: #E30B5D
    ordinaire: '#dcdcdc',
  },
  daltonien: {
    lucide: '#87CEEB',
    cauchemar: '#872d2d',
    ordinaire: '#dcdcdc',
  }
};
const DreamList: React.FC = () => {
  const [lastUpdate, setLastUpdate] = useState('');
  const [dreams, setDreams] = useState<DreamData[]>([]);
  const [showDeleteMessage, setShowDeleteMessage] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorSchemeType>('standard');

  const currentColors = colorSchemes[colorScheme] || colorSchemes.standard;

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
        <TouchableOpacity
            onPress={() => setColorScheme(colorScheme === 'standard' ? 'daltonien' : 'standard')}
            style={styles.toggleButton}
        >
          <Text style={styles.toggleButtonText}>
            {colorScheme === 'standard' ? 'Daltoniens' : 'Standard'}
          </Text>
        </TouchableOpacity>
        <View style={styles.legendContainer}>
          {Object.entries(colorSchemes[colorScheme]).map(([key, color]) => (
              <View key={key} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: color }]} />
                <Text style={styles.legendText}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              </View>
          ))}

        </View>
        {dreams.map((dream) => (
            <View
                key={dream.id}
                style={[
                  styles.dreamItem,
                  {
                    backgroundColor: colorSchemes[colorScheme][
                        dream.isLucid ? 'lucide' : dream.isNightmare ? 'cauchemar' : 'ordinaire'
                        ],
                  },
                ]}
            >
              <Checkbox
                  status={dream.isChecked ? 'checked' : 'unchecked'}
                  onPress={() => handleCheckboxChange(dream.id)}
                  color="#3d3d3d" // Couleur lorsque la case est cochée, ici un orange par exemple.
                  uncheckedColor="#4f4f4f" // Couleur lorsque la case n'est pas cochée
              />
              <Text style={styles.dreamText}>{dream.text}</Text>
            </View>
        ))}
        {dreams.length === 0 && (
            <Text style={styles.emptyListText}>La liste des rêves est vide.</Text>
        )}
        {showDeleteMessage && <Text style={styles.deleteMessage}>Rêves supprimés avec succès!</Text>}
        {isAnyDreamChecked && (
            <View style={styles.deleteButtonContainer}>
              <Button
                  title="Supprimer"
                  onPress={removeCheckedDreams}
                  color="#549fdc" // Pour les boutons qui n'acceptent que la propriété color pour leur style
              />
            </View>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  toggleButton: {
    backgroundColor: '#4f4f4f',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 20,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  legendText: {
    fontSize: 16,
  },
  dreamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 4,
    borderRadius: 5,
  },
  dreamText: {
    marginLeft: 10,
    fontSize: 16,
  },
  emptyListText: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  deleteButtonContainer: {
    borderRadius: 20, // Coins arrondis pour le bouton
    padding: 10, // Espace autour du texte du bouton
    backgroundColor: '#549fdc', // Couleur de fond pour le bouton de suppression
    marginTop: 10, // Espace au-dessus du bouton
    marginBottom: 10, // Espace en dessous du bouton
    elevation: 2, // Ombre sur Android
    shadowOpacity: 0.3, // Opacité de l'ombre pour iOS
    shadowRadius: 3, // Rayon de l'ombre pour iOS
    shadowColor: '#000', // Couleur de l'ombre pour iOS
    shadowOffset: { width: 0, height: 2 }, // Décalage de l'ombre pour iOS
    alignSelf: 'center', // Centre le bouton dans son conteneur
    width: '90%', // Largeur du bouton par rapport à son conteneur
  },
  deleteMessage: {
    textAlign: 'center',
    color: 'green',
    fontSize: 16,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingTop: 10,
    textAlign: 'center', // Centrez le titre si désiré
  },
});

export default DreamList;