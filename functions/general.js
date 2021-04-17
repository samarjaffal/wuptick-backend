const Colors = {
    primary: '#5271ff',
    orange: '#FFA23A',
    blue: '#41D0FF',
    green: '#00E36A',
    yellow: '#FFDE0B',
    black: '#413F4A',
    softGray: '#D6D7E0',
    gray: '#A7A8AF',
    white: '#F9FAFF',
    whitePrimary: '#FFF',
    secondary: '#BFCAFF',
    red: '#FB7B7F',
    backgroud: '#F3F5FF',
    hover: '#EDF0FF',
};

export const randomColor = () => {
    let tempColors = { ...Colors };

    let removeColors = [
        'white',
        'whitePrimary',
        'backgroud',
        'softGray',
        'hover',
        'black',
        'gray',
        'secondary',
    ];
    removeColors.forEach((e) => delete tempColors[e]);
    var keys = Object.keys(Colors);
    const color = tempColors[keys[(keys.length * Math.random()) << 0]];
    return color;
};
