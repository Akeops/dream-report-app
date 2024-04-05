import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DreamData } from '@/models/types';
import {Checkbox, TextInput} from 'react-native-paper';

type ColorSchemeType = 'standard' | 'daltonien';
const colorSchemes = {
  standard: {
    lucide: '#c0bff3',
    cauchemar: '#c24040',
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDreams, setFilteredDreams] = useState<DreamData[]>([]);

  const currentColors = colorSchemes[colorScheme] || colorSchemes.standard;

  useEffect(() => {
    const filtered = dreams.filter(dream =>
        dream.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDreams(filtered);
  }, [dreams, searchQuery]);

  const handleResetSearch = () => {
    setSearchQuery('');
    setFilteredDreams(dreams); // Réinitialisez à la liste complète des rêves
  };

  useEffect(() => {
    const fetchAndUpdateDreams = async () => {
      try {
        const storedDreams: string | null = await AsyncStorage.getItem('dreamFormDataArray');
        const lastUpdateStored = await AsyncStorage.getItem('lastUpdate');
        if (storedDreams) {
          const dreams = JSON.parse(storedDreams);
          setDreams(dreams);
        }
        if (lastUpdateStored) {
          setLastUpdate(new Date(parseInt(lastUpdateStored)).toLocaleString()); // Convertit la timestamp en date lisible
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
    setDreams(uncheckedDreams);
    setShowDeleteMessage(true);
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
      <ScrollView style={styles.listContainer}>
        <TouchableOpacity
            onPress={() => setColorScheme(colorScheme === 'standard' ? 'daltonien' : 'standard')}
            style={styles.toggleButton}
        >
          <Text style={styles.toggleButtonText}>
            {colorScheme === 'standard' ? 'Daltoniens' : 'Standard'}
          </Text>
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
              style={[styles.searchInput, { backgroundColor: 'transparent' }]}
              onChangeText={setSearchQuery}
              value={searchQuery}
              placeholder="Rechercher un rêve..."
              theme={{
                colors: {
                  primary: '#137ab6',
                  text: '#000000',
                  placeholder: 'blue',
                },
              }}
          />
          <TouchableOpacity onPress={handleResetSearch} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>X</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.legendContainer}>
          {Object.entries(colorSchemes[colorScheme]).map(([key, color]) => (
              <View key={key} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: color }]} />
                <Text style={styles.legendText}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              </View>
          ))}

        </View>
        {filteredDreams.map((dream) => (
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
                  color="#3d3d3d"
                  uncheckedColor="#4f4f4f" // Couleur lorsque la case n'est pas cochée
              />
              <View style={styles.dreamContent}>
                <View style={styles.titleAndDateContainer}>
                  <Text style={styles.dreamTitle}>{dream.title}</Text>
                    <Text style={styles.dreamDate}>{new Date(dream.date).toLocaleDateString()}</Text>
                </View>
                  <Text style={styles.dreamText}>{dream.text}</Text>
              </View>
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
                  color="#549fdc"
              />
            </View>
        )}
      </ScrollView>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#000000',
  },
  resetButton: {
    padding: 8,
    marginLeft: 10,
  },
  resetButtonText: {
    color: '#555',
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
  dreamContent: {
    marginLeft: 10,
  },
  dreamTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dreamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyListText: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  deleteButtonContainer: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#549fdc',
    marginTop: 10,
    marginBottom: 10,
    elevation: 2,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    alignSelf: 'center',
    width: '90%',
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
    marginRight: 8,
    paddingTop: 10,
    textAlign: 'center',
  },
  titleAndDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  dreamDate: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 7,
    right: 0,
    top: 0,
  },
});

export default DreamList;