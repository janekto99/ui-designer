export interface ComponentEntry {
  slug: string
  name: string
  icon: string
  /** Skupina v sidebaru. Pořadí skupin určuje pořadí prvního výskytu. */
  group: string
}

const entries: ComponentEntry[] = [
  { slug: 'button', name: 'Button', icon: 'lucide:square-mouse-pointer', group: 'Akce' },
  { slug: 'select', name: 'Select', icon: 'lucide:chevron-down', group: 'Akce' },
  { slug: 'toolbar', name: 'Toolbar', icon: 'lucide:wrench', group: 'Akce' },
  { slug: 'menu', name: 'Menu', icon: 'lucide:menu', group: 'Akce' },
  { slug: 'dialog', name: 'Dialog', icon: 'lucide:square-arrow-out-up-right', group: 'Akce' },

  { slug: 'toggle', name: 'Toggle', icon: 'lucide:toggle-right', group: 'Formuláře' },
  { slug: 'checkbox', name: 'Checkbox', icon: 'lucide:circle-check', group: 'Formuláře' },
  { slug: 'segmented-control', name: 'Segmented Control', icon: 'lucide:rows-3', group: 'Formuláře' },
  { slug: 'slider', name: 'Slider', icon: 'lucide:sliders-horizontal', group: 'Formuláře' },
  { slug: 'text-field', name: 'Text Field', icon: 'lucide:type', group: 'Formuláře' },
  { slug: 'search-field', name: 'Search Field', icon: 'lucide:search', group: 'Formuláře' },
  { slug: 'secure-field', name: 'Secure Field', icon: 'lucide:lock', group: 'Formuláře' },
  { slug: 'textarea', name: 'Textarea', icon: 'lucide:text-cursor-input', group: 'Formuláře' },
  { slug: 'search-token', name: 'Search Token', icon: 'lucide:tag', group: 'Formuláře' },

  { slug: 'date-picker', name: 'Date Picker', icon: 'lucide:calendar', group: 'Výběr hodnot' },
  { slug: 'time-picker', name: 'Time Picker', icon: 'lucide:clock', group: 'Výběr hodnot' },
  { slug: 'color-picker', name: 'Color Picker', icon: 'lucide:palette', group: 'Výběr hodnot' },

  { slug: 'navigation-bar', name: 'Navigation Bar', icon: 'lucide:panel-top', group: 'Navigace' },
  { slug: 'tab-bar', name: 'Tab Bar', icon: 'lucide:panel-left', group: 'Navigace' },
  { slug: 'sidebar', name: 'Sidebar', icon: 'lucide:panel-left-open', group: 'Navigace' },
  { slug: 'tabs', name: 'Tabs', icon: 'lucide:panel-top-dashed', group: 'Navigace' },
  { slug: 'breadcrumb', name: 'Breadcrumb', icon: 'lucide:chevrons-right', group: 'Navigace' },
  { slug: 'tree', name: 'Tree', icon: 'lucide:list-tree', group: 'Navigace' },
  { slug: 'page-control', name: 'Page Control', icon: 'lucide:ellipsis', group: 'Navigace' },

  { slug: 'card', name: 'Card', icon: 'lucide:square', group: 'Obsah' },
  { slug: 'table', name: 'Table', icon: 'lucide:table', group: 'Obsah' },
  { slug: 'list', name: 'List', icon: 'lucide:list', group: 'Obsah' },
  { slug: 'disclosure', name: 'Disclosure', icon: 'lucide:chevrons-up-down', group: 'Obsah' },
  { slug: 'share-sheet', name: 'Share Sheet', icon: 'lucide:share', group: 'Obsah' },

  { slug: 'alert', name: 'Alert', icon: 'lucide:triangle-alert', group: 'Zpětná vazba' },
  { slug: 'notification', name: 'Notification', icon: 'lucide:bell', group: 'Zpětná vazba' },
  { slug: 'temporary-notice', name: 'Temporary Notice', icon: 'lucide:message-square', group: 'Zpětná vazba' },
  { slug: 'tooltip', name: 'Tooltip', icon: 'lucide:message-circle', group: 'Zpětná vazba' },
  { slug: 'empty', name: 'Empty', icon: 'lucide:package-open', group: 'Zpětná vazba' },
  { slug: 'progress-bar', name: 'Progress Bar', icon: 'lucide:loader', group: 'Zpětná vazba' },
  { slug: 'activity-indicator', name: 'Activity Indicator', icon: 'lucide:loader-circle', group: 'Zpětná vazba' },

  { slug: 'avatar', name: 'Avatar', icon: 'lucide:circle-user', group: 'Drobnosti' },
  { slug: 'badge', name: 'Badge', icon: 'lucide:badge', group: 'Drobnosti' },
  { slug: 'tag', name: 'Tag', icon: 'lucide:tags', group: 'Drobnosti' },

  { slug: 'window-controls', name: 'Window Controls', icon: 'lucide:app-window', group: 'visionOS chrome' },
  { slug: 'keyboard', name: 'Keyboard', icon: 'lucide:keyboard', group: 'visionOS chrome' },
  { slug: 'system-activity', name: 'System Activity', icon: 'lucide:phone', group: 'visionOS chrome' },
]

export function useComponents() {
  const groups = computed(() => {
    const map = new Map<string, ComponentEntry[]>()
    for (const entry of entries) {
      const bucket = map.get(entry.group)
      if (bucket) bucket.push(entry)
      else map.set(entry.group, [entry])
    }
    return [...map].map(([name, items]) => ({ name, items }))
  })

  return {
    entries,
    groups,
    find: (slug: string) => entries.find((e) => e.slug === slug),
  }
}
