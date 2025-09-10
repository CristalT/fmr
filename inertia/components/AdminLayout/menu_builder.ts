import { ref, Ref } from 'vue'
import { icons } from '~/components/ui/icon/icons'

export interface MenuOptions {
  label: string
  icon?: keyof typeof icons
  action?: () => void
  subOptions?: MenuOptions[]
  isActive?: boolean
  isCollapsed?: Ref<boolean>
}

export class MenuOption {
  label: string
  icon?: keyof typeof icons
  action?: () => void
  section?: string
  subOptions: MenuOptions[]
  isActive: boolean = false
  isCollapsed: Ref<boolean> = ref(true)

  constructor(option: MenuOptions) {
    this.label = option.label
    this.action = option.action
    this.icon = option.icon
    this.subOptions = []
  }

  addSubOption(subOption: MenuOptions) {
    const subMenu = new SubMenuOption(subOption)
    this.subOptions.push(subMenu)
    return subMenu
  }
}

export class SubMenuOption extends MenuOption {
  subItems: MenuOptions[]

  constructor(option: MenuOptions) {
    super(option)
    this.subItems = []
  }
}

export class Menu {
  private items: Map<string, MenuOption> = new Map()

  addOption(option: MenuOptions, callback?: (option: MenuOption) => void): Menu {
    const menuItem = new MenuOption(option)

    if (callback) {
      callback(menuItem)
    }
    this.items.set(option.label, menuItem)

    return this
  }

  getItems(): MenuOption[] {
    return Array.from(this.items.values())
  }
}
