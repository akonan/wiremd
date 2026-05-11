import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'
import MiniEditor from './components/MiniEditor.vue'
import AppearanceSwitcher from './components/AppearanceSwitcher.vue'
import SidebarSearch from './components/SidebarSearch.vue'
import LandingHero from './components/LandingHero.vue'
import WiremdLanding from './components/WiremdLanding.vue'
import LandingAscii from './components/LandingAscii.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'sidebar-nav-before': () => h(SidebarSearch),
    'sidebar-nav-after': () => h(AppearanceSwitcher),
  }),
  enhanceApp({ app }) {
    app.component('MiniEditor', MiniEditor)
    app.component('LandingHero', LandingHero)
    app.component('WiremdLanding', WiremdLanding)
    app.component('LandingAscii', LandingAscii)
  }
} satisfies Theme
