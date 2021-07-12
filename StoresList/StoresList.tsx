import React from 'react';
import {
  Animated,
  BackHandler,
  FlatList,
  Image,
  ListRenderItemInfo,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { connect } from 'react-redux';
import {
  core as coreActions,
  stores as storesActions,
} from 'src/actions';
import { IThemeMode } from 'src/actions/coreActions';
import {
  Filter,
  Icon,
  Loading,
  // StoreDetail,
} from 'src/components';
import { Card, Container, Empty, Header, ImageContainer, Spacer, Title } from 'src/components/Base';
import CarouselItem from 'src/components/StoresList/components/CarouselItem';
import config from 'src/constants/config';
import IRootState, { IBoostState, IUserState } from 'src/models';
import { IBonusBoostInfo } from 'src/models/IBonusState';
import IStoresState, {
  IBoostItem,
  IStoresFilter,
  IStoresGet,
  IStoresItem,
  IVisitedStoreItem,
} from 'src/models/IStoresState';
import { notificationsActions } from 'src/screens/Profile/actions';
import { i18n } from 'src/services';
import api from 'src/services/api';
import { base, colors } from 'src/styles';
import { handleAndroidBackPress, toast } from 'src/utils';
import Theme, { ThemeContext } from '../Theme';
import StoreItem from './components/StoreItem';
import styles from './StoresList.styles';
// import { IThemeMode } from 'src/actions/coreActions';
// const Theme = ThemeHOC(View);
const SCREEN_TRANSLATE_KEY = 'store';
interface IProps {
  getStores: (payload: IStoresGet) => void;
  stores: IStoresState;
  userId: string;
  getStore: (id: string) => void;
  getFavorites: (userId: string) => void;
  toogleDisplayMenu: (hidden: boolean) => void;
  setFavorite: (userId: string, storeId: string) => void;
  removeFavorite: (userId: string, storeId: string) => void;
  getUnreadCount: (userId: string) => void;
  goToStoreSearch: () => void;
  filterSearchData: (data: IStoresFilter) => void;
  updatePushParam: (params: string) => void;
  goToDetail: (storeId: string) => void;
  getVisitedStores: (param?: { refreshing: boolean }) => void;
  boost: IBoostState;
  navigation: NavigationStackProp;
  themeMode: IThemeMode;
}

interface IState {
  store: IStoresItem | undefined;
  openProgress: Animated.AnimatedValue;
  isAnimating: boolean;
  showFilter: boolean;
  order: string;
  category: string;
  user: IUserState;
  followed: boolean;
  boost?: IBonusBoostInfo;
}
// let backHandlerClickCount = 0;
const ITEM_HEIGHT = 100;
class StoresList extends React.PureComponent<IProps, IState> {
  static contextType =  ThemeContext;
  interval: any;
  animatedFavorite = new Animated.Value(0);
  backHandlerClickCount: number = 1;
  state = {
    category: '',
    followed: false,
    isAnimating: false,
    openProgress: new Animated.Value(0),
    order: 'popularity',
    showFilter: false,
    store: undefined,
    user: undefined,
  };
  storeDialog: StoreDetail | null = null;
  similarStoreDialog: any[] = [];
  onFocusListener: any;
  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.onFocusListener = this.props.navigation.addListener('didFocus', this.onFocus);
    const { getStores, getFavorites, stores, userId, getVisitedStores } = this.props;
    const { order, category } = this.state;
    if (userId === '' || typeof userId === 'undefined') {
      setTimeout(() => {
        // tslint:disable-next-line:max-line-length
        if (!stores.ids.length) getStores({ order, category, userId: this.props.userId , refreshing: true });
        this.props.getUnreadCount(this.props.userId);
        if (!stores.visitedStore.ids.length) getVisitedStores();
      },         500);
    } else {
      if (!stores.ids.length) getStores({ order, category, userId, refreshing: true });
      this.props.getUnreadCount(userId);
      if (!stores.visitedStore.ids.length) getVisitedStores();
    }
  }

  componentWillReceiveProps (props: any) {
    if (props.stores.pushStoreId !== '' &&
      props.stores.cache && props.stores.cache[props.stores.pushStoreId]) {
      if (this.storeDialog.isOpen()) {
        this.storeDialog.openSimilarStore(props.stores.pushStoreId);
      } else {
        // tslint:disable-next-line:max-line-length
        this.storeDialog.open(props.stores.pushStoreId, props.stores.cache[props.stores.pushStoreId].boost);
      }
      this.props.updatePushParam('');
    }
  }

  onFocus = () => {
    const { stores } = this.props;
    if (!stores.ids.length && !stores.refreshing) {
      this.handleRefresh();
    }
  }
  handleBackPress = () => {
    if (this.state.showFilter) {
      this.toggleFilter();
      return true;
    }
    handleAndroidBackPress();
    return true;
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    this.onFocusListener.remove();
  }

  getFavoritedId = (storeId: string) => {
    const { stores } = this.props;
    const inFavorites = stores.favorites.filter(item => item.campaign.id === storeId);
    return inFavorites.length ? inFavorites[0].id : '';
  }

  // componentWillReceiveProps = (propes: any) => {
  //   this.setState({ boost: this.props.boost });
  // };

  renderItem = (rowData: ListRenderItemInfo<string | undefined>) => {
    const { stores } = this.props;
    if (!(stores.cache && rowData.item)) return null;
    const item: IStoresItem = stores.cache[rowData.item];
    const store: IStoresItem = stores.cache[rowData.item];
    const onPress = () =>  this.onPressStore(store.id, store.boost);
    const onOfferPress = () =>  this.onPressStoreOffer(store.id, store.boost);
    const favoriteId = this.getFavoritedId(store.id);
    return (
      <StoreItem
        key={store.id}
        {...store}
        favoriteId={favoriteId}
        onPress={onPress}
        onOfferPress={onOfferPress}
        boost={store.boost}
      />
    );
  };

  onPressStore = (storeId: string, boost: IBoostItem) => {
    this.props.navigation.navigate('StoreDetail', { storeId, boost, defaultIndex:0 });
  }

  onPressStoreOffer = (storeId: string, boost: IBoostItem) => {
    this.props.navigation.navigate('StoreDetail', { storeId, boost, defaultIndex:1 });
  }

  keyExtractor = (item: string | undefined, index: number) => item || `${index}`;

  renderSeparator = () => <Spacer height={15} />;

  renderFollowedSeparator = () => <View style={{ marginHorizontal: 8 }} />;

  renderEmpty = () => {
    const { stores } = this.props;
    if (stores.loading) return <Spacer />;
    return (
      <Empty
        title={i18n.t(`${SCREEN_TRANSLATE_KEY}.empty`, { defaultValue: 'Stores list is empty' })}
      />
    );
  }

  renderFooter = () => {
    const { stores } = this.props;
    return stores.loading
      ? <Loading size={25} fill="grey" />
      : <Spacer height={45} />;
  };

  renderHeader = () => {
    const { stores } = this.props;
    return (stores.favorites.length === 0 && !stores.loading ?
      (
        <>
        <View>
          <Spacer height={24} />
          <Empty
            title={i18n.t(`${SCREEN_TRANSLATE_KEY}.favorites_empty`,
              // tslint:disable-next-line:max-line-length
                          { defaultValue: 'Here your favourite stores could be, just mark them with Star.' })}
          />
          <Spacer height={24} />
        </View>
        <View style={{ paddingLeft: 10 }}>
          {this.renderVisitedStores()}
        </View>
        </>
      )
      : (
        <View style={{ paddingLeft: 10 }}>
          {this.renderFavorites()}
          {this.renderVisitedStores()}
        </View>
      )
    );
  }

  handleLoadMore = () => {
    const { getStores, stores, userId } = this.props;
    const { order, category } = this.props.stores.filter;
    if (!stores.loading && stores.total !== stores.ids.length) {
      getStores({ order, category, userId, offset: stores.ids.length });
    }
  };

  handleRefresh = () => {
    const { getStores, stores, userId, getVisitedStores } = this.props;
    const { order, category } = this.props.stores.filter;
    if (!stores.refreshing) getStores({ category, order, userId, refreshing: true });
    if (!stores.refreshing) getVisitedStores({ refreshing: true });
  };

  toggleFilter = () => {
    const { toogleDisplayMenu } = this.props;
    const { showFilter } = this.state;
    if (!showFilter) {
      // toogleDisplayMenu(true);
      this.setState({ showFilter: !showFilter });
      Animated.timing(this.state.openProgress, {
        duration: 300,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      this.setState({ isAnimating: true });
      Animated.timing(this.state.openProgress, {
        duration: 300,
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        // toogleDisplayMenu(false);
        this.setState({ showFilter: !showFilter });
      });
    }
  }

  applyFilter = (payload: { order: string, followed?: boolean, category: string }) => {
    const {
      toogleDisplayMenu,
      // getFavorites,
      // userId,
      filterSearchData,
    } = this.props;
    const { showFilter } = this.state;
    const { order, category } = this.props.stores.filter;
    this.setState({ isAnimating: true });
    // if (payload.followed) {
    //   getFavorites(userId);
    // }
    // tslint:disable-next-line:max-line-length
    filterSearchData({ category: payload.category, order: payload.order, followed: !!payload.followed });
    Animated.timing(this.state.openProgress, {
      duration: 300,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      toogleDisplayMenu(false);
      this.setState(
        {
          category: payload.category,
          followed: !!payload.followed,
          order: payload.order,
          showFilter: !showFilter,
        },
        () => {
          if (order !== payload.order || category !== payload.category) {
            this.handleRefresh();
          }
        },
      );
    });
  }

  renderFavorites () {
    const { stores } = this.props;
    if (stores.favorites.length) {
      return (
      <View>
        <Spacer height={24} />

        <Title style={styles.carouselTitle}>
          {
            i18n.t(
              `${SCREEN_TRANSLATE_KEY}.widget_followed_stores_title`,
              { defaultValue: 'Followed stores' },
            )
          }
        </Title>
        <View style={styles.carouselContainer}>
            <FlatList
              data={stores.favorites}
              renderItem={this.renderFollowedStoreCarouselItem}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.renderFollowedSeparator}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            />
        </View>
      </View>
      );
    }
    return (
      null
    );
  }

  renderVisitedStores () {
    const { stores } = this.props;
    if (stores.visitedStore.ids.length) {
      return (
      <View>
        <Title style={styles.carouselTitle}>
          {
            i18n.t(
              `${SCREEN_TRANSLATE_KEY}.widget_quick_links_title`,
              { defaultValue: 'Quick Links' },
            )
          }
        </Title>
        <View style={styles.carouselContainer}>
            <FlatList
              data={stores.visitedStore.ids}
              renderItem={this.renderQuickLinks}
              keyExtractor={this.keyExtractor}
              ItemSeparatorComponent={this.renderFollowedSeparator}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            />
        </View>
      </View>
      );
    }
    return (
      null
    );
  }

  renderFollowedStoreCarouselItem = ({ item }) => {
    const { navigation } = this.props;
    const { mode } = this.context;
    const onPress = () =>
    navigation.navigate('StoreDetail', { storeId: item.campaign.id, boost: item.campaign.boost });
    // this.storeDialog.open(item.campaign.id, item.campaign.boost);
    return (
      <CarouselItem round={true}>
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.favoriteContainer}>
             {/* tslint:disable-next-line:max-line-length */}

             {/* <View style={[base.storeIconContainer]}> */}
             <ImageContainer>
                <Image
                  source={{ ...item.campaign.image  }}
                  resizeMode={'contain'}
                  style={styles.favoriteStoreImage}
                />
             </ImageContainer>

             {/* </View> */}
          </View>
        </TouchableWithoutFeedback>
        <View style={[styles.favoriteIcon]}>{this.renderHeart(item.id)}</View>
      </CarouselItem>
    );
  }

  renderQuickLinks = (rowData: ListRenderItemInfo<string | undefined>) => {
    const { visitedStore } = this.props.stores;
    const { navigation } = this.props;
    const items: IVisitedStoreItem = visitedStore.cache[rowData.item];
    const onPress = () =>  config.giftCardStoreIds.indexOf(items.id) >= 0 ?
    navigation.navigate('StoreDetail', { storeId: items.id }) : this.goToStore(items.id);
    return (
      <CarouselItem round={true}>
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={styles.favoriteContainer}>
             {/* <View style={[base.storeIconContainer]}> */}
             <ImageContainer>
              <Image
                source={{ uri: items.full_image.url }}
                resizeMode={'contain'}
                style={styles.favoriteStoreImage}
              />
             </ImageContainer>

             {/* </View> */}
          </View>
        </TouchableWithoutFeedback>
      </CarouselItem>
    );
  }
  goToStore = (id: string) => {
    const { userId } = this.props;
    api.stores.getStoreLink(userId, id);
  }
  renderHeart = (storeId: string) => {
    const name = 'StarFill';
    const fill = colors.blue;
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
        {/*tslint:disable-next-line:jsx-no-lambda*/}
        <TouchableOpacity onPress={() => this.toggleFavorite(storeId)}>
          <Icon name={name} fill={fill} />
        </TouchableOpacity>
      </Animated.View>
    );
  };
  toggleFavorite = (storeId: string) =>  {
    const { removeFavorite, userId } = this.props;
    removeFavorite(userId, storeId);
  }
  showStoreSearch = () => {
    this.props.navigation.navigate('StoreSearch');
  }

  getItemLayout = (data: any, index: any) => (
    { index, length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index }
  );

  render () {
    const {
      openProgress,
    } = this.state;
    const { stores, boost, navigation, themeMode } = this.props;
    const { favorites } = stores;
    return (
      <>
        <Container style={styles.container}>
          <Header
            title={i18n.t(`${SCREEN_TRANSLATE_KEY}.title`, { defaultValue: 'Store list' })}
            leftItems={[
              {
                action: () => navigation.navigate('StoreSearch'),
                icon: 'Search',
              },
            ]}
            rightItems={[
              {
                action: this.toggleFilter,
                icon: 'Filter',
              },
            ]}
            searchText={i18n.t(`${SCREEN_TRANSLATE_KEY}.searchStoreText`,
                               { defaultValue: 'Search everything' })}
            onSearchTextPress={this.showStoreSearch}
          />
          <FlatList
            data={stores.ids}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            ItemSeparatorComponent={this.renderSeparator}
            ListEmptyComponent={this.renderEmpty}
            ListFooterComponent={this.renderFooter}
            ListHeaderComponent={this.renderHeader}
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0.01}
            onRefresh={this.handleRefresh}
            refreshing={stores.refreshing || !boost.isBoostSet}
            extraData={stores.loading || stores.favorites.length || boost.isBoostSet}
          />
        </Container>
        <Filter
          show={this.state.showFilter}
          onClose={this.toggleFilter}
          onApply={this.applyFilter}
          openProgress={openProgress}
          order={stores.filter.order}
          category={stores.filter.category}
          type="store"
          // followed={stores.filter.followed}
        />
        {/* <StoreDetail
          ref={(ref: any) => this.storeDialog = ref}
        /> */}
      </>
    );
  }
}
// const switchTheme = (mode: IThemeMode) => {
//   styles = themeStyles(mode);
//   return mode;
// };
const mapStateToProps = (state: Partial<IRootState>) => ({
  boost: state.boost,
  stores: state.stores,
  // themeMode: switchTheme(state.core.themeMode),
  userId: state.user ? state.user.profile.id : null,
});

const mapDispatchToProps = {
  ...storesActions,
  ...coreActions,
  getUnreadCount: notificationsActions.getUnreadNotificationsCount,
  updatePushParam: storesActions.updatePushParam,
};

export default connect<any, any, any>(
  mapStateToProps,
  mapDispatchToProps,
)(StoresList);
