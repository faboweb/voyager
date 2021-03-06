<template>
  <tm-page data-title="Transactions"
    ><template slot="menu-body">
      <tm-balance />
      <tool-bar
        ><a
          v-tooltip.bottom="'Refresh'"
          :disabled="!connected"
          class="refresh-button"
          @click="connected && refreshTransactions()"
          ><i class="material-icons">refresh</i></a
        ><a
          v-tooltip.bottom="'Search'"
          :disabled="!somethingToSearch"
          class="search-button"
          @click="setSearch()"
          ><i class="material-icons">search</i></a
        ></tool-bar
      >
    </template>
    <modal-search v-if="somethingToSearch" type="transactions" />
    <tm-data-connecting v-if="!transactions.loaded && !connected" />
    <tm-data-loading v-else-if="!transactions.loaded && transactions.loading" />
    <tm-data-error v-else-if="transactions.error" />
    <data-empty-tx v-else-if="allTransactions.length === 0" />
    <data-empty-search v-else-if="filteredTransactions.length === 0" /><template
      v-for="tx in filteredTransactions"
      v-else
    >
      <tm-li-any-transaction
        :validators="delegates.delegates"
        :validators-url="validatorURL"
        :proposals-url="proposalsURL"
        :key="tx.hash"
        :transaction="tx"
        :address="wallet.address"
        :bonding-denom="bondDenom"
        :unbonding-time="
          time.getUnbondingTime(tx, delegation.unbondingDelegations)
        "
      />
    </template>
  </tm-page>
</template>

<script>
import shortid from "shortid"
import { mapGetters, mapState } from "vuex"
import { includes, orderBy } from "lodash"
import Mousetrap from "mousetrap"
import DataEmptySearch from "common/TmDataEmptySearch"
import DataEmptyTx from "common/TmDataEmptyTx"
import ModalSearch from "common/TmModalSearch"
import TmBalance from "common/TmBalance"
import TmDataError from "common/TmDataError"
import TmDataConnecting from "common/TmDataConnecting"
import TmPage from "common/TmPage"
import TmDataLoading from "common/TmDataLoading"
import TmLiAnyTransaction from "transactions/TmLiAnyTransaction"
import ToolBar from "common/ToolBar"
import time from "scripts/time"

export default {
  name: `page-transactions`,
  components: {
    TmBalance,
    TmLiAnyTransaction,
    TmDataLoading,
    TmDataError,
    TmDataConnecting,
    DataEmptySearch,
    DataEmptyTx,
    ModalSearch,
    TmPage,
    ToolBar
  },
  data: () => ({
    shortid: shortid,
    sort: {
      property: `height`,
      order: `desc`
    },
    validatorURL: `/staking/validators`,
    proposalsURL: `/governance/proposals`,
    time
  }),
  computed: {
    ...mapState([`transactions`]),
    ...mapGetters([
      `filters`,
      `allTransactions`,
      `wallet`,
      `bondDenom`,
      `delegation`,
      `delegates`,
      `connected`
    ]),
    somethingToSearch() {
      return !this.transactions.loading && !!this.allTransactions.length
    },
    orderedTransactions() {
      return orderBy(
        this.allTransactions.map(t => {
          t.height = parseInt(t.height)
          return t // TODO what happens if block height is bigger then int?
        }),
        [this.sort.property],
        [this.sort.order]
      )
    },
    filteredTransactions() {
      let query = this.filters.transactions.search.query
      if (this.filters.transactions.search.visible) {
        // doing a full text comparison on the transaction data
        return this.orderedTransactions.filter(t =>
          includes(JSON.stringify(t).toLowerCase(), query)
        )
      } else {
        return this.orderedTransactions
      }
    }
  },
  mounted() {
    Mousetrap.bind([`command+f`, `ctrl+f`], () => this.setSearch(true))
    Mousetrap.bind(`esc`, () => this.setSearch(false))
    this.refreshTransactions()
  },
  methods: {
    refreshTransactions() {
      this.$store.dispatch(`getAllTxs`)
    },
    setSearch(bool = !this.filters[`transactions`].search.visible) {
      if (!this.somethingToSearch) return false
      this.$store.commit(`setSearchVisible`, [`transactions`, bool])
    }
  }
}
</script>
