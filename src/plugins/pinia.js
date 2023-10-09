// https://prazdevs.github.io/pinia-plugin-persistedstate/guide/
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(
  createPersistedState({
    key: id => `pinia__${id}`,
    storage: sessionStorage,
    // serializer: {
    //   deserialize: e => JSON.parse(e),
    //   serialize: e => JSON.stringify(e),
    // },
  }),
)

export default pinia
