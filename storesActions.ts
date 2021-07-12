import { AnyAction } from 'redux';

import IStoresState, {
  ICategoryItem,
  ICheckALiexpressParam,
  IFavoriteItem,
  IGiftParam,
  IStoresFilter,
  IStoresGet,
  IStoresGetSucceed,
  IStoresItem,
  IStoresVisitedGetSucceed,
  IVisitedStoreItem,
} from 'src/models/IStoresState';

/*
 * Define action name constants here
 */
export enum ActionTypes {
  GET_STORES = 'stores/GET_STORES',
  GET_STORES_SUCCEED = 'stores/GET_STORES_SUCCEED',
  GET_STORE = 'stores/GET_STORE',
  GET_STORE_SUCCEED = 'stores/GET_STORE_SUCCEED',
  GET_STORE_REVIEWS = 'stores/GET_STORE_REVIEWS',
  GET_STORE_REVIEWS_SUCCEED = 'stores/GET_STORE_REVIEWS_SUCCEED',
  SET_FAVORITE = 'stores/SET_FAVORITE',
  SET_FAVORITE_SUCCEED = 'stores/SET_FAVORITE_SUCCEED',
  REMOVE_FAVORITE = 'stores/REMOVE_FAVORITE',
  GET_FAVORITES = 'stores/GET_FAVORITES',
  GET_FAVORITES_SUCCEED = 'stores/GET_FAVORITES_SUCCEED',
  GET_CATEGORIES = 'stores/GET_CATEGORIES',
  GET_CATEGORIES_SUCCEED = 'stores/GET_CATEGORIES_SUCCEED',
  SEARCH_STORE = 'stores/SEARCH_STORE',
  SEARCH_STORE_SUCCEED = 'stores/SEARCH_STORE_SUCCEED',
  CLEAR_SEARCH_DATA = 'stores/CLEAR_SEARCH_DATA',
  FILTER_SEARCH_DATA = 'stores/FILTER_SEARCH_DATA',
  PUSH_PARAM = 'stores/PUSH_PARAM',
  RESET_STORES = 'stores/RESET_STORES',
  IS_STORE_LOADED = 'stores/IS_STORE_LOADED',
  GET_VISITED_STORES = 'stores/GET_VISITED_STORES',
  SET_VISITED_STORES = 'stores/SET_VISITED_STORES',
  GET_SEARCH_SUGGESTION = 'stores/GET_SEARCH_SUGGESTION',
  SET_SEARCH_SUGGESTION = 'stores/SET_SEARCH_SUGGESTION',
  GET_GIFT_CARD = 'stores/GET_GIFT_CARD',
  SET_GIFT_CARD = 'stores/SET_GIFT_CARD',
  CHECK_ALIEXPRESS_PRODUCT = 'stores/CHECK_ALIEXPRESS_PRODUCT',
}

/*
 * Define return type of actions
 */

export interface IStoresActionSetGiftCard extends AnyAction {
  payload: any;
  type: ActionTypes.SET_GIFT_CARD;
}

export interface IStoresActionGetGiftCard extends AnyAction {
  payload: IGiftParam;
  type: ActionTypes.GET_GIFT_CARD;
}

export interface IStoresActionSetSearchSuggestion extends AnyAction {
  payload: string[];
  type: ActionTypes.SET_SEARCH_SUGGESTION;
}

export interface IStoresActionGetSearchSuggestion extends AnyAction {
  payload: string;
  type: ActionTypes.GET_SEARCH_SUGGESTION;
}

export interface IStoresActionSetVisitedStores extends AnyAction {
  payload: IStoresVisitedGetSucceed;
  type: ActionTypes.SET_VISITED_STORES;
}

export interface IStoresActionGetVisitedStores extends AnyAction {
  payload?: { refreshing: boolean };
  type: ActionTypes.GET_VISITED_STORES;
}
export interface IStoresActionGetStores extends AnyAction {
  payload: IStoresGet;
  type: ActionTypes.GET_STORES;
}

export interface IStoresActionGetStoresSucceed extends AnyAction {
  payload: IStoresGetSucceed;
  type: ActionTypes.GET_STORES_SUCCEED;
}

export interface IStoresActionGetStore extends AnyAction {
  payload: string;
  type: ActionTypes.GET_STORE;
}

export interface IStoresActionGetStoreSucceed extends AnyAction {
  payload: IStoresItem;
  type: ActionTypes.GET_STORE_SUCCEED;
}

export interface IStoresActionSetFavorite extends AnyAction {
  userId: string;
  storeId: string;
  type: ActionTypes.SET_FAVORITE;
}

export interface IStoresActionSetFavoriteSucceed extends AnyAction {
  payload: IFavoriteItem;
  type: ActionTypes.SET_FAVORITE_SUCCEED;
}

export interface IStoresActionRemoveFavorite extends AnyAction {
  userId: string;
  favoriteId: string;
  type: ActionTypes.REMOVE_FAVORITE;
}

