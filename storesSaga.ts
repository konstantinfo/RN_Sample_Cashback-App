import { all, call, put, select, takeLatest } from 'redux-saga/effects';

import { Linking } from 'react-native';
import * as boostAction from 'src/actions/boostAction';
import * as coreActions from 'src/actions/coreActions';
import * as reviewsActions from 'src/actions/reviewsActions';
import * as storesActions from 'src/actions/storesActions';
import { IFavoriteItem, IStoresItem } from 'src/models/IStoresState';
import { IStore } from 'src/screens/OfflineScreen/components/StoresList/components/Store';
import { getBonusBoost, getFavorites, getUserIdSelector } from 'src/selectors';
import { analytics, api, i18n } from 'src/services';
export function* getStoresSaga (action: storesActions.IStoresActionGetStores) {
  try {
    const {
      limit = 10,
      offset = 0,
      order = 'popularity',
      category = '',
      refreshing = false,
      userId = null,
    } = action.payload;
    const params = { limit, offset, order, category, userId, unit: '' };
    if (order.split('_').length > 1) {
      params.order = order.split('_')[0];
      params.unit = order.split('_')[1];
    }
    params.userId = userId;
    const boost = yield select(getBonusBoost);
    const { items, total } = yield call(api.stores.getStores, params, boost.boost);
    // if (refreshing) {
    //   yield put({ type: boostAction.ActionTypes.SET_BOOST_DATA, payload: boost });
    // }
    yield put(storesActions.getStoresSucceed({
      items,
      refreshing,
      total,
    }));
    // yield put({ type: boostAction.ActionTypes.SET_BOOST_DATA, payload: data });
  } catch (error) {
    analytics.logError(`getStoresSaga: "${error}"`);
  }
}

export function* getStoreSaga (action: storesActions.IStoresActionGetStore) {
  try {
    yield put(storesActions.getStoreLoaded(false));
    const store = yield call(api.stores.getStore, action.payload);
    const similar = yield call(api.stores.getSimilarStores, action.payload, store.categories[0]);
    store.similar = similar;
    store.reviews = [];
    yield put(storesActions.getStoreSucceed(store));
    yield put(reviewsActions.getReviews(store.id, { limit: 10, offset: 0 }, true));
    yield put(storesActions.getStoreLoaded(true));
  } catch (error) {
    analytics.logError(`getStoreSaga: "${error}"`);
  }
}

export function* setFavoriteSaga (action: storesActions.IStoresActionSetFavorite) {
  try {
    const favorites = yield select(getFavorites);
    const favoriteItem = yield call(api.stores.setFavorite, action.userId, action.storeId);
    if (favoriteItem) {
      const inFavorites = favorites.filter((item: IFavoriteItem) => {
        return item.campaign.id === action.storeId;
      }).length;
      if (!inFavorites) yield put(storesActions.setFavoriteSucceed(favoriteItem));
    }
  } catch (error) {
    analytics.logError(`setFavoriteSaga: "${error}"`);
  }
}

export function* removeFavoriteSaga (action: storesActions.IStoresActionRemoveFavorite) {
  try {
    yield call(api.stores.removeFavorite, action.userId, action.favoriteId);
  } catch (error) {
    analytics.logError(`removeFavoriteSaga: "${error}"`);
  }
}

export function* getFavoritesSaga (action: storesActions.IStoresActionGetFavorites) {
  try {
    const favorites = yield call(api.stores.getFavorites, action.payload);
    yield put(storesActions.getFavoritesSucceed(favorites.items));
  } catch (error) {
    analytics.logError(`getFavoritesSaga: "${error}"`);
  }
}

export function* getCategoriesSaga (action: storesActions.IStoresActionGetCategories) {
  try {
    const categories = yield call(api.stores.getCategories, action.payload);
    yield put(storesActions.getCategoriesSucceed(categories));
  } catch (error) {
    analytics.logError(`getCategoriesSaga: "${error}"`);
  }
}

