import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import DreamList from '@/components/DreamList'; 

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des rêves</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <DreamList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // modifié pour aligner les éléments au début du conteneur
    paddingTop: 0, // modifié pour réduire l'espace au-dessus du titre
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20, // ajouté pour un peu d'espace au-dessus du titre
    marginBottom: 0,  // réduit pour diminuer l'espace entre le titre et la séparateur
  },
  separator: {
    marginVertical: 20, // réduit pour moins d'espace entre le titre et la liste
    height: 1,
    width: '80%',
  },
});