export interface IStoresActionGetFavorites extends AnyAction {
  payload: string;
  type: ActionTypes.GET_FAVORITES;
}

export interface IStoresActionGetFavoritesSucceed extends AnyAction {
  payload: IFavoriteItem[];
  type: ActionTypes.GET_FAVORITES_SUCCEED;
}

export interface IStoresActionGetCategories extends AnyAction {
  payload: string;
  type: ActionTypes.GET_CATEGORIES;
}

export interface IStoresActionGetCategoriesSucceed extends AnyAction {
  payload: ICategoryItem[];
  type: ActionTypes.GET_CATEGORIES_SUCCEED;
}

export interface IStoreActionSetNotificationBadge extends AnyAction {
  payload: boolean;
  type: ActionTypes.SET_NOTIFICATION_BADGE;
}

export interface IStoresActionSearchStoresSucceed extends AnyAction {
  payload: IStoresGetSucceed;
  type: ActionTypes.SEARCH_STORE_SUCCEED;
}

export interface IStoresActionSearchStore extends AnyAction {
  payload: string;
  type: ActionTypes.SEARCH_STORE;
}

export interface IStoresActionClearSearchData extends AnyAction {
  payload: null;
  type: ActionTypes.CLEAR_SEARCH_DATA;
}

export interface IStoresActionFilterSearchData extends AnyAction {
  payload: IStoresFilter;
  type: ActionTypes.FILTER_SEARCH_DATA;
}

export interface IStoresPushData extends AnyAction {
  payload: string;
  type: ActionTypes.PUSH_PARAM;
}

export interface IResetStores extends AnyAction {
  payload: any;
  type: ActionTypes.RESET_STORES;
}

export interface IGetStoreLoaded extends AnyAction {
  payload: boolean;
  type: ActionTypes.IS_STORE_LOADED;
}

export interface IStoresActionCheckAliexpressProduct extends AnyAction {
  payload: ICheckALiexpressParam;
  type: ActionTypes.CHECK_ALIEXPRESS_PRODUCT;
}
/*
 * Define actions creators
 */

/**
 * Get stores action
 *
 * @export
 * @param {IStoresGet} params
 * @returns {IStoresActionGetStores}
 */
export function getStores (params: IStoresGet): IStoresActionGetStores {
  return {
    payload: params,
    type: ActionTypes.GET_STORES,
  };
}

export function getVisitedStores (params?: { refreshing: boolean }): IStoresActionGetVisitedStores {
  return {
    payload: params,
    type: ActionTypes.GET_VISITED_STORES,
  };
}

/**
 * Get similar store action
 *
 * @export
 * @param {string} storeId
 * @returns {IGetStoreLoaded}
 */
export function getStoreLoaded (value: boolean): IGetStoreLoaded {
  return {
    payload: value,
    type: ActionTypes.IS_STORE_LOADED,
  };
}

/**
 * Get stores succeed action
 *
 * @export
 * @param {IStoresGetSucceed} stores
 * @returns {IStoresActionGetStoresSucceed}
 */
export function getStoresSucceed (stores: IStoresGetSucceed): IStoresActionGetStoresSucceed {
  return {
    payload: stores,
    type: ActionTypes.GET_STORES_SUCCEED,
  };
}

/**
 * Get store action
 *
 * @export
 * @param {string} storeId
 * @returns {IStoresActionGetStore}
 */
export function getStore (storeId: string): IStoresActionGetStore {
  return {
    payload: storeId,
    type: ActionTypes.GET_STORE,
  };
}

/**
 * Get store succeed action
 *
 * @export
 * @param {IStoresItem} store
 * @returns {IStoresActionGetStoreSucceed}
 */
export function getStoreSucceed (store: IStoresItem): IStoresActionGetStoreSucceed {
  return {
    payload: store,
    type: ActionTypes.GET_STORE_SUCCEED,
  };
}

/**
 * Set favorite
 *
 * @export
 * @param {string} userId
 * @param {string} storeId
 * @returns {IStoresActionSetFavorite}
 */
export function setFavorite (userId: string, storeId: string): IStoresActionSetFavorite {
  return {
    storeId,
    userId,
    type: ActionTypes.SET_FAVORITE,
  };
}

export function setFavoriteSucceed (payload: IFavoriteItem): IStoresActionSetFavoriteSucceed {
  return {
    payload,
    type: ActionTypes.SET_FAVORITE_SUCCEED,
  };
}

/**
 * Remove favorite
 *
 * @export
 * @param {string} userId
 * @param {string} favoriteId
 * @returns {IStoresActionRemoveFavorite}
 */
export function removeFavorite (userId: string, favoriteId: string): IStoresActionRemoveFavorite {
  return {
    favoriteId,
    userId,
    type: ActionTypes.REMOVE_FAVORITE,
  };
}

