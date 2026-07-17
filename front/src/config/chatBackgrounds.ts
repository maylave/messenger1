import type { ChatBackground } from '@/types/message'

export const availableBackgrounds: ChatBackground[] = [
  {
    id: 'default',
    name: 'Стандартный',
    type: 'solid',
    value: 'bg-frame-800',
  },
  {
    id: 'gradient-blue',
    name: 'Синий градиент',
    type: 'gradient',
    value: 'linear-gradient(135deg, #051424 0%, #1a2942 50%, #0d1c2d 100%)',
    preview: 'linear-gradient(135deg, #051424 0%, #1a2942 50%, #0d1c2d 100%)',
  },
  {
    id: 'gradient-purple',
    name: 'Фиолетовый',
    type: 'gradient',
    value: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%)',
    preview: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%)',
  },
  {
    id: 'gradient-dark',
    name: 'Тёмный',
    type: 'gradient',
    value: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
    preview: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
  },
  {
    id: 'pattern-dots',
    name: 'Точки',
    type: 'pattern',
    value: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
    preview: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
  },
  {
    id: 'pattern-grid',
    name: 'Сетка',
    type: 'pattern',
    value: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
    preview: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
  },
]
