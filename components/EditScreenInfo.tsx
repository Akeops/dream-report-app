import React from 'react';
import { StyleSheet } from 'react-native';

import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text, View } from './Themed';

import Colors from '@/constants/Colors';

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          - <Text style={styles.boldText}>Enregistrement des rêves :</Text> Notez facilement le contenu de vos rêves, vos sentiments et tout ce qui vous semble pertinent.
        </Text>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          - <Text style={styles.boldText}>Analyse des rêves :</Text> Grâce à notre intégration avec l'API MeaningCloud, obtenez des insights sur les thèmes et les motifs récurrents dans vos rêves.
        </Text>
        <Text
            style={styles.getStartedText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
          - <Text style={styles.boldText}>Catégorisation :</Text> Classez vos rêves en catégories comme lucides ou cauchemars, pour un suivi plus facile.
        </Text>
        <Text
            style={styles.getStartedText}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)">
          - <Text style={styles.boldText}>Confidentialité garantie :</Text> Vos rêves sont privés et stockés en toute sécurité sur votre appareil.
        </Text>
      </View>



      <View style={styles.helpContainer}>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 5,
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
});
