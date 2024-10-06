/** @type {import('tailwindcss').Config} */
export default {

	darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    // extend: {
    //   borderRadius: {
    //     lg: 'var(--radius)',
    //     md: 'calc(var(--radius) - 2px)',
    //     sm: 'calc(var(--radius) - 4px)'
    //   },
    //   colors: {
    //     background: {
    //       DEFAULT: '#f0f0f0', // Light gray from logo background
    //       dark: '#2c3e50'     // Dark blue from logo
    //     },
    //     foreground: {
    //       DEFAULT: '#2c3e50', // Dark blue from logo
    //       dark: '#f0f0f0'     // Light gray from logo background
    //     },
    //     card: {
    //       DEFAULT: 'white',
    //       foreground: '#2c3e50', // Dark blue from logo
    //       dark: '#34495e',       // Slightly lighter dark blue
    //       'foreground-dark': '#f0f0f0'
    //     },
    //     primary: {
    //       DEFAULT: '#3498db', // Blue from logo nodes
    //       foreground: 'white'
    //     },
    //     secondary: {
    //       DEFAULT: '#e74c3c', // Red from optimization curve
    //       foreground: 'white',
    //       dark: '#c0392b',    // Darker red
    //       'foreground-dark': 'white'
    //     },
    //     muted: {
    //       DEFAULT: '#f0f0f0', // Light gray from logo background
    //       foreground: '#2c3e50', // Dark blue from logo
    //       dark: '#2c3e50',       // Dark blue from logo
    //       'foreground-dark': '#f0f0f0'
    //     },
    //     accent: {
    //       DEFAULT: '#e74c3c', // Red from optimization curve
    //       foreground: 'white'
    //     },
    //     destructive: {
    //       DEFAULT: '#e74c3c', // Red from optimization curve
    //       foreground: 'white'
    //     },
    //     border: '#2c3e50',    // Dark blue from logo
    //     input: '#f0f0f0',     // Light gray from logo background
    //     ring: '#3498db',      // Blue from logo nodes
    //     chart: {
    //       '1': '#3498db', // Blue from logo nodes
    //       '2': '#e74c3c', // Red from optimization curve
    //       '3': '#2c3e50', // Dark blue from logo
    //       '4': '#f0f0f0', // Light gray from logo background
    //       '5': '#2980b9'  // Slightly darker blue
    //     }
    //   },
    extend: {
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: '#f0f0f0',//'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
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