/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class", "[data-theme='dark']"],
    content: [
        "./views/**/*.{ejs, html}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ["Poppins", "sans-serif"],
                body: ["Inter", "sans-serif"],
                mono: ["IBM Plex Mono", "monospace"],
            },
            maxWidth: {
                'maage': '1400px',
              },
            colors: {
                maage: {
                    bg: {
                        DEFAULT: "#f8f9fa",
                        faint: "#fcfcfd",
                        subtle: "#f1f3f5",
                        alt: "#f3f4f6",
                        muted: "#e9ecef",
                        soft: "#eaeef0",
                        strong: "#dee2e6",
                        inverse: "#ffffff",
                    },
                    surface: "#ffffff",
                    border: "#dee2e6",

                    text: {
                        DEFAULT: "#212529",
                        muted: "#495057",
                        subtle: "#6c757d",
                        inverse: "#f8f9fa",
                        link: "#447188", // maage-secondary-600
                    },

                    success: {
                        50: "#f2fbf5",
                        500: "#4ba675",
                        600: "#3d8d61",
                    },
                    warning: {
                        50: "#fff9eb",
                        500: "#f0b429",
                        600: "#d99a1c",
                    },
                    error: {
                        50: "#fef2f2",
                        500: "#d9534f",
                        600: "#c0392b",
                    },
                    info: {
                        50: "#eef6fb",
                        500: "#5b9bd5",
                        600: "#417cbf",
                    },

                    primary: {
                        50: "#f6f9f7",
                        100: "#e6f0e9",
                        200: "#d2e4da",
                        300: "#b6d2c4",
                        400: "#93b9a8",
                        500: "#689c85",
                        600: "#508670",
                        700: "#3e6f5c",
                        800: "#335b4c",
                        900: "#2a4b40",
                        950: "#192f28",
                    },
                    secondary: {
                        50: "#f1f7f9",
                        100: "#dceaef",
                        200: "#c2d9e0",
                        300: "#a0c3cf",
                        400: "#71a3b7",
                        500: "#548fa6",
                        600: "#447188",
                        700: "#406477",
                        800: "#395160",
                        900: "#314654",
                        950: "#24333d",
                    },
                    tertiary: {
                        50: "#fefcf6",
                        100: "#fcf7e8",
                        200: "#f9eccd",
                        300: "#f5e0b2",
                        400: "#f0c98e",
                        500: "#ecc188",
                        600: "#e7b279",
                        700: "#d78f50",
                        800: "#cd793c",
                        900: "#aa6631",
                        950: "#874f2c",
                    },
                    quaternary: {
                        50: "#f6f5f9",
                        100: "#efeff5",
                        200: "#e0dfec",
                        300: "#cbc9de",
                        400: "#b3afcf",
                        500: "#9793be",
                        600: "#867ea9",
                        700: "#6c6490",
                        800: "#5a5478",
                        900: "#4a4563",
                        950: "#2d2a3c",
                    },
                    quinary: {
                        50: "#fbf6f5",
                        100: "#f8eceb",
                        200: "#f1dbda",
                        300: "#e6bebb",
                        400: "#d79895",
                        500: "#c56e6e",
                        600: "#ab4e52",
                        700: "#923e44",
                        800: "#7b363d",
                        900: "#6c323a",
                        950: "#491d22",
                    },
                    gray: {
                        50: "#f6f6f6",
                        100: "#ededed",
                        200: "#dedede",
                        300: "#c9c9c9",
                        400: "#adadad",
                        500: "#8f8f8f",
                        600: "#757575",
                        700: "#595959",
                        800: "#454545",
                        900: "#333333",
                        950: "#262626",
                    },
                    "sky-gray": {
                        50: "#f9fafb",
                        100: "#f3f4f6",
                        200: "#e5e7eb",
                        300: "#d0d5dc",
                        400: "#9aa3b1",
                        500: "#687182",
                        600: "#495465",
                        700: "#364153",
                        800: "#1e2938",
                        900: "#111828",
                        950: "#030712",
                    },
                    "gray-nickel": {
                        50: "#f8f8f7",
                        100: "#eeeeec",
                        200: "#dfdfdc",
                        300: "#ccccc7",
                        400: "#b2b1a9",
                        500: "#9a988e",
                        600: "#838177",
                        700: "#6b6961",
                        800: "#585650",
                        900: "#484742",
                        950: "#2b2a27",
                    },
                },
            },
            backgroundColor: theme => ({
                ...theme('colors'),
                'maage-default': 'var(--maage-bg-default)',
                'maage-faint': 'var(--maage-bg-faint)',
                'maage-subtle': 'var(--maage-bg-subtle)',
                'maage-alt': 'var(--maage-bg-alt)',
                'maage-muted': 'var(--maage-bg-muted)',
                'maage-soft': 'var(--maage-bg-soft)',
                'maage-strong': 'var(--maage-bg-strong)',
                'maage-inverse': 'var(--maage-bg-inverse)',
                'maage-surface': 'var(--maage-surface)',
            }),
            textColor: theme => ({
                ...theme('colors'),
                'maage-default': 'var(--maage-text-default)',
                'maage-muted': 'var(--maage-text-muted)',
                'maage-subtle': 'var(--maage-text-subtle)',
                'maage-inverse': 'var(--maage-text-inverse)',
                'maage-link': 'var(--maage-text-link)',
                'maage-primary': 'var(--maage-text-primary-color)',
                'maage-secondary': 'var(--maage-text-secondary-color)',
                'maage-tertiary': 'var(--maage-text-tertiary-color)',
                'maage-quaternary': 'var(--maage-text-quaternary-color)',
                'maage-quinary': 'var(--maage-text-quinary-color)',
            }),
            borderColor: theme => ({
                ...theme('colors'),
                'maage-default': 'var(--maage-border)',
            }),
        },
    },
    plugins: [
      ],
}