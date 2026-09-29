import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://lukedh.com",
    title: "Luke Hartley",
    description: "Personal blog and website of Luke Hartley.",
    author: "Luke Hartley",
    profile: "https://lukedh.com",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Europe/London",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: true,
      url: "https://github.com/lukehart54/lukedh/edit/main/",
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/lukehart54" },
    { name: "linkedin", url: "https://www.linkedin.com/in/luke-hartley7/" },
  ],
  // No share buttons — a personal blog doesn't need a row of social widgets.
  shareLinks: [],
});