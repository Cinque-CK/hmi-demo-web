<template>
  <div class="action-bar__wrapper">
    <button v-if="isSyncing" title="syncing" :disabled="true" class="action-btn syncing">
      <svgicon icon="system/actions/sync" width="24" height="24" color="rgba(0,0,0,.38)"></svgicon>
    </button>

    <button v-tooltip="'撤销'" class="action-btn" :disabled="!canUndo" @click="$root.$emit('undo')">
      <svgicon icon="system/actions/undo" width="24" height="24"
        :color="canUndo ? '#2b6a73' : 'rgba(0,0,0,.38)'">
      </svgicon>
    </button>

    <button v-tooltip="'恢复'" class="action-btn" :disabled="!canRedo" @click="$root.$emit('redo')">
      <svgicon icon="system/actions/redo" width="24" height="24"
        :color="canRedo ? '#2b6a73' : 'rgba(0,0,0,.38)'">
      </svgicon>
    </button>

    <router-link :to="{name: 'preview'}">
      <button v-tooltip="'预览'" class="action-btn">
        <svgicon icon="system/actions/preview" width="24" height="24" color="#2b6a73"></svgicon>
      </button>
    </router-link>

    <div class="separator"></div>

    <button v-tooltip="'清空项目'" class="action-btn"
      :disabled="isLoading" @click="$root.$emit('open-confirm-dialog')">
      <svgicon icon="system/actions/delete" width="24" height="24" color="#2b6a73"></svgicon>
    </button>

    <mdc-menu-anchor>
      <button v-tooltip="'打开...'" class="action-btn" :disabled="isLoading" @click="showLoadFromMenu">
        <svgicon icon="system/actions/folder" width="24" height="24" color="#2b6a73"></svgicon>
      </button>
      <mdc-menu ref="loadFromMenu" @select="onSelectLoadFrom">
        <mdc-menu-item disabled>Open project:</mdc-menu-item>
        <mdc-menu-divider></mdc-menu-divider>
        <mdc-menu-item>
          <input type="file" ref="inputOpenLocal" @change="openLocalFile" :value="fileValue" accept=".gg"/>
          Computer
        </mdc-menu-item>
        <mdc-menu-item>GitHub</mdc-menu-item>
      </mdc-menu>
    </mdc-menu-anchor>

    <mdc-menu-anchor>
      <button v-tooltip="'下载...'" class="action-btn" :disabled="isLoading" @click="showDownloadMenu">
        <svgicon icon="system/actions/download" width="24" height="24" color="#2b6a73"></svgicon>
      </button>
      <mdc-menu ref="downloadMenu" @select="onSelectDownload">
        <mdc-menu-item disabled>Download:</mdc-menu-item>
        <mdc-menu-divider></mdc-menu-divider>
        <mdc-menu-item>Vuegg project (.gg)</mdc-menu-item>
        <mdc-menu-item>Vue sources (.zip)</mdc-menu-item>
      </mdc-menu>
    </mdc-menu-anchor>

    <button v-tooltip="saveBtnTitle" class="action-btn" @click="$root.$emit('open-upload-dialog')"
      :disabled="!isLoggedIn || !hasChanges || (isLoggedIn && isLoading)"
    >
      <svgicon icon="system/actions/cloud_off" v-if="!isLoggedIn"
        width="24" height="24" color="rgba(0,0,0,.38)">
      </svgicon>
      <svgicon icon="system/actions/cloud_up" v-else-if="hasChanges"
        width="24" height="24" color="#2b6a73">
      </svgicon>
      <svgicon icon="system/actions/cloud_done" v-else
        width="24" height="24" color="rgba(0,0,0,.38)">
      </svgicon>
    </button>

    <div class="separator"></div>
  </div>
</template>


<script>
import { mapState, mapActions } from 'vuex'
import { downloadProject, downloadVueSources, loadVueggProject } from '../../../store/types'

import '../../../assets/icons/system/actions'

export default {
  name: 'action-bar',
  data: function () {
    return {
      fileValue: null
    }
  },
  computed: {
    saveBtnTitle () {
      return !this.isLoggedIn
        ? 'Login with GitHub to save project'
        : this.hasChanges
          ? 'Save in GitHub'
          : 'Nothing to save'
    },

    ...mapState({
      isLoading: state => state.app.isLoading,
      isSyncing: state => state.app.isSyncing,
      hasChanges: state => state.app.hasChanges,
      canUndo: state => state.app.canUndo,
      canRedo: state => state.app.canRedo,
      isLoggedIn: state => state.oauth.isAuthorized
    })
  },
  methods: {
    // --- DOWNLOAD MENU METHODS
    showDownloadMenu () {
      this.$refs.downloadMenu.show()
    },
    onSelectDownload (selected) {
      const PROJECT = 1
      const SOURCES = 2

      switch (selected.index) {
        case PROJECT: this.downloadProject(); break
        case SOURCES: this.downloadVueSources(); break
      }
    },

    // --- LOAD FROM MENU METHODS
    showLoadFromMenu () {
      this.$refs.loadFromMenu.show()
    },
    onSelectLoadFrom (selected) {
      const PC = 1
      const GITHUB = 2

      switch (selected.index) {
        case GITHUB: this.$root.$emit('open-load-dialog'); break
        case PC:
          this.fileValue = null
          this.$refs.inputOpenLocal.click()
          break
      }
    },
    openLocalFile (event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = e => this.loadVueggProject({origin: 'pc', content: e.target.result})
      reader.readAsText(file)
    },

    ...mapActions([downloadProject, downloadVueSources, loadVueggProject])
  }
}
</script>


<style scoped>
.action-bar__wrapper {
  height: 100%;
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-self: stretch;
  align-items: center;
  box-sizing: border-box;
}

.action-btn {
  height: 36px;
  width: 36px;
  min-width: 28px;
  min-height: 28px;
  padding: 1px;
  margin: 0 6px;
  border-radius: 100%;

  background-color: transparent;
  border: 0px none;
  user-select: none;
  outline: none;
}
.action-btn:hover {
  background-color: rgba(43, 106, 115, 0.038);
}
.action-btn:active {
  background-color: rgba(43, 106, 115, 0.38);
}
.action-btn * {
  vertical-align: middle;
}

.mdc-menu {
  background-color: #fff;
  transform-origin: right top 0 !important;
  top: 0px !important;
  right: 0px;
  left: auto !important;
}
.mdc-menu-item input {
  display: none;
}

.separator {
  width: 1px;
  height: 16px;
  margin: 0 6px;
  background-color: rgba(0, 0, 0, 0.12);
}

.syncing {
  animation:spin 1s linear infinite;
}
@keyframes spin { 100% { transform:rotate(360deg); }}

</style>
