import { definePreview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview = definePreview({
  parameters: {
    backgrounds: {
      default: 'page',
      values: [
        { name: 'page', value: '#f3f9fb' },
        { name: 'white', value: '#ffffff' },
        { name: 'lavender', value: '#f9f6fe' },
      ],
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
});

export default preview;
