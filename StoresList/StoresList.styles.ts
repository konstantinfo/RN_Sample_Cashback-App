import { StyleSheet } from 'react-native';

import { IThemeMode } from 'src/actions/coreActions';
import { colors, fonts } from 'src/styles';
import { switchTheme } from 'src/styles/_themes';
export default StyleSheet.create({
  carouselContainer: {
    height: 120,
    // marginBottom: 5,
    // marginLeft: 8,
    // marginRight: 8,
    // marginTop: 8,
  },
  carouselTitle: {
    color: colors.white,
    fontFamily: fonts.fontBold,
    fontSize: 14,
    marginLeft: 16,
    paddingBottom: 5,
    paddingTop: 5,
  },
  container: {
    backgroundColor: colors.greyLighter,
    flex: 1,
    flexDirection: 'column',
  },
  favoriteContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    // width:130,
    // paddingHorizontal: 16,
  },
  favoriteIcon: {
    position: 'absolute',
    right: 7,
    top: 7,
    zIndex: 99,
  },
  favoriteStoreImage: {
    height: 100,
    width: 100,
  },
});
