import React from 'react';
import {
  Animated,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import {
  stores as storesActions,
} from 'src/actions';
import Icon from 'src/components/Icon';
import IRootState, { IUserState } from 'src/models';
import { IBoostItem, IStoresItem } from 'src/models/IStoresState';
import { i18n } from 'src/services';
import { base, colors } from 'src/styles';

import { IThemeMode } from 'src/actions/coreActions';
import { Card, ImageContainer, Label, Title } from 'src/components/Base';
import { ThemeContext } from 'src/components/Theme';
import config from 'src/constants/config';
import styles from './StoreItem.styles';

export interface IState {
  isFavorite: boolean;
}

interface IProps extends IStoresItem {
  boost: IBoostItem;
  setFavorite: (userId: string, storeId: string) => void;
  removeFavorite: (userId: string, storeId: string) => void;
  favoriteId?: string;
  user: IUserState;
  themeMode: IThemeMode;
  showInactive?: boolean;
}
const SCREEN_TRANSLATE_KEY = 'store';
class StoreItem extends React.PureComponent<IProps, IState> {
  static contextType =  ThemeContext;
  animatedFavorite = new Animated.Value(0);
  animatedStore = new Animated.Value(1);
  state = {
    isFavorite: !!this.props.favoriteId,
  };

  componentWillReceiveProps (nextProps: IProps) {
    if (this.state.isFavorite !== !!nextProps.favoriteId) {
      this.setState({ isFavorite: !!nextProps.favoriteId });
    }
  }

  renderHeart = () => {
    const { isFavorite } = this.state;
    const name = isFavorite ? 'StarFill' : 'Star';
    const fill = isFavorite ? colors.blue : colors.grey;
    const animatedStyle = {
      transform: [
        {
          scale: this.animatedFavorite.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.3],
          }),
        },
      ],
    };
    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity onPress={this.toggleFavorite}>
          <Icon name={name} fill={fill} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  renderBoost = () => {
    const {
  boostIcon,
  isBoosted,
} = this.props.boost;
    return (
      isBoosted && (
        <View style={styles.boost}>
          {boostIcon === 'max' ? (
            <Text style={styles.maxBoost}>MAX</Text>
          ) : (
            <Icon
              name="Boost"
              fill={colors.white}
              viewBox="0 0 26 26"
              height={10}
              width={10}
            />
          )}
        </View>
      )
    );
  };

  toggleFavorite = () => {
    const {
      setFavorite,
      removeFavorite,
      id,
      user,
      favoriteId,
    } = this.props;
    this.setState((state) => {
      const isFavorite = !state.isFavorite;
      if (isFavorite) {
        setFavorite(user.profile.id, id);
        Animated.sequence([
          Animated.spring(this.animatedFavorite, {
            speed: 50,
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.spring(this.animatedFavorite, {
            speed: 100,
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        removeFavorite(user.profile.id, favoriteId!);
      }
      return { isFavorite };
    });
  };

  onPressIn = () => {
    this.animatedStore.setValue(1);
    Animated.sequence([
      Animated.spring(this.animatedStore, {
        speed: 200,
        toValue: 1.05,
        useNativeDriver: true,
      }),
      Animated.spring(this.animatedStore, {
        speed: 200,
        toValue: 1.04,
        useNativeDriver: true,
      }),
      Animated.spring(this.animatedStore, {
        speed: 50,
        toValue: 1.044,
        useNativeDriver: true,
      }),
    ]).start();
  };

  onPressOut = () => {
    this.animatedStore.setValue(1.04);
    Animated.spring(this.animatedStore, {
      speed: 200,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  render () {
    const {
      amount,
      commissions,
      id,
      isBoosted,
      originalAmount,
      unit,
      title,
      image,
      offers,
      onPress,
      onOfferPress,
      promocodes,
      boost,
      isOffer,
      showInactive,
      active,
    } = this.props;
    const animatedStyle = {
      transform: [
        {
          scale: this.animatedStore,
        },
      ],
    };
    const { theme, mode } = this.context;
    return (
      <View style={styles.topContainer}>
      {/* {Platform.OS === 'android' && (<View style={styles.shadowBox} />)} */}
      <Animated.View style={animatedStyle}>
        {/* <TouchableWithoutFeedback
          onPress={onPress}
          onPressIn={this.onPressIn}
          onPressOut={this.onPressOut}
        > */}
          <Card
            style={[styles.container, mode === config.themeModeType.DARK && { paddingLeft: 15 }]}
            onPress={onPress}
            onPressIn={this.onPressIn}
            onPressOut={this.onPressOut}
          >
            {
              ((showInactive && active) || !showInactive) &&
              this.renderBoost()
            }
            {/* <View style={styles.iconContainer}> */}
            <ImageContainer style={styles.logoContainer}>
              <Image
                source={image}
                style={mode === config.themeModeType.DARK ? styles.logoDark : styles.logo}
              />
            </ImageContainer>

            {/* </View> */}
            <View style={styles.body}>
              <View style={styles.bodyLeft}>
              { ((showInactive && active) || !showInactive) ? (
              <>
              <Title style={styles.textTitle} numberOfLines={2}>{title}</Title>
                <Label style={styles.textUpto}>
                  {commissions.length > 0 ?
                   i18n.t(`${SCREEN_TRANSLATE_KEY}.bonus_up_to`, { defaultValue: 'Bonus up to:' }) :
                  i18n.t(`${SCREEN_TRANSLATE_KEY}.bonus`, { defaultValue: 'Bonus' })
                }
                </Label>
                <View style={styles.bonus}>
                  {boost.isBoosted && (
                      <Label style={styles.textOriginal}>
                        {amount}{` `}
                        {unit}
                      </Label>
                    )}
                  <Text
                    style={[
                      styles.textBonus, theme.textStyle,
                      boost.isBoosted &&
                        styles.textBonusBoosted,
                    ]}
                  >
                    {boost.isBoosted
                      ? parseFloat(boost.boostedAmount)
                      : amount}{` `}
                    {unit}
                  </Text>
                </View>
                </>
              ) : (
                <>
                <Title
                  style={styles.textTitleInactive}
                  numberOfLines={2}
                >
                    {title}
                </Title>
              <Title style={base.lightText} numberOfLines={2}>
                {i18n.t(`${SCREEN_TRANSLATE_KEY}.no_bonus`)}
              </Title>
                </>
              )}
              </View>
              { ((showInactive && active) || !showInactive) && (
                <View style={styles.bodyRight}>
                  <View style={styles.iconHeart}>{this.renderHeart()}</View>
                  {(isOffer) && (
                    <TouchableOpacity onPress={onOfferPress}>
                    <View style={[styles.iconOffers]}>
                      <Icon name="MenuLabel" fill={colors.grey} />
                    </View>
                      </TouchableOpacity>
                  )}
              </View>
              )}

            </View>
          </Card>
        {/* </TouchableWithoutFeedback> */}
      </Animated.View>
      </View>
    );
  }
}
// const switchTheme = (mode: IThemeMode) => {
//   styles = themeStyles(mode);
//   return mode;
// };
const mapStateToProps = (state: IRootState) => ({
  // themeMode: switchTheme(state.core.themeMode),
  user: state.user,
});

const mapDispatchToProps = {
  ...storesActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreItem);
