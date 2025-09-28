
export function loadFontAsync(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print'; 
    link.onload = () => {
      link.media = 'all'; 
      resolve();
    };
    link.onerror = reject;
    
    document.head.appendChild(link);
  });
}


export async function loadFontsAsync(fontUrls: string[]): Promise<void> {
  try {
    await Promise.all(fontUrls.map(url => loadFontAsync(url)));
  } catch (error) {
    console.warn('Failed to load some fonts:', error);
  }
}

export function loadNonCriticalFonts(): void {
  if (typeof window === 'undefined') return;
  
  const nonCriticalFonts = [
    'https://fonts.googleapis.com/css2?family=Playfair+Display+SC:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap',
    'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display+SC:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap',
    'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'
  ];
  
  if (document.readyState === 'complete') {
    loadFontsAsync(nonCriticalFonts);
  } else {
    window.addEventListener('load', () => {
      loadFontsAsync(nonCriticalFonts);
    });
  }
}