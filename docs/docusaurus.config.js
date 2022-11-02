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
  url: "https://buzhifanji.github.io",
  baseUrl: "/learn-vue3/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "buzhifanji",
  projectName: "buzhifanji.github.io",
  trailingSlash: false,
  i18n: {
    defaultLocale: "zh",
    locales: ["zh"],
  },
  themes: ["mdx-v2"],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          beforeDefaultRemarkPlugins,
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve("@code-hike/mdx/styles.css"),
            require.resolve("./src/css/custom.css"),
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
          { to: "/vue/responsvie", label: "vue3", position: "left" },
          {
            href: "https://github.com/Buzhifanji/learn-vue3",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        // links: [
        //   {
        //     title: "Community",
        //     items: [
        //       {
        //         label: "Stack Overflow",
        //         href: "https://stackoverflow.com/questions/tagged/docusaurus",
        //       },
        //       {
        //         label: "Discord",
        //         href: "https://discordapp.com/invite/docusaurus",
        //       },
        //       {
        //         label: "Twitter",
        //         href: "https://twitter.com/docusaurus",
        //       },
        //     ],
        //   },
        //   {
        //     title: "More",
        //     items: [
        //       {
        //         label: "Blog",
        //         to: "/blog",
        //       },
        //       {
        //         label: "GitHub",
        //         href: "https://github.com/Buzhifanji/learn-vue3",
        //       },
        //     ],
        //   },
        // ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
