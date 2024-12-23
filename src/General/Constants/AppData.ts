import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const baseFontSize = 16;
const rem = width / 375 * baseFontSize;

// const fontSizes = {
//     small: rem * (12 / baseFontSize),
//     default: rem * (14 / baseFontSize),
//     medium: rem * (16 / baseFontSize),
//     large: rem * (20 / baseFontSize),
//     extraLarge: rem * (24 / baseFontSize),
// };

const fontSizes = {
    small: (12),
    default: (14),
    medium: (16),
    large: (20),
    extraLarge: (24),
};

const AppData = {
    colors: {
        primary: "#53B175",
        secondary: "",
        danger: "#FF5653",
        warning: "#f1c40f",
        success: "#2ecc71",
        background: "#fff",
        text: {
            100: '#F9F9F9',
            200: '#EEF1FA',
            300: '#DBDFF1',
            400: '#B6BBD0',
            500: '#97A2B0',
            600: '#7E8299',
            700: '#72728B',
            800: '#494968',
            900: '#121212',
        },
    },

    fontSizes,

    spacing: {
        small: 8,
        medium: 16,
        large: 24,
    },

    borderRadius: {
        small: 4,
        medium: 8,
        large: 12,
    },

    fontFamily: {
        regular: '',
        bold: '',
        italic: '',
    },


};

export default AppData;
