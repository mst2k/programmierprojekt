/** @type {import('tailwindcss').Config} */
export default {

	darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: {
          DEFAULT: '#f0f0f0', // Light gray from logo background
          dark: '#2c3e50'     // Dark blue from logo
        },
        foreground: {
          DEFAULT: '#2c3e50', // Dark blue from logo
          dark: '#f0f0f0'     // Light gray from logo background
        },
        card: {
          DEFAULT: 'white',
          foreground: '#2c3e50', // Dark blue from logo
          dark: '#34495e',       // Slightly lighter dark blue
          'foreground-dark': '#f0f0f0'
        },
        primary: {
          DEFAULT: '#3498db', // Blue from logo nodes
          foreground: 'white'
        },
        secondary: {
          DEFAULT: '#e74c3c', // Red from optimization curve
          foreground: 'white',
          dark: '#c0392b',    // Darker red
          'foreground-dark': 'white'
        },
        muted: {
          DEFAULT: '#f0f0f0', // Light gray from logo background
          foreground: '#2c3e50', // Dark blue from logo
          dark: '#2c3e50',       // Dark blue from logo
          'foreground-dark': '#f0f0f0'
        },
        accent: {
          DEFAULT: '#e74c3c', // Red from optimization curve
          foreground: 'white'
        },
        destructive: {
          DEFAULT: '#e74c3c', // Red from optimization curve
          foreground: 'white'
        },
        border: '#2c3e50',    // Dark blue from logo
        input: '#f0f0f0',     // Light gray from logo background
        ring: '#3498db',      // Blue from logo nodes
        chart: {
          '1': '#3498db', // Blue from logo nodes
          '2': '#e74c3c', // Red from optimization curve
          '3': '#2c3e50', // Dark blue from logo
          '4': '#f0f0f0', // Light gray from logo background
          '5': '#2980b9'  // Slightly darker blue
        }
      },
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
	plugins: [require("tailwindcss-animate")],
  }