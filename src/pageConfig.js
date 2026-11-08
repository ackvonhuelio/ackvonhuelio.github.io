export const PAGES = {
  home: {
    path: '/',
    scroll: true,
    camera: {
      orientation: [0, 0, 0],
      zoom: 1,
      transitionSpeed: 3,
      mouseRotation: {
        pitch: 0.2,
        yawNarrow: 0.3,
        yawWide: 0.05,
        damping: 3,
      },
    },
  },
  about: {
    path: '/about',
    scroll: false,
    camera: {
      orientation: [0.05, 0.2, -0.15],
      zoom: 2,
      transitionSpeed: 3,
      mouseRotation: {
        pitch: 0.02,
        yawNarrow: 0.2,
        yawWide: 0,
        damping: 8,
      },
    },
  },
  about2: {
    path: '/about2',
    scroll: false,
    camera: {
      orientation: [0.05, 0.2, -0.1],
      zoom: 2.2,
      transitionSpeed: 3,
      mouseRotation: {
        pitch: 0.02,
        yawNarrow: 0.2,
        yawWide: 0,
        damping: 8,
      },
    },
  },
  projects: {
    path: '/projects',
    scroll: false,
    camera: {
      orientation: [0.065, -0.22, 0.08],
      zoom: 1.9,
      transitionSpeed: 3,
      mouseRotation: {
        pitch: 0.02,
        yawNarrow: 0.24,
        yawWide: 0,
        damping: 8,
      },
    },
  },
  contact: {
    path: '/contact',
    scroll: false,
    camera: {
      orientation: [0.15, -0.01, -0.015],
      zoom: 2,
      transitionSpeed: 3,
      mouseRotation: {
        pitch: 0.05,
        yawNarrow: 0.01,
        yawWide: 0.04,
        damping: 8,
      },
    },
  },
  experience: {
    path: '/experience',
    scroll: false,
    camera: {
      orientation: [-0.1, -0.02, -0.015],
      zoom: 2,
      transitionSpeed: 3,
      mouseRotation: {
        pitch: 0.05,
        yawNarrow: 0.01,
        yawWide: 0.04,
        damping: 8,
      },
    },
  },
  skills: {
    path: '/skills',
    scroll: false,
    camera: {
      orientation: [-0.1, -0.02, -0.02],
      zoom: 2.2,
      transitionSpeed: 3,
      mouseRotation: {
        pitch: 0.05,
        yawNarrow: 0.01,
        yawWide: 0.04,
        damping: 8,
      },
    },
  },
}

export const getPageIdFromPath = (pathname) =>
  Object.keys(PAGES).find((pageId) => PAGES[pageId].path === pathname) ?? 'home'
