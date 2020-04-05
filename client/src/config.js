const config = {
    SERVER_URL: process.env.NODE_ENV === 'production' ?
        `https://` :
        `http://${process.env.VUE_APP_SERVER_HOST}:${process.env.VUE_APP_SERVER_PORT}`,

    REQUEST_CONFIG: {
        validateStatus: () => true
    }
};

export default config;