export function* searchStoresSaga (action: storesActions.IStoresActionGetStores) {
  try {
    const userId = yield select(getUserIdSelector);
    const boost = yield select(getBonusBoost);
    // tslint:disable-next-line:max-line-length
    const { items, total } = yield call(api.stores.searchStores, action.payload, userId, boost.boost);
    const nameTermRecords: IStoresItem[] = [];
    const descrTermRecords: IStoresItem[] = [];
    const otherTermRecords: IStoresItem[] = [];

    items.map((item: IStoresItem) => {
      if ((item.title).toLowerCase().includes(action.payload) ||
       action.payload.includes(item.title.toLowerCase())) {
        nameTermRecords.push(item);
      } else if ((item.description).toLowerCase().includes(action.payload) ||
      action.payload.includes(item.description.toLowerCase()))  {
        descrTermRecords.push(item);
      } else {
        otherTermRecords.push(item);
      }
    });
    const resultToShow: IStoresItem[] =
    [...nameTermRecords, ...descrTermRecords, ...otherTermRecords];
    yield put(storesActions.searchStoreSucceed({
      total,
      items: resultToShow,
      refreshing:false,
    }));
  } catch (error) {
    analytics.logError(`getStoresSaga: "${error}"`);
  }
}

export function* getVisitedStores (action: storesActions.IStoresActionGetVisitedStores) {
  try {
    // const { refreshing = false } = action.payload;
    const userId = yield select(getUserIdSelector);
    const { data }  = yield call(api.stores.getVisitedStores, userId);
    yield put(storesActions.setVisitedStores({ ...data, ...action.payload }));
  } catch (error) {
    analytics.logError(`favoritestores: "${error}"`);
  }
}

export function* getSearchSuggetion (action: storesActions.IStoresActionGetSearchSuggestion) {
  try {
    // const { refreshing = false } = action.payload;
    const userId = yield select(getUserIdSelector);
    const  data    = yield call(api.stores.getSearchSuggestions, action.payload);
    yield put(storesActions.setSearchSuggestion(data.data));
  } catch (error) {
    analytics.logError(`searchSuggestion: "${error}"`);
  }
}

export function* getGiftCard (action: storesActions.IStoresActionGetGiftCard) {
  try {
    // const { refreshing = false } = action.payload;
    const userId = yield select(getUserIdSelector);
    const { data }   = yield call(api.stores.getGift, { ...action.payload, userId });
    Linking.openURL(data);
  } catch (error) {
    // analytics.logError(`searchSuggestion: "${error}"`);
  }
}

// tslint:disable-next-line:max-line-length
export function* checkAliexpressProduct (action: storesActions.IStoresActionCheckAliexpressProduct) {
  try {
    const  { data }    = yield call(api.stores.checkAliexpressProduct, action.payload);
    if (data.is_affiliate) {
      yield put(coreActions.addNotification(
        i18n.t('store.aliexpress_product_success'), 'notice'));
    } else {
      yield put(coreActions.addError(
        i18n.t('store.aliexpress_product_error')));
    }
  } catch (error) {
    yield put(coreActions.addError(
      i18n.t('store.aliexpress_product_error')));
  }
}

export default [
  takeLatest(storesActions.ActionTypes.GET_STORES, getStoresSaga),
  takeLatest(storesActions.ActionTypes.GET_STORE, getStoreSaga),
  takeLatest(storesActions.ActionTypes.SET_FAVORITE, setFavoriteSaga),
  takeLatest(storesActions.ActionTypes.REMOVE_FAVORITE, removeFavoriteSaga),
  takeLatest(storesActions.ActionTypes.GET_FAVORITES, getFavoritesSaga),
  takeLatest(storesActions.ActionTypes.GET_CATEGORIES, getCategoriesSaga),
  takeLatest(storesActions.ActionTypes.SEARCH_STORE, searchStoresSaga),
  takeLatest(storesActions.ActionTypes.GET_VISITED_STORES, getVisitedStores),
  takeLatest(storesActions.ActionTypes.GET_SEARCH_SUGGESTION, getSearchSuggetion),
  takeLatest(storesActions.ActionTypes.GET_GIFT_CARD, getGiftCard),
  takeLatest(storesActions.ActionTypes.CHECK_ALIEXPRESS_PRODUCT, checkAliexpressProduct),
];
