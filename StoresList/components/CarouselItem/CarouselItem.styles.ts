import { StyleSheet } from 'react-native';

import { base, colors, fonts, helpers } from 'src/styles';

export default StyleSheet.create({
  borderStyle: {
    borderColor: colors.greyLight,
    borderWidth: 1,
    elevation: 0,
    overflow: 'hidden',
    shadowOpacity: 0,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 100,
    marginHorizontal:5,
    marginVertical:8,
    width: 160,
    ...base.shadow,
  },
});
