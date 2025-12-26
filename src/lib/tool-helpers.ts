// Helper to get related tools for a category
export function getRelatedTools(categoryHref: string, currentToolHref: string, allTools: Array<{ name: string; href: string }>) {
  return allTools
    .filter(tool => tool.href !== currentToolHref)
    .slice(0, 4)
}

// Category mappings
export const categoryMap: Record<string, { name: string; href: string }> = {
  '/text': { name: 'Text & Writing Tools', href: '/text' },
  '/health-fitness': { name: 'Health & Fitness', href: '/health-fitness' },
  '/financial': { name: 'Financial Tools', href: '/financial' },
  '/image': { name: 'Image Tools', href: '/image' },
  '/datetime': { name: 'Date & Time', href: '/datetime' },
  '/dev': { name: 'Developer Tools', href: '/dev' },
  '/math': { name: 'Math & Calculations', href: '/math' },
  '/social': { name: 'Social Media Tools', href: '/social' },
  '/pdf': { name: 'PDF Tools', href: '/pdf' },
  '/misc': { name: 'Misc Tools', href: '/misc' },
  '/data': { name: 'Data Tools', href: '/data' },
  '/file': { name: 'File Tools', href: '/file' },
  '/productivity': { name: 'Productivity Tools', href: '/productivity' },
  '/educational': { name: 'Educational Tools', href: '/educational' },
}

