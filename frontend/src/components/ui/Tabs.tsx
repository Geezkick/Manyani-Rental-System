import React from 'react'

interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

interface TabsListProps {
  children: React.ReactNode
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
}

export const Tabs: React.FC<TabsProps> & {
  List: React.FC<TabsListProps>
  Trigger: React.FC<TabsTriggerProps>
  Content: React.FC<TabsContentProps>
} = ({ defaultValue, value, onValueChange, children }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  const currentValue = value || activeTab

  const handleChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      setActiveTab(newValue)
    }
  }

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        activeValue: currentValue,
        onValueChange: handleChange
      } as any)
    }
    return child
  })

  return <div className="w-full">{childrenWithProps}</div>
}

export const TabsList: React.FC<TabsListProps & { activeValue?: string; onValueChange?: (value: string) => void }> = ({ 
  children, 
  activeValue, 
  onValueChange 
}) => {
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        activeValue,
        onValueChange
      } as any)
    }
    return child
  })

  return (
    <div className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
      {childrenWithProps}
    </div>
  )
}

export const TabsTrigger: React.FC<TabsTriggerProps & { activeValue?: string; onValueChange?: (value: string) => void }> = ({ 
  value, 
  children, 
  activeValue, 
  onValueChange 
}) => {
  const isActive = activeValue === value

  return (
    <button
      type="button"
      onClick={() => onValueChange?.(value)}
      className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
        isActive
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

export const TabsContent: React.FC<TabsContentProps & { activeValue?: string }> = ({ 
  value, 
  children, 
  activeValue 
}) => {
  if (value !== activeValue) return null

  return <div className="mt-4">{children}</div>
}

// Assign components to Tabs
Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent
