// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const { remarkCodeHike } = require("@code-hike/mdx");
// const theme = require("shiki/themes/github-dark.json");
const theme = require("shiki/themes/nord.json");

const beforeDefaultRemarkPlugins = [
  [
    remarkCodeHike,
    {
      theme,
      showCopyButton: true,
      staticMediaQuery: "not screen, (max-width: 768px)",
    },
  ],
];

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "深入Vue3系列",
  tagline: "源码的世界",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.
  i18n: {
    defaultLocale: "zh",
    locales: ["zh"],
  },
  themes: ["mdx-v2"],
  plugins: [
    [
      "@docusaurus/plugin-content-blog",
      {
        id: "vue",
        routeBasePath: "vue",
        path: "./vue",
        beforeDefaultRemarkPlugins,
      },
    ],
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          routeBasePath: "/",
          showReadingTime: true,
          // remarkPlugins: [[remarkCodeHike, { theme }]],
          beforeDefaultRemarkPlugins,
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: [
            require.resolve("./src/css/custom.css"),
            require.resolve("@code-hike/mdx/styles.css"),
          ],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Deep learn vue",
        logo: {
          alt: "learn vue Logo",
          src: "img/logo.svg",
        },
        items: [
          { to: "/vue", label: "vue3", position: "left" },
          {
            href: "https://github.com/facebook/docusaurus",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/docusaurus",
              },
              {
                label: "Discord",
                href: "https://discordapp.com/invite/docusaurus",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/docusaurus",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/facebook/docusaurus",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;