export function getFavorites (payload: string): IStoresActionGetFavorites {
  return {
    payload,
    type: ActionTypes.GET_FAVORITES,
  };
}

export function getFavoritesSucceed (payload: IFavoriteItem[]): IStoresActionGetFavoritesSucceed {
  return {
    payload,
    type: ActionTypes.GET_FAVORITES_SUCCEED,
  };
}

export function getCategories (payload: string): IStoresActionGetCategories {
  return {
    payload,
    type: ActionTypes.GET_CATEGORIES,
  };
}

export function getCategoriesSucceed (payload: ICategoryItem[]): IStoresActionGetCategoriesSucceed {
  return {
    payload,
    type: ActionTypes.GET_CATEGORIES_SUCCEED,
  };
}

/**
 * Get store action
 *
 * @export
 * @param {string} searchText
 * @returns {IStoresActionSearchStore}
 */
export function searchStore (searchText: string): IStoresActionSearchStore {
  return {
    payload: searchText,
    type: ActionTypes.SEARCH_STORE,
  };
}

/**
 * Get store succeed action
 *
 * @export
 * @param {IStoresGetSucceed} store
 * @returns {IStoresActionSearchStoresSucceed}
 */
export function searchStoreSucceed (store: IStoresGetSucceed): IStoresActionSearchStoresSucceed {
  return {
    payload: store,
    type: ActionTypes.SEARCH_STORE_SUCCEED,
  };
}

/**
 * Clear search data
 *
 * @export
 * @param
 * @returns {IStoresActionSearchStoresSucceed}
 */
export function clearSearchData (): IStoresActionClearSearchData {
  return {
    payload: null,
    type: ActionTypes.CLEAR_SEARCH_DATA,
  };
}

/**
 * Filter search data
 *
 * @export
 * @param
 * @returns {IStoresActionFilterSearchData}
 */
export function filterSearchData (filter: IStoresFilter): IStoresActionFilterSearchData {
  return {
    payload: filter,
    type: ActionTypes.FILTER_SEARCH_DATA,
  };
}

/**
 * push data
 *
 * @export
 * @param
 * @returns {IStoresPushData}
 */
export function updatePushParam (data: string): IStoresPushData {
  return {
    payload: data,
    type: ActionTypes.PUSH_PARAM,
  };
}

/**
 * reset store
 *
 * @export
 * @param
 * @returns {IResetStores}
 */
export function resetStores (): IResetStores {
  return {
    payload: null,
    type: ActionTypes.RESET_STORES,
  };
}

export function setVisitedStores (param: IStoresVisitedGetSucceed): IStoresActionSetVisitedStores {
  return {
    payload: param,
    type: ActionTypes.SET_VISITED_STORES,
  };
}

export function getSearchSuggestion (param: string): IStoresActionGetSearchSuggestion {
  return {
    payload: param,
    type: ActionTypes.GET_SEARCH_SUGGESTION,
  };
}

export function setSearchSuggestion (param: string[]): IStoresActionSetSearchSuggestion {
  return {
    payload: param,
    type: ActionTypes.SET_SEARCH_SUGGESTION,
  };
}

export function getGiftCard (param: IGiftParam): IStoresActionGetGiftCard {
  return {
    payload: param,
    type: ActionTypes.GET_GIFT_CARD,
  };
}

export function setGiftCard (param: any): IStoresActionSetGiftCard {
  return {
    payload: param,
    type: ActionTypes.SET_GIFT_CARD,
  };
}

// tslint:disable-next-line:max-line-length
export function checkAliexpressProduct (param: ICheckALiexpressParam): IStoresActionCheckAliexpressProduct {
  return {
    payload: param,
    type: ActionTypes.CHECK_ALIEXPRESS_PRODUCT,
  };
}
/*
 * Define the Action type
 * It will be useful to tell typescript about our types in our reducer
 */
export type Action =
  IStoresActionGetStores
  | IStoresActionGetStoresSucceed
  | IStoresActionGetStore
  | IStoresActionGetStoreSucceed
  | IStoresActionSetFavorite
  | IStoresActionSetFavoriteSucceed
  | IStoresActionRemoveFavorite
  | IStoresActionGetFavorites
  | IStoresActionGetFavoritesSucceed
  | IStoresActionGetCategories
  | IStoresActionGetCategoriesSucceed
  | IStoresActionSearchStore
  | IStoresActionSearchStoresSucceed
  | IStoresActionClearSearchData
  | IStoresActionFilterSearchData
  | IStoresPushData
  | IResetStores
  // | IGetSimilartStores
  | IStoresActionGetVisitedStores
  | IStoresActionSetVisitedStores
  | IStoresActionGetSearchSuggestion
  | IStoresActionSetSearchSuggestion
  | IStoresActionGetGiftCard
  | IStoresActionSetGiftCard
  | IStoresActionCheckAliexpressProduct
  ;
