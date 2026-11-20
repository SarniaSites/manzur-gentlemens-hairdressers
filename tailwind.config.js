/** Manzur Gentlemens Hairdressers — colours sampled from the shop itself. */
module.exports = {
  content: ['./index.html', './thanks.html', './404.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        // ink: the black fascia and logo (#010101 in the logo, #040404 in the banner), warmed slightly so it isn't flat black
        ink: { DEFAULT: '#171514', 900: '#100f0e', 800: '#1f1c1a', 700: '#2b2725', 600: '#3d3835' },
        // surface: the painted Georgian panelling of the shopfront and the arcade walls (cool grey-white)
        surface: { DEFAULT: '#edece8', deep: '#e2e0da' },
        // paper: the lighter wall inside the shop, used for cards and the appointment card
        paper: '#f7f6f3',
        // action: the red of the barber's pole in the shop window. Reserved for Call / Book / links only
        action: { DEFAULT: '#b3222b', dark: '#931a22', light: '#d9434b' },
        // accent: the tan leather tool roll the scissors sit on. Markers, today's tag, small drawings
        accent: { DEFAULT: '#9a6a44', light: '#c69b74' },
        // support: the brown of the shop's barber chairs, for muted text on light grounds
        support: '#4a3b34',
        // mute: the mid grey of the logo anti-aliasing (#767676 / #595959), for secondary text on dark
        mute: { DEFAULT: '#a9a39d', dark: '#6e6863' },
      },
      fontFamily: {
        // Condensed caps like the OPEN sign and the shop's closed notices
        display: ['"Sofia Sans Extra Condensed Variable"', '"Arial Narrow"', 'sans-serif'],
        // Quiet body face, close to the wide window lettering "GENTLEMENS HAIRDRESSERS"
        sans: ['"Onest Variable"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { site: '84rem' },
      transitionTimingFunction: { out: 'cubic-bezier(.2,.7,.2,1)', swing: 'cubic-bezier(.45,.05,.35,1)' },
      boxShadow: { card: '0 1px 0 rgba(23,21,20,.06), 0 18px 40px -24px rgba(23,21,20,.45)', sign: '0 10px 24px -10px rgba(0,0,0,.55)' },
    },
  },
  plugins: [],
};
