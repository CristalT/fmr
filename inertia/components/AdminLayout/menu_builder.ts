import { icons } from '~/components/ui/icon/icons'

interface MenuOption {
  label: string
  action: () => void
  icon: keyof typeof icons
  section?: string
}

export class MenuItem {
  label: string
  icon: keyof typeof icons
  action: () => void
  section?: string

  constructor(option: MenuOption) {
    this.label = option.label
    this.action = option.action
    this.icon = option.icon
    this.section = option.section
  }
}

export class Menu {
  private items: Map<string, MenuItem> = new Map()

  addOption(option: MenuOption): Menu {
    this.items.set(option.label, new MenuItem(option))
    return this
  }

  getItems(): MenuItem[] {
    return Array.from(this.items.values())
  }
}
