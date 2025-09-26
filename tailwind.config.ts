import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
    './src/styles/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './public/**/*.html'
  ],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: {
        '2xl':'1300px'
      }
    },
    fontFamily: {
      sans: ['InterVariable','Inter','system-ui','sans-serif'],
      display: ['Poppins','InterVariable','Inter','system-ui','sans-serif'],
      mono: ['ui-monospace','SFMono-Regular','Menlo','monospace']
    },
    extend: {
      colors: {
        lemon: {
          50:'#FFF7A8',100:'#FFF59B',200:'#FFF387',300:'#FFEF68',400:'#FFEB3B',
          500:'#FFEA3D',600:'#E6CF00',700:'#C3AD00',800:'#8A7400',900:'#4D4200'
        },
        brand: {
          DEFAULT:'#FFEB3B',
          soft:'#FFF59B',
          deep:'#C3AD00'
        },
        slateDeep: '#0F1724'
      },
      boxShadow: {
        'depth-1':'0 1px 2px -1px rgba(15,23,36,0.25),0 0 0 1px rgba(255,255,255,0.15) inset',
        'depth-2':'0 2px 4px -1px rgba(15,23,36,0.30),0 1px 0 0 rgba(255,255,255,0.12) inset',
        'depth-3':'0 4px 10px -2px rgba(15,23,36,0.45),0 0 0 1px rgba(255,255,255,0.18) inset',
        'depth-4':'0 8px 24px -6px rgba(15,23,36,0.55),0 0 0 1px rgba(255,255,255,0.22) inset',
        'depth-5':'0 12px 38px -8px rgba(15,23,36,0.65),0 0 0 1px rgba(255,255,255,0.28) inset'
      },
      backdropBlur: { xs:'2px', sm:'4px', md:'10px', lg:'18px', xl:'28px' },
      borderRadius: { glass:'1.25rem' },
      transitionTimingFunction: {
        smooth:'cubic-bezier(.4,.02,.2,1)',
        springy:'cubic-bezier(.16,.84,.44,1)'
      },
      keyframes: {
        'fade-up': { '0%':{opacity:'0',transform:'translateY(10px)'}, '100%':{opacity:'1',transform:'translateY(0)'} },
        pulseRing: {
          '0%':{boxShadow:'0 0 0 0 rgba(255,235,59,0.4)'},
          '70%':{boxShadow:'0 0 0 18px rgba(255,235,59,0)'},
          '100%':{boxShadow:'0 0 0 0 rgba(255,235,59,0)'}
        },
        shimmer: {
          '0%':{backgroundPosition:'-200% 0'},
          '100%':{backgroundPosition:'200% 0'}
        }
      },
      animation: {
        'fade-up':'fade-up .55s var(--ease-out) both',
        'pulse-ring':'pulseRing 2.6s ease-out infinite',
        'shimmer':'shimmer 2.2s linear infinite'
      }
    }
  },
  plugins: [
    plugin(function({ addBase, addUtilities, addVariant, theme }) {
      addBase({
        ':root': {
          '--font-sans':'InterVariable,Inter,system-ui,sans-serif',
          '--font-display':'Poppins,InterVariable,Inter,system-ui,sans-serif',
          '--ease-out':'cubic-bezier(.16,.84,.44,1)',

          '--bg-page':'#ffffff',
            '--bg-page-alt':'#f8fafc',
          '--gradient-bg-soft':'radial-gradient(circle at 22% 18%, rgba(255,235,59,0.18), transparent 60%),linear-gradient(132deg,#f8fafc 0%,#ffffff 70%)',

          '--text-primary':'#0f1724',
          '--text-secondary':'#273345',
          '--text-muted':'#4b5b6d',
          '--text-inverse':'#f1f5f9',
          '--text-accent':'#ffea3d',

          '--accent-grad':'linear-gradient(135deg,#FFF7A8 0%,#FFEB3B 55%,#FFEA3D 100%)',

          '--glass-fg':'rgba(255,255,255,0.58)',
          '--glass-fg-soft':'rgba(255,255,255,0.50)',
          '--glass-fg-hover':'rgba(255,255,255,0.72)',
          '--glass-border':'rgba(0,0,0,0.10)',
          '--glass-border-strong':'rgba(0,0,0,0.18)',
          '--glass-edge':'rgba(255,255,255,0.55)',
          '--glass-noise-opacity':'0.06',
          '--glass-radial':'radial-gradient(circle at 35% 20%,rgba(255,255,255,0.45),transparent 70%)',

          '--focus-ring':'#FFEB3B'
        },
        '.dark': {
          '--bg-page':'#0f1724',
          '--bg-page-alt':'#101a28',
          '--gradient-bg-soft':'radial-gradient(circle at 25% 20%, rgba(255,235,59,0.09), transparent 62%),linear-gradient(138deg,#0f1724 0%,#101a28 60%,#0a111a 100%)',

          '--text-primary':'#f1f5f9',
          '--text-secondary':'#94a3b8',
          '--text-muted':'#64748b',
          '--text-inverse':'#0f1724',

          '--glass-fg':'rgba(18,22,28,0.50)',
          '--glass-fg-soft':'rgba(18,22,28,0.38)',
          '--glass-fg-hover':'rgba(18,22,28,0.62)',
          '--glass-border':'rgba(255,255,255,0.14)',
          '--glass-border-strong':'rgba(255,255,255,0.22)',
          '--glass-edge':'rgba(255,255,255,0.28)',
          '--glass-noise-opacity':'0.045',
          '--glass-radial':'radial-gradient(circle at 32% 18%,rgba(255,255,255,0.18),transparent 72%)'
        }
      });

      addUtilities({
        '.glass-base': {
          position:'relative',
          background:'linear-gradient(145deg,var(--glass-fg-soft),var(--glass-fg))',
          backdropFilter:'blur(14px) saturate(1.15)',
          WebkitBackdropFilter:'blur(14px) saturate(1.15)',
          border:'1px solid var(--glass-border)',
          borderRadius: theme('borderRadius.glass'),
          boxShadow: theme('boxShadow.depth-2'),
          overflow:'hidden'
        },
        '.glass-interactive': {
          transition:'background-color 160ms var(--ease-out), box-shadow 220ms var(--ease-out), transform 220ms var(--ease-out)',
          cursor:'pointer'
        },
        '.glass-interactive:hover': {
          background:'linear-gradient(145deg,var(--glass-fg-hover),var(--glass-fg))',
          boxShadow: theme('boxShadow.depth-3')
        },
        '.glass-interactive:active': {
          transform:'translateY(1px) scale(.985)',
          boxShadow: theme('boxShadow.depth-1')
        },
        '.glass-noise': {
          position:'absolute',
          inset:'0',
          background:'url(/noise.png) center/cover',
          mixBlendMode:'overlay',
          opacity:'var(--glass-noise-opacity)',
          pointerEvents:'none'
        },
        '.heading-gradient': {
          background:'var(--accent-grad)',
          WebkitBackgroundClip:'text',
          color:'transparent'
        },
        '.focus-outline': { outline:'none' },
        '.focus-outline:focus-visible': {
          boxShadow:'0 0 0 3px var(--focus-ring), 0 0 0 6px rgba(255,235,59,0.35)'
        },
        '.shimmer': {
          backgroundImage:'linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.5) 50%,rgba(255,255,255,0) 100%)',
          backgroundSize:'200% 100%'
        },
        '.card-border': {
          boxShadow:'0 0 0 1px var(--glass-border-strong)'
        }
      });

      addUtilities({
        '.g-depth-1': { boxShadow: theme('boxShadow.depth-1') },
        '.g-depth-2': { boxShadow: theme('boxShadow.depth-2') },
        '.g-depth-3': { boxShadow: theme('boxShadow.depth-3') },
        '.g-depth-4': { boxShadow: theme('boxShadow.depth-4') },
        '.g-depth-5': { boxShadow: theme('boxShadow.depth-5') }
      });

      addVariant('hocus',['&:hover','&:focus-visible']);
    })
  ]
};

export default config;