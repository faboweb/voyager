<template>
  <div class="tm-notifications">
    <tm-notification
      v-for="notification in notifications"
      :key="notification.key"
      :type="notification.type"
      :body="notification.body"
      :icon="notification.icon"
      :layout="notification.layout"
      :title="notification.title"
      :time="notification.time"
      :theme="theme"
    ></tm-notification>
  </div>
</template>

<script>
import TmNotification from "./TmNotification.vue"
export default {
  name: `tm-notifications`,
  components: {
    TmNotification
  },
  props: {
    notifications: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      default: null
    }
  }
}
</script>

<style>
.tm-notifications {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2000;
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  width: 100vw;
}

.tm-notification {
  margin-bottom: 0.5rem;
}

.tm-notification:last-of-type {
  margin-bottom: 0;
}

@media screen and (min-width: 720px) {
  .tm-notifications {
    max-width: 30rem;
  }
}
</style>
