import BN from "bignumber.js"
import { calculateTokens } from "scripts/common"
// ui
export const config = state => state.config

export const filters = state => state.filters
export const notifications = state => state.notifications
export const user = state => state.user
export const lastPage = state => {
  return (
    state.user.history.length &&
    state.user.history[state.user.history.length - 1]
  )
}
export const themes = state => state.themes
export const onboarding = state => state.onboarding

// wallet
export const allTransactions = state =>
  state.transactions.wallet.concat(
    state.transactions.staking,
    state.transactions.governance
  )
export const wallet = state => state.wallet

// staking
export const delegation = state => state.delegation
export const totalAtoms = (state, getters) => {
  return new BN(getters.user.atoms)
    .plus(new BN(getters.oldBondedAtoms))
    .plus(new BN(getters.oldUnbondingAtoms))
    .toString()
}
export const oldBondedAtoms = (state, getters) => {
  let totalOldBondedAtoms = new BN(0)
  Object.keys(getters.delegation.committedDelegates).forEach(
    delegatorAddress => {
      let shares = getters.delegation.committedDelegates[delegatorAddress]
      let delegator = getters.delegates.delegates.find(
        d => d.id === delegatorAddress
      )
      if (!delegator) {
        return
      }
      totalOldBondedAtoms = totalOldBondedAtoms.plus(
        calculateTokens(delegator, shares)
      )
    }
  )
  return totalOldBondedAtoms.toString()
}

export const oldUnbondingAtoms = (state, getters) => {
  return Object.values(getters.delegation.unbondingDelegations).reduce(
    (atoms, { balance }) => {
      return atoms + balance.amount
    },
    0
  )
}
export const committedDelegations = state => state.delegation.committedDelegates
export const delegates = state => state.delegates
export const shoppingCart = state => state.delegation.delegates
export const validators = state => state.validators.validators
export const keybase = state => state.keybase.identities
export const pool = state => state.pool
export const stakingParameters = state => state.stakingParameters
export const bondDenom = getters =>
  getters.stakingParameters.parameters.bond_denom

// governance
export const proposals = state => state.proposals
export const votes = state => state.votes.votes
export const deposits = state => state.deposits.deposits
export const governanceParameters = state => state.governanceParameters
export const depositDenom = getters =>
  getters.governanceParameters.parameters.deposit.min_deposit[0].denom

// status
export const approvalRequired = state => state.connection.approvalRequired
export const connected = state => state.connection.connected
export const lastHeader = state => state.connection.lastHeader
export const nodeURL = state =>
  state.connection.node ? state.connection.node.remoteLcdURL : undefined
