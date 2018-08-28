import actionTypes from '../constants/actions';
import { loadingStarted, loadingFinished } from '../utils/loading';
import { getAccount } from '../utils/api/account';
import { getTransactions } from '../utils/api/transactions';
import { getDelegate, getVoters, getVotes } from '../utils/api/delegate';
import searchAll from '../utils/api/search';

const searchDelegate = ({ publicKey, address }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    getDelegate(activePeer, { publicKey }).then((response) => {
      dispatch({
        data: {
          delegate: response.data[0],
          address,
        },
        type: actionTypes.searchDelegate,
      });
    });
  };

const searchVotes = ({ address }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    getVotes(activePeer, address).then(response =>
      dispatch({
        type: actionTypes.searchVotes,
        data: {
          votes: response.data.votes,
          address,
        },
      }));
  };
const searchVoters = ({ address, publicKey }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    getVoters(activePeer, publicKey).then(response =>
      dispatch({
        type: actionTypes.searchVoters,
        data: {
          voters: response.data.voters,
          address,
        },
      }));
  };

export const searchAccount = ({ address }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    dispatch(searchVotes({ activePeer, address }));
    getAccount(activePeer, address).then((response) => {
      const accountData = {
        ...response,
      };
      if (accountData.publicKey) {
        dispatch(searchDelegate({ activePeer, publicKey: accountData.publicKey, address }));
        dispatch(searchVoters({ activePeer, address, publicKey: accountData.publicKey }));
      }
      dispatch({ data: accountData, type: actionTypes.searchAccount });
    });
  };

export const searchTransactions = ({
  address, limit, filter, showLoading = true,
}) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    if (showLoading) loadingStarted(actionTypes.searchTransactions);
    getTransactions({
      activePeer, address, limit, filter,
    })
      .then((transactionsResponse) => {
        dispatch({
          data: {
            address,
            transactions: transactionsResponse.data,
            count: parseInt(transactionsResponse.meta.count, 10) || 0,
            filter,
          },
          type: actionTypes.searchTransactions,
        });
        if (filter !== undefined) {
          dispatch({
            data: {
              filterName: 'transactions',
              value: filter,
            },
            type: actionTypes.addFilter,
          });
        }
        if (showLoading) loadingFinished(actionTypes.searchTransactions);
      });
  };

export const searchMoreTransactions = ({
  address, limit, offset, filter,
}) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    getTransactions({
      activePeer, address, limit, offset, filter,
    })
      .then((transactionsResponse) => {
        dispatch({
          data: {
            address,
            transactions: transactionsResponse.data,
            count: parseInt(transactionsResponse.meta.count, 10),
            filter,
          },
          type: actionTypes.searchMoreTransactions,
        });
      });
  };

export const searchSuggestions = ({ searchTerm }) =>
  (dispatch, getState) => {
    const activePeer = getState().peers.data;
    dispatch({
      data: {},
      type: actionTypes.searchClearSuggestions,
    });
    searchAll({ activePeer, searchTerm }).then(response => dispatch({
      data: response,
      type: actionTypes.searchSuggestions,
    }));
  };
