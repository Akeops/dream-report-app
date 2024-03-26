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
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
