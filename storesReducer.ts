import * as storesActions from 'src/actions/storesActions';
import IStoresState, { IStoresCache,
  IStoresItem, IVisitedStoreItem } from 'src/models/IStoresState';

export const initialState: IStoresState = {
  activeCategory: undefined,
  cache: {},
  categories: [],
  error: '',
  favorites: [],
  filter: { order: 'popularity', category: '', followed: false },
  ids: [],
  isStoreLoaded: false,
  loading: false,
  pushStoreId: '',
  refreshing: false,
  searchCache: {},
  searchIds: [],
  searchSuggestion: [],
  searchTotal: 0,
  total: 0,
  visitedStore: { ids: [], cache: {}, total: 0 },
};

export default (state: IStoresState = initialState, action: storesActions.Action) => {
  switch (action.type) {
    case storesActions.ActionTypes.GET_STORES: {
      const {
        refreshing = initialState.refreshing,
      } = action.payload;
      return {
        ...state,
        refreshing,
        loading: true,
      };
    }
    case storesActions.ActionTypes.SEARCH_STORE: {
      return {
        ...state,
        loading: true,
      };
    }
    case storesActions.ActionTypes.GET_STORES_SUCCEED: {
      const {
        items = initialState.ids,
        total = initialState.total,
        refreshing = initialState.refreshing,
      } = action.payload;
      const cache: IStoresCache = { ...state.cache };
      const ids = [
        ...refreshing ? [] : state.ids,
        ...items.map((item: IStoresItem) => {
          cache[item.id] = item;
          return item.id;
        }),
      ];
      return {
        ...state,
        cache,
        ids,
        total,
        error: '',
        loading: false,
        refreshing: false,
      };
    }
    case storesActions.ActionTypes.GET_STORE_SUCCEED: {
      const { id } = action.payload;
      if (state.cache && state.cache[id] && state.cache[id].boost) {
        action.payload.boost = state.cache[id].boost;
      }
      const cache: IStoresCache = {
        ...state.cache,
        [`${id}`]: action.payload,
      };
      return {
        ...state,
        cache,
        error: '',
        loading: false,
        refreshing: false,
      };
    }
    case storesActions.ActionTypes.SET_FAVORITE_SUCCEED: {
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    }
    case storesActions.ActionTypes.REMOVE_FAVORITE: {
      return {
        ...state,
        favorites: state.favorites.filter(item => action.favoriteId !== item.id),
      };
    }
    case storesActions.ActionTypes.GET_FAVORITES_SUCCEED: {
      return {
        ...state,
        favorites: action.payload,
      };
    }
    case storesActions.ActionTypes.GET_CATEGORIES_SUCCEED: {
      return {
        ...state,
        categories: action.payload,
      };
    }
    case storesActions.ActionTypes.SEARCH_STORE: {
      return{
        ...state,
        refreshing: true,
      };
    }
    case storesActions.ActionTypes.SEARCH_STORE_SUCCEED: {
      const {
        items = initialState.searchIds,
        total = initialState.searchTotal,
        refreshing = initialState.refreshing,
      } = action.payload;
      let searchCache: IStoresCache = { ...state.searchCache };
      searchCache = {};
      const searchIds = [
        ...refreshing ? [] : state.searchIds,
        ...items.map((item: IStoresItem) => {
          searchCache[item.id] = item;
          return item.id;
        }),
      ];

      return {
        ...state,
        searchCache,
        searchIds,
        total,
        error: '',
        loading: false,
        refreshing: false,
      };
    }
    case storesActions.ActionTypes.CLEAR_SEARCH_DATA: {
      return { ...state, searchCache: {}, searchIds: [], searchTotal: 0 };
    }
    case storesActions.ActionTypes.FILTER_SEARCH_DATA: {
      return { ...state, filter: action.payload };
    }
    case storesActions.ActionTypes.PUSH_PARAM: {
      return { ...state, pushStoreId: action.payload };
    }
    case storesActions.ActionTypes.RESET_STORES: {
      return initialState;
    }
    case storesActions.ActionTypes.IS_STORE_LOADED: {
      return { ...state, isStoreLoaded: action.payload };
    }
    case storesActions.ActionTypes.SET_VISITED_STORES: {
      const {
        items = initialState.visitedStore.ids,
        total = initialState.visitedStore.total,
        refreshing = initialState.refreshing,
      } = action.payload;
      const cache: Record<string, IVisitedStoreItem> = { ...state.visitedStore.cache };
      const ids = [
        ...refreshing ? [] : state.visitedStore.ids,
        ...items.map((item: IVisitedStoreItem) => {
          cache[item.id] = item;
          return item.id;
        }),
      ];
      return {
        ...state,
        visitedStore: { total, ids, cache },
      };
    }
    case storesActions.ActionTypes.SET_SEARCH_SUGGESTION: {
      return {
        ...state,
        searchSuggestion: action.payload,
      };
    }
    default:
      return state;
  }
};
