
let themeVariant = 'selected-paragon-theme-variant';

const AddDarkTheme = () => {
  const isThemeToggleEnabled = getConfig().INDIGO_ENABLE_DARK_TOGGLE;
  const baseUrl = getConfig().LMS_BASE_URL;

  const addDarkThemeToIframes = () => {
    const iframes = document.getElementsByTagName('iframe');
    const iframesLength = iframes.length;
    if (iframesLength > 0) {
      Array.from({ length: iframesLength }).forEach((_, index) => {
        const style = document.createElement('style');
        style.textContent = `
          body {
            background-color: #050505;
            color: #F5F5F2;
          }
          a { color: #F5F5F2; }
          a:hover { color: #D5D5D0; }
        `;
        if (iframes[index].contentDocument) {
          iframes[index].contentDocument.head.appendChild(style);
        }
      });
    }
  };

  useEffect(() => {
    const theme = window.localStorage.getItem(themeVariant) || 'dark';

    // - When page loads, Footer loads before MFE content. Since there is no iframe on page,
    // it does not append any class. MutationObserver observes changes in DOM and hence appends dark
    // attributes when iframe is added. After 15 sec, this observer is destroyed to conserve resources. 
    // - It has been added outside dark-theme condition so that it can be removed on Component Unmount.
    // - Observer can be passed to `addDarkThemeToIframes` function and disconnected after observing Iframe.
    // This approach has a limitation: the observer first detects the iframe and then detects the docSrc. 
    // We need to wait for docSrc to fully load before appending the style tag.
    const observer = new MutationObserver(() => {
      addDarkThemeToIframes();
    });

    if (isThemeToggleEnabled && theme === 'dark') {
      document.documentElement.setAttribute('data-paragon-theme-variant', 'dark');
      document.documentElement.setAttribute('data-theme-variant', 'dark');

      observer.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => observer?.disconnect(), 15000); // clear after 15 sec to avoid resource usage
    }

    return () => observer?.disconnect();
  }, []);

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'CS Genio Mono';
            src: url('${baseUrl}/static/indigo/fonts/CSGenioMono-Regular.woff2') format('woff2');
            font-display: swap;
          }
          @font-face {
            font-family: 'Dx Monstral';
            src: url('${baseUrl}/static/indigo/fonts/DxMonstral-Regular.woff2') format('woff2');
            font-display: swap;
          }
          :root {
            --paradigma-black: #050505;
            --paradigma-ink: #0B0B0B;
            --paradigma-surface: #202222;
            --paradigma-white: #F5F5F2;
            --paradigma-border: #D5D5D0;
            --paradigma-muted: #A3A3A0;
            --pgn-color-primary-base: #050505FF;
            --pgn-color-primary-light: #F5F5F2FF;
            --pgn-color-text-primary: #202222FF;
            --pgn-color-btn-bg-primary: #050505FF;
            --pgn-color-btn-border-primary: #050505FF;
            --pgn-color-btn-text-primary: #F5F5F2FF;
          }
          body, button, input, select, textarea {
            font-family: 'Helvetica Neue', Arial, sans-serif !important;
          }
          h1, h2, h3, h1 *, h2 *, h3 * {
            font-family: 'Dx Monstral', 'Arial Black', 'Helvetica Neue', Arial, sans-serif !important;
            font-weight: 400 !important;
            letter-spacing: -0.025em;
          }
          header .nav-link, header .dropdown-item, footer a,
          .btn, .pgn__button, button[type='submit'] {
            font-family: 'CS Genio Mono', 'IBM Plex Mono', monospace !important;
          }
          .btn-primary, .pgn__button-primary, button[type='submit'] {
            border-radius: 9999px !important;
            background: var(--paradigma-black) !important;
            border-color: var(--paradigma-black) !important;
            color: var(--paradigma-white) !important;
            text-transform: uppercase;
            letter-spacing: .04em;
          }
          .btn-outline-primary, .pgn__button-outline-primary {
            border-radius: 9999px !important;
            border-color: var(--paradigma-black) !important;
            color: var(--paradigma-black) !important;
          }
          .card, .pgn__card, .pgn__data-table-wrapper {
            border-color: var(--paradigma-border) !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          #root header .logo-image {
            width: 82px;
            height: 36px;
            object-fit: contain;
          }
          .wrapper-footer {
            background: var(--paradigma-black) !important;
            border-top: 1px solid rgba(213, 213, 208, .2) !important;
            color: var(--paradigma-white) !important;
          }
          .wrapper-footer a,
          .wrapper-footer .copyright-site,
          .wrapper-footer .logo-list li {
            color: var(--paradigma-border) !important;
          }
          .wrapper-footer a:hover {
            color: var(--paradigma-white) !important;
          }
          .paradigma-footer-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 28px;
            color: var(--paradigma-white);
            font-family: 'Dx Monstral', 'Arial Black', sans-serif;
            font-size: 28px;
          }
          .paradigma-footer-brand img {
            width: 58px;
            height: 26px;
            object-fit: contain;
          }
          [data-paragon-theme-variant='dark'] body,
          [data-theme-variant='dark'] body {
            background: var(--paradigma-black) !important;
            color: var(--paradigma-white) !important;
          }
          [data-paragon-theme-variant='dark'] .btn-primary,
          [data-theme-variant='dark'] .btn-primary,
          [data-paragon-theme-variant='dark'] .pgn__button-primary,
          [data-theme-variant='dark'] .pgn__button-primary {
            background: var(--paradigma-white) !important;
            border-color: var(--paradigma-white) !important;
            color: var(--paradigma-black) !important;
          }
        `}
      </style>
      <div />
    </>
  );
